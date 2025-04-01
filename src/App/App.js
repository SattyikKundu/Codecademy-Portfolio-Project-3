// components to import
import SearchBar from "../components/SearchBar/SearchBar.js";
import SearchResults from "../components/SearchResults/SearchResults.js";
import PlayList from "../components/Playlist/Playlist.js";

//other imports
import Spotify from "../components/util/Spotify.js"; // import for handling Spotify API calls
import { useState, useEffect } from "react";         // import React features for functionality
import './App.css';                                  // styling

const App = () => {
  const [searchInput, setSearchInput] = useState(""); // Tracks input for Search box (used for testing)
  const getInput = (searchText) => {
    setSearchInput(searchText);
  };

  //const [codeVerifier, setCodeVerfier] = useState('');
  //const [authCode, setAuthCode]        = useState('');

  //const [accessToken,   setAccessToken]   = useState(null); // Tracks access token for Spotify API
  //const [refreshToken,  setRefreshToken]  = useState(null); // Tracks refresh token used to refresh expired access token
  //const [tokenExpires,  setTokenExpires]  = useState(null); // Tracks expiration time of access token

  const [searchResults, setSearchResults] = useState([]); // Tracks search result array after submitting search box
  const [playList, setPlaylist] = useState([]); // Tracks user choices for which tracks join playlist

  useEffect(() => {// checks for Authentication AS SOON AS App mounts

    const authenticateApp = async () => { // Checks if these authentication values are in localStorage (see Spotify.js to learn more)

      let accessToken = localStorage.getItem("access_token"); // checks if access_token is in storage
      let refreshToken = localStorage.getItem("refresh_token"); // checks if refresh_token is in storage
      let expirationTime = localStorage.getItem("expiration_time"); // check if access_token is expired (if exists)

      console.log("(start) Access token:  ", accessToken);
      console.log("(start) Refresh token: ", refreshToken);
      console.log(`(start) Current time:${Date.now()} |  ExpirationTime:${expirationTime}`);

      // If EITHER 'access_token' or 'refresh_token' is missing, undefined, or null..
      if ((!accessToken || accessToken !== "undefined" || accessToken !== null) || (!refreshToken || refreshToken !== "undefined" || refreshToken !== null)) {

        let urlParams = new URLSearchParams(window.location.search); // checks if auth. 'code' is already in url parameters
        let code = urlParams.get("code");

        if (code && code !== "") {  // If 'code' exists and isn't empty, proceed...

          try {
            console.log("There initially is 'code' in url.");
            await Spotify.getToken(code); // generate and save new access_token, refresh_token,
                                          // and expiration_time to localStorage

            window.history.replaceState({}, document.title, "/"); // Scrubs 'code' param data from url

            console.log("Access token:  ", accessToken); // Check new values in local Storage
            console.log("Refresh token: ", refreshToken);
            console.log(`Current time:${Date.now()} | ExpirationTime:${expirationTime}`);
          } 
          catch (error) {
            console.log("Error executing getToken() inside useEffect()");
            Spotify.authenticateApp(); // reauthenticate to get new 'code' when this useEffect() and authenticateApp() runs again.
          }
        }
      }
      else{ // Otherwise, both access and refresh tokens exist

        if(Spotify.isTokenExpired() === false){ // Checks if access token expired
            console.log('access & refresh token already exist');

        }
        else{ // token is expired
            console.log('access_token is expired and needs to be replaced');
            Spotify.authenticateApp();
        }
      }
    };

    authenticateApp();

  }, []); // empty array([]) ensures that useEffect only runs one, which is during App mounting.

  return (
    <div>
      {/* In <h1> below, replace 'Jammming' title */}
      <h1>Spotify PlayList Maker</h1>

      <div className="App">
        <SearchBar onSearch={getInput} />
        <p>Submitted input is: {searchInput}</p>
        <div className="App-playlist">
          <SearchResults />
          <PlayList />
        </div>
      </div>
    </div>
  );
}

export default App;