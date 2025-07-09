// components to import
import LogoutButtons from "../components/LogoutButtons/LogoutButtons.js";
import SearchBar     from "../components/SearchBar/SearchBar.js";
import SearchResults from "../components/SearchResults/SearchResults.js";
import PlayList      from "../components/Playlist/Playlist.js";

// other imports
import { useState } from "react";   // import React features for functionality
import './App.css';                 // styling

const App = () => {

  const [searchResults, setSearchResults] = useState([]); // Tracks search result array after submitting search box
  const [playList,           setPlaylist] = useState([]); // Tracks user choices for which tracks join playlist

  const getIsLoggedIn = () => { // Checks if user is 'logged in' by checking if various authentication tokens 
                                // (access and refresh tokens) are inside the localStorage

    /* Get tokens in localStorage */
    const accessToken    = localStorage.getItem("access_token");
    const refreshToken   = localStorage.getItem("refresh_token");
    const expirationTime = localStorage.getItem("expiration_time"); // optional for future logic

    const isTokenValid = (token) => { // checks token validity (if it's not null or undefined)
      return token && token !== 'undefined' && token !== 'null' && token !== null;
    }

    const notExpired = () => { // checks expiration time
      const now = Date.now();
      return expirationTime && parseInt(expirationTime) > now;
    };

    return isTokenValid(accessToken) && isTokenValid(refreshToken) && notExpired();; // finally, return true or false
  };

  /* Set true/false depending on IF user has all tokens needed to authentication */
  const [loggedIn, setLoggedIn] = useState(getIsLoggedIn);

  return (
    <div className="App-wrapper">
      <div id="App-header-title">
        <span>Ja<span style={{color:'#8212de'}}>mmm</span>ing</span>
        {/* Add this back in when app login/logout is improved upon. */}
        {/*<LogoutButtons loggedIn={loggedIn} />*/}
      </div>
      <div className="App">
        <SearchBar 
          setSearchResults = {setSearchResults} // pass setSearchResults() and various tokens as props
          loggedIn         = {loggedIn}
          setLoggedIn      = {setLoggedIn}
        />
        <div className="SearchOutput-and-Playlist">
          <SearchResults 
            searchResults    = {searchResults}
            setSearchResults = {setSearchResults}
            playList         = {playList}
            setPlaylist      = {setPlaylist}
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