import { useState, useEffect } from 'react';
import TrackList from '../Tracklist/Tracklist.js';

import './SearchResults.css';

//const SearchResults = ({searchResults, setPlaylist}) => {

const SearchResults = ({searchResults}) => {

    return(
        <div className="Search-Results">
            <h2> Results </h2>
            {/* Add more later */}
            <div className="search-Results-Display">
                <TrackList 
                    searchResults={searchResults} 
                />
            </div>
        </div>
    );
}

export default SearchResults;

