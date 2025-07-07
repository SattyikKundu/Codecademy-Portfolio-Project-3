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

  return (
    <div className="App-wrapper">
      {/* In <h1> below, replace 'Jammming' title */}
      <div id="App-header-title">Spotify Playmix</div>
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