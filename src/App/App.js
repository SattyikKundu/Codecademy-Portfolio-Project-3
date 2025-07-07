// components to import
import SearchBar from "../components/SearchBar/SearchBar.js";
import SearchResults from "../components/SearchResults/SearchResults.js";
import PlayList from "../components/Playlist/Playlist.js";

// other imports
import { useState } from "react";         // import React features for functionality
import './App.css';                                  // styling

const App = () => {

  const [searchResults, setSearchResults] = useState([]); // Tracks search result array after submitting search box
  const [playList, setPlaylist]           = useState([]); // Tracks user choices for which tracks join playlist

  /* Get tokens in localStorage */
  // let accessToken    = localStorage.getItem("access_token"); // checks if access_token is in storage
  // let refreshToken   = localStorage.getItem("refresh_token"); // checks if refresh_token is in storage
  // let expirationTime = localStorage.getItem("expiration_time"); // check if access_token is expired (if exists)

  const isTokenValid = (token) =>
    token && token !== 'undefined' && token !== 'null' && token !== null;

  const getIsLoggedIn = () => {
    const accessToken    = localStorage.getItem("access_token");
    const refreshToken   = localStorage.getItem("refresh_token");
    const expirationTime = localStorage.getItem("expiration_time"); // optional for future logic


    const isTokenValid = (token) =>
      token && token !== 'undefined' && token !== 'null' && token !== null;

    const notExpired = () => {
      const now = Date.now();
      return expirationTime && parseInt(expirationTime) > now;
    };

    return isTokenValid(accessToken) && isTokenValid(refreshToken);
  };

  /* Set true/false depending on IF user has all tokens needed to authentication */
  const [loggedIn, setLoggedIn] = useState(getIsLoggedIn);


  return (
    <div className="App-wrapper">
      {/* In <h1> below, replace 'Jammming' title */}
      <div id="App-header-title">Spotify Playmix</div>
      <div className="App">
        <SearchBar 
          setSearchResults={setSearchResults} // pass setSearchResults() and various tokens as props
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          //accessToken={accessToken}
          //refreshToken={refreshToken}
          //expirationTime={expirationTime}
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