/*

PKCE (Proof key for Code Exchange) is recommended authorization 
flow for most modern mobile app, single-page web apps, or any other applications
where the client's secret can't be stored safely. In comparison,
"Implicit flow" has been deprecated due to security flaws (read more about it here:
https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow).

The implementaion of PKCE auth. flow consists of these main steps:
1. Use 'code_verifier' to generate 'code_challenge' 
2. Use clientId, redirectUri, code_challenge, and other parameters to
   request authorization from Spotify to retrieve authorization code(called 'code').
3. Using acquired authorization from (and saved code_verifier from step#1),
   request access token from Spotify.
4. Lastly, use obtained access token for API calls.

For full guide on general code needed to execute the PKCE flow, check this article:
https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

In the below 'Spotify' object literal (which holds all exportable methods), the
redirectToSpotifyAuth() and getToken() methods were created based on PKCE auth flow
within the above article.
*/

// First, import helper functions essential for the Code challenge generation
import { generateRandomString, sha256, base64encode, isTokenExpired } from "./helpers";

const clientId = 'f543695a790649369f8a548e31afb691'; // <= Client ID from Spotify developer account's dashboard
const redirectUri = 'http://localhost:3000'; // <= Where the API data gets sent towards; must match 'redirectUri' configured in Spotify's app dashboard.

const Spotify = {

    async redirectToSpotifyAuth() { // PKCE redirect function initiates Spotify authentication request *safely*

        // STEP 1: Create code_verifier to then generate code_challenge
        let codeVerifier = window.localStorage.getItem('code_verifier'); // checks if already in local Storage

        if (!codeVerifier) { // If nonexistant, create a new code_verifier
            codeVerifier = generateRandomString(64);
            window.localStorage.setItem('code_verifier', codeVerifier);
        }

        // Complete code challenge generation using sha256() and base64encode() helper functions
        const hashed = await sha256(window.localStorage.getItem('code_verifier')); // Generate hash of code_verifier via sha256()
        const codeChallenge = base64encode(hashed); // Convert hash to base64url-encoded string - this is the 'code_challenge'
                                                    // This is sent as part of auth request and will be matched later to Spotify.

        /* STEP 2: Use clientId, redirectUri, code_challenge, and other parameters to
                   request authorization from Spotify and retrieve authorization code */

        const authUrl = new URL('https://accounts.spotify.com/authorize'); // New URL object points to authorization endpoint

        const scope = 'user-read-private user-read-email'; // Defines which permission will be requested for app
        /* Here are the scopes used (see: https://developer.spotify.com/documentation/web-api/concepts/scopes)
         * 'user-read-private'      read access to user's subscription details
         * 'user-read-email'        read access to user's email address
         */


        const params = { // Define needed 'PKCE+OAuth' url query parameters for authorization request
            response_type: 'code',         // Required: Tells Spotify to give us authorization code (standard OAuth flow)
            client_id: clientId,           // Required: Your app's registered Client ID (found in app within Spotify Account)
            redirect_uri: redirectUri,     // Required: Where Spotify sends user after login (Must match URI you listed in Spotify account's Dashboard)
            scope,                         // Optional: Space-separated list of permissions your app needs
          //state: 'xyz123',               // Optional (but recommended): Random string to prevent CSRF attacks 
            code_challenge_method: 'S256', // Required: Tells Spotify we're using PKCE hashing method SHA-256 for code challenge
            code_challenge: codeChallenge, // Required: The SHA-256 hashed + base64url-encoded version of codeVerifier
            show_dialog: 'true',           // Optional: forces Spotify to show the login/consent screen every time
        }

        authUrl.search = new URLSearchParams(params).toString();
        /* Above converts 'params' object into a proper query string like:
         * 'response_type=code&client_id=...&redirect_uri=...&scope=...&code_challenge=...&code_challenge_method=S256'
         * Then appends query string to 'authUrl' url object from earlier to complete full URL.
         * The final URL looks something like: https://accounts.spotify.com/authorize?response_type=code&client_id=...
         */

        window.location.href = authUrl.toString();
        /* Above converts complete 'authUrl' (base + query string) to string,
         * and then assigns it to 'window.location.href', which immediately navigates browser to URL.
         * This redirects user to Spotify’s authorization page so users can log in and gain access.
         */

        /* VERY IMPORTANT: After login, the user is redirected to 'redirectUri' which includes the 'code' param
         *                 value in urlParams(ex: http://localhost:3000/?code=ZAXNw5Uww...34hfa9f34...). 
         *                 The 'code' value must be extracted before using it in getToken(code) function later on.
         */
    },

    // STEP 3: Using authorization code (and saved code_verifier from STEP #1), request access token from Spotify
    async getToken(code) { // Function exchanges authorization code for access token

        const codeVerifier = localStorage.getItem('code_verifier'); // Get code_verifier from localStorage
        const url = "https://accounts.spotify.com/api/token"; // Spotify's token endpoint url — where POST request is sent

        /* Construct POST request payload to exchange code for access token */
        const payload = {
            method: 'POST',  // Sends data via POST method
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded', // Required header tells Spotify its being sent form-encoded data
            },
            body: new URLSearchParams({
              client_id: clientId,              // Required: Your app's client ID (from Spotify Developer Dashboard)  
              grant_type: 'authorization_code', // Required: Identifies type of OAuth flow we're using
              code,                             // Required: The authorization code returned by Spotify 
                                                          // after the user logs in and approves access
              redirect_uri: redirectUri,        // Required: Must match 'redirect_uri' used in initial auth request
                                                          // Used for verification, but redirect later.
              code_verifier: codeVerifier,      // Required: This is the same code_verifier you generated and stored earlier.
                                                          // Spotify used this to match the 'code_challenge' prevsiously sent
                                                          // in order to verify if its the SAME sender!
            }),
        };


        const body     = await fetch(url, payload); // Send POST request, with payload, to Spotify's token endpoint.
        const response = await body.json(); // Parses JSON response body to extract access token and other data. 

        if(!response.access_token) { // checks if response has the access_token
            throw new Error('No access token returned!'); // Otherwise, throw error
        }

        /* Store access_token into localStorage for use in Spotify API calls.
           This token is needed in the Authorization header (as a Bearer token) */
        localStorage.setItem('access_token', response.access_token);

        /* Also store refresh_token which can be used whenver access_token expires  */
        localStorage.setItem('refresh_token', response.refresh_token);

        /* Lastly, return and store expiration time. Since access tokens expire after 1 hour,
           store the expiration time, which can be used to occassionally check if access_token has expired. 
         */
        const timeLeftToExpire = response.expires_in;                   // gets remaining time in seconds (from response)
        const expirationTime = Date.now() + (timeLeftToExpire * 1000);  // Adds remaining time (as milliseconds) to current time
        localStorage.setItem('expiration_time', expirationTime);        // Saves expiration time to localStorage

        //return [response.access_token, response.refresh_token, response.expires_in];
    },

    /* Below helper function checks if 'access_token' on localStorage has expired */
    isTokenExpired() {
        const expiration_Time = Number(localStorage.getItem('expiration_time')); // returns stored value as number
    
        if(!expiration_Time || isNaN(expiration_Time)) { // checks for missing and invalid  values
            console.log('Expiration time is missing OR not on localStorage.');
            return false; 
        } 
        else {
            return Date.now() < expiration_Time; // otherwise, checks expiration like normal.
        }
    }
}