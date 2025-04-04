import { useState, useEffect } from 'react';
//import TrackList from '../Tracklist/Tracklist.js';
import Track from '../Track/Track';

import './SearchResults.css';

const SearchResults = ({searchResults, setPlaylist}) => {

    return(
        <div className="Search-Results">
            <h2> Results </h2>
            <div className="Search-Results-Display">
              { 
              (!searchResults || searchResults.length===0)
              ? (<p>Enter and Submit your Search!</p>)
              : (searchResults.map((track) => (
              <Track 
                key={track.id} 
                track={track}
                //setPlaylist={setPlaylist}
                /> 
                )))
              }
            </div>
        </div>
    );
}

export default SearchResults;


 