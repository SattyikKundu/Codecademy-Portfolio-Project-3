// components to import
import SearchBar from "../components/SearchBar/SearchBar.js";
import SearchResults from "../components/SearchResults/SearchResults.js";
import PlayList from "../components/Playlist/Playlist.js";

//other imports
import Spotify from "../components/util/Spotify.js"; // import for handling Spotify API calls
import { useState, useEffect } from "react";         // import React features for functionality
import './App.css';                                  // styling

const App = () => {

    const [searchInput,   setSearchInput]   = useState('');   // Tracks input for Search box (used for testing)
    const getInput = (searchText) => { setSearchInput(searchText) };

    const [accessToken,   setAccessToken]   = useState(null); // Tracks access token for Spotify API
    const [refreshToken,  setRefreshToken]  = useState(null); // Tracks refresh token used to refresh expired access token
    const [tokenExpires,  setTokenExpires]  = useState(null); // Tracks expiration time of access token
    const [searchResults, setSearchResults] = useState([]);   // Tracks search result array after submitting search box
    const [playList,      setPlaylist]      = useState([]);   // Tracks user choices for which tracks join playlist

    

    return(
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