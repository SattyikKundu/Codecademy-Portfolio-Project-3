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
