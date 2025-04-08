// components to import
import SearchBar from "../components/SearchBar/SearchBar.js";
import SearchResults from "../components/SearchResults/SearchResults.js";
import PlayList from "../components/Playlist/Playlist.js";

// other imports
import Spotify from "../components/util/Spotify.js"; // import for handling Spotify API calls
import { useState, useEffect } from "react";         // import React features for functionality
import './App.css';                                  // styling

const App = () => {

  const [searchResults, setSearchResults] = useState([]); // Tracks search result array after submitting search box
  const [playList, setPlaylist]           = useState([]); // Tracks user choices for which tracks join playlist


  useEffect(() => {// checks for Authentication AS SOON AS App mounts

    const authenticateApp = async () => { // Checks if these authentication values are in localStorage (see Spotify.js to learn more)

      let accessToken    = localStorage.getItem("access_token"); // checks if access_token is in storage
      let refreshToken   = localStorage.getItem("refresh_token"); // checks if refresh_token is in storage
      let expirationTime = localStorage.getItem("expiration_time"); // check if access_token is expired (if exists)

      // If EITHER 'access_token' or 'refresh_token' is missing, undefined, or null..
      if ((!accessToken || accessToken==='undefined' || accessToken===null) || (!refreshToken || refreshToken==="undefined" || refreshToken===null)) {

        let urlParams = new URLSearchParams(window.location.search); // checks if auth. 'code' is already in url parameters
        let code = urlParams.get("code");

        if (code && code !== "") {  // If 'code' exists and isn't empty, proceed...

          await Spotify.getToken(code); // generate and save new access_token, refresh_token,
                                          // and expiration_time to localStorage

          window.history.replaceState({}, document.title, "/"); // Scrubs 'code' param data from url

          accessToken = localStorage.getItem("access_token"); // checks if access_token is in storage
          refreshToken = localStorage.getItem("refresh_token"); // checks if refresh_token is in storage
          expirationTime = localStorage.getItem("expiration_time"); // check if access_token is expired (if exists)

        } 
        else { // There's no tokens nor 'code' available. Reauthenticate
            Spotify.redirectToSpotifyAuth(); // Authenticate, get 'code', and store all params in localStorage
        }
      }
      else{ // Otherwise, both access and refresh tokens exist

        if(Spotify.isTokenExpired()){ // if authentucate token expired, reauthenticate
            await Spotify.refreshToken();
        }
        else{       // access_token is NOT expired 
            return; // exists function since token is valid
        }
      }
    };

    authenticateApp();

  }, []); // empty array([]) ensures that useEffect only runs one, which is during App mounting.

  return (
    <div className="App-wrapper">
      {/* In <h1> below, replace 'Jammming' title */}
      <h1>Spotify PlayMix</h1>
      <div className="App">
        <SearchBar 
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
          /> 
        </div>
      </div>
    </div>
  );
}

export default App;