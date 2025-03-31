// components to import
import SearchBar from "../components/SearchBar/SearchBar.js";
import SearchResults from "../components/SearchResults/SearchResults.js";
import PlayList from "../components/Playlist/Playlist.js";

//other imports
import Spotify from "../components/util/Spotify.js"; // import for handling Spotify API calls
import { useState, useEffect } from "react";         // import React features for functionality
import './App.css';                                  // styling

const App = () => {

    return(
        <div>
            {/* In <h1> below, replace 'Jammming' title */}
            <h1>Spotify PlayList Maker</h1>

            
            <div className="App">
                <SearchBar />
                <div className="App-playlist">
                    <SearchResults />
                    <PlayList />
                </div>
            </div>
        </div>
    );
}

export default App;