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

  //const [codeVerifier, setCodeVerfier] = useState('');
  //const [authCode, setAuthCode]        = useState('');

  //const [accessToken,   setAccessToken]   = useState(null); // Tracks access token for Spotify API
  //const [refreshToken,  setRefreshToken]  = useState(null); // Tracks refresh token used to refresh expired access token
  //const [tokenExpires,  setTokenExpires]  = useState(null); // Tracks expiration time of access token

  const [searchResults, setSearchResults] = useState([]); // Tracks search result array after submitting search box
  const [playList, setPlaylist]           = useState([]); // Tracks user choices for which tracks join playlist
  //const [playListName, setPlaylistName]   = useState('');

  // function to add track from 'searchResults' to 'playList'



  useEffect(() => {// checks for Authentication AS SOON AS App mounts

    const authenticateApp = async () => { // Checks if these authentication values are in localStorage (see Spotify.js to learn more)

      let accessToken = localStorage.getItem("access_token"); // checks if access_token is in storage
      let refreshToken = localStorage.getItem("refresh_token"); // checks if refresh_token is in storage
      let expirationTime = localStorage.getItem("expiration_time"); // check if access_token is expired (if exists)

      console.log("(start) Access token:  ", accessToken);
      console.log("(start) Refresh token: ", refreshToken);
      console.log(`(start) Current time:${Date.now()} |  ExpirationTime:${expirationTime}`);

      // If EITHER 'access_token' or 'refresh_token' is missing, undefined, or null..
      if ((!accessToken || accessToken==='undefined' || accessToken===null) || (!refreshToken || refreshToken==="undefined" || refreshToken===null)) {

        console.log('inside giant IF statement');

        let urlParams = new URLSearchParams(window.location.search); // checks if auth. 'code' is already in url parameters
        let code = urlParams.get("code");

        console.log('Code is......: ',code);

        if (code && code !== "") {  // If 'code' exists and isn't empty, proceed...

          console.log("There initially is 'code' in url.");
          await Spotify.getToken(code); // generate and save new access_token, refresh_token,
                                          // and expiration_time to localStorage

          window.history.replaceState({}, document.title, "/"); // Scrubs 'code' param data from url

          accessToken = localStorage.getItem("access_token"); // checks if access_token is in storage
          refreshToken = localStorage.getItem("refresh_token"); // checks if refresh_token is in storage
          expirationTime = localStorage.getItem("expiration_time"); // check if access_token is expired (if exists)
          console.log("(c)Access token:  ", accessToken); // Check new values in local Storage
          console.log("(c)Refresh token: ", refreshToken);
          console.log(`(c)Current time:${Date.now()} | ExpirationTime:${expirationTime}`);

        } else { // There's no tokens nor 'code' available. Reauthenticate
            console.log('No tokens nor "code", need to reauthenticate');
            Spotify.redirectToSpotifyAuth(); // Authenticate, get 'code', and store all params in localStorage

            //urlParams = new URLSearchParams(window.location.search);
            //code = urlParams.get("code");
            //await Spotify.getToken(code);
        }
      }
      else{ // Otherwise, both access and refresh tokens exist

        if(Spotify.isTokenExpired()){ // if authentucate token expired, reauthenticate
            console.log('access (& refresh) token exist, but is expired');
            await Spotify.refreshToken();
            //localStorage.clear(); // clear local storage of params
            //Spotify.redirectToSpotifyAuth(); // reauthenticate (later replace with refreshToken() command!)
        }
        else{ // access_token is NOT expired 
            console.log('access_token is still valid');
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
        <SearchBar 
        //onSearch={setSearchInput} 
        setSearchResults={setSearchResults} 
        />
        <div className="SearchOutput-and-Playlist">
          <SearchResults 
            searchResults   = {searchResults}
            setSearchResults= {setSearchResults}
            playList        = {playList}
            setPlaylist     = {setPlaylist}
          />
          <PlayList 
            playList    = {playList}
            setPlaylist = {setPlaylist}
            //setPlaylistName = {setPlaylistName}
          /> 
        </div>
      </div>
    </div>
  );
}

export default App;