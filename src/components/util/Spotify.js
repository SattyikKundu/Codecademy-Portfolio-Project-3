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
import { generateRandomString, sha256, base64encode } from "./helpers";

const clientId = 'f543695a790649369f8a548e31afb691'; // <= Client ID from Spotify developer account's dashboard
const redirectUri = 'http://localhost:3000'; // <= Where the API data gets sent towards; must match 
                                             // 'redirectUri' configured in Spotify's app dashboard.

const Spotify = {


    async redirectToSpotifyAuth() { // PKCE redirect function initiates Spotify authentication request *safely*

        // STEP 1: Create code_verifier to then generate code_challenge
        let codeVerifier = window.localStorage.getItem('code_verifier'); // checks if already in local Storage

        if (!codeVerifier || codeVerifier==='undefined' || codeVerifier===null) { // If nonexistant, create a new code_verifier
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

        // Defines which permission will be requested for app
        const scope = "user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public"; 
        /* Here are the scopes used (see: https://developer.spotify.com/documentation/web-api/concepts/scopes#list-of-scopes)
         *
         * Below 2 permissions are needed when accessing user profile
         * 'user-read-private'         read access to user's subscription details
         * 'user-read-email'           read access to user's email address
         * 
         *  Below 4 permissions are needed when creating playlists (relevant in later method):
         * 'playlist-read-private'       read access to user's private playlists
         * 'playlist-read-collaborative' includes collaborative playlists when requesting a user's playlists.
         * 'playlist-modify-private'     write access to user's private playlists
         * 'playlist-modify-public'      write access to user's public playlists
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
        const url = "https://accounts.spotify.com/api/token";       // Spotify's token endpoint url — where POST request is sent

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
        const response = await body.json();         // Parses JSON response body to extract access token and other data. 

        if(!response.access_token) { // checks if response has the access_token or throw error
            throw new Error('No access token returned!'); 
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

    },

    /* Below helper function checks if 'access_token' on localStorage has expired */
    isTokenExpired() {

        const expiration_Time = Number(localStorage.getItem('expiration_time')); // returns stored value as number
    
        if(!expiration_Time || isNaN(expiration_Time)) { // checks if expiration_Time is missing or invalid 
            console.log('Expiration time is missing OR not on localStorage.');
            return true; // isExpired() === true 
        } 

        return Date.now() > expiration_Time; // If current time past expiration_time, return TRUE, otherwise FALSE;
    },


    /* If access_token expires at any time, it needs to be refreshed using a refresh_token.
       This process is executed using the below function. To understand how the code work, read this
       article which explains the code need to refresh the access_token without reauthentication:
       https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens */
    async refreshToken() {

        const refreshToken = localStorage.getItem('refresh_token');

        if(!refreshToken) { // if refresh_token is not in local Storage, 
            return null;    // return null to end function
        }

        const url = "https://accounts.spotify.com/api/token"; // endpoint for getting new access_token

        const payload = { // payload sent to request new access_token
            method: 'POST',
            headers: {
                // This means we're sending form data in the body (URLSearchParams)
                'Content-Type': 'application/x-www-form-urlencoded' 
            },
            body: new URLSearchParams({      // constructs formatted url-encoded string from object
                grant_type: 'refresh_token', // request refresh to spotify
                refresh_token: refreshToken, // our refresh_token from Local Storage, used for refresh request
                client_id: clientId          // out app's registered clientId
            })
        }

        try {
            const body = await fetch(url, payload); // new access_token request & response
            const response = await body.json();

            if(response.error && (response.error='invalid_grant')) { // If refresh_token is invalid...

                /* Since refresh and access tokens are invalid, clear local storage and reauthenticate */
                localStorage.clear();
                this.redirectToSpotifyAuth();
            } 
            else{ // otherwise, save new access and refresh tokens in local Stroage
 
                localStorage.setItem('access_token', response.access_token);
                
                if (response.refresh_token) { 
                    localStorage.setItem('refresh_token', response.refresh_token);
                }
            }

        }
        catch(error) { // error-handing in try-catch block
            console.log('Error caught during refreshToken(): ', error);
        }
    },

    

    /* Below function returns Search Results using the input from the Seach Bex.
    See below article for more details regarding show Spotify search works: 
    https://developer.spotify.com/documentation/web-api/reference/search
    */
    async returnSearchResults(searchInput) { // returns searchResults from seachBox input

        /* formats input by removing spaces and adding '+' between words */
        let formattedInput = searchInput.trim();
        formattedInput = formattedInput.split(/\s+/).join('+')
        

        /* Inserts formatted input into enpoint url (creating Spotify search query to send via API call) */
        const endPointUrl = `https://api.spotify.com/v1/search?q=${formattedInput}&type=track`;
                  
        
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken || accessToken==='undefined' || accessToken===null) { // If access_token invalid, return to stop function
            //console.log('Access token is missing');
            return 'No access_token in localStorage';
        }
        /*
        else{
            console.log(`Current access token (returnSearchResults()): ${accessToken}`);
        }*/


        const response = await fetch( // fetch results from Spotify api

            endPointUrl, // Seach query sent to Spotify
            {
              method: 'GET', // 'GET' method using access_token below for authorization
              headers: {
                Authorization: `Bearer ${accessToken.toString()}`
              }
            }
          );

        let data = await response.json(); // stores data response

        if (data.error && data.error.message) { // Checks if error exists (and if it has message)
            return data.error.message;          // return error message
        }
        else {
            return data;// otherwise return data
        }
    },


    /* Below function takes the playList name, and the tracks' uri
       and creates a playlist (with tracks) that will be submitted
       to Spotify user's account. The setPlaylist() function is used to 
       reset playList variable once submitted */
    async savePlaylist(playListName, trackUris, setPlaylist) {

        if (!playListName || !trackUris) { // If either Playlist name or track Uris are missing,
            return;                        // return to end function.
        }

        const accessToken = localStorage.getItem('access_token'); // get access_token

        /* First fetch profile (to get your profile ID to sent your playlist to)
           See fetchProfile() code example from this link:
           https://developer.spotify.com/documentation/web-api/howtos/web-app-profile

           Also see link on response output of getting user profile:
           https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile */
        const result = await fetch(
            "https://api.spotify.com/v1/me",  // endpoint for current user's profile 
            {
                method: "GET", // standard GET request for data using access_Token for authorization
                headers: {Authorization: `Bearer ${accessToken}`}   
            });

        const profile = await result.json(); // converts result to json
        const user_id = profile.id;          // returns user id

        const endPointUrl = `https://api.spotify.com/v1/users/${user_id}/playlists` ; // save 'user_id' into endpoint

        /* Create The New Playlist:
           See this article for example of request body:
           https://developer.spotify.com/documentation/web-api/reference/create-playlist */
        const newPlaylist = await fetch(
            endPointUrl,
            {
                method: "POST", // POST request used to send data to Spotify Server to create a resource
                headers: {
                           Authorization: `Bearer ${accessToken}`, // access_Token for authorization
                           'Content-Type': 'application/json'      // indicates that we're sending JSON data
                         },
                body: JSON.stringify({  // Converts JavaScript object to JSON string (esp. for POST and PUT methods)

                    name: playListName,                                     // Playlist name
                    description: 'Modify your playlist description here.',  // placeholder playlist description
                    public: true                                            // Playlist set to 'public' by default
                }) 
            }
        );
        const createdPlaylist = await newPlaylist.json();  // convert to json
        const playlist_id = createdPlaylist.id;            // get id of new playlist

        /* Now add your tracks to playlist. See reference for more details:
           https://developer.spotify.com/documentation/web-api/reference/add-tracks-to-playlist */
        const addTracksToPlaylist = await fetch(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, // endpoint for adding tracks to playlist
            {
                method: 'POST', // POST request for adding tracks to playlist
                headers: {
                          Authorization: `Bearer ${accessToken}`, // access_Token for authorization
                          'Content-Type': 'application/json'      // indicates that we're sending JSON data
                        },
                body: JSON.stringify({ // convert JavaScript object to JSON string
                    uris: trackUris,   // List uris tells Spotify which tracks to add to created playlist
                    position: 0        // position index to start adding tracks (0 = start of playlist)
                    }) 
            }
        );

        //const tracksSent = await addTracksToPlaylist.json();
        //console.log('Tracks sent to new playlist: ',tracksSent);

        setPlaylist([]); // After playlist has been submitted, 'playList' storage is resetted
    }
}

export default Spotify;



