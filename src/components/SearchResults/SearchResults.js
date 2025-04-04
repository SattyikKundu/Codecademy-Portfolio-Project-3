import { useState, useEffect } from 'react';
//import TrackList from '../Tracklist/Tracklist.js';
import Track from '../Track/Track';

import './SearchResults.css';

const SearchResults = ({searchResults, setSearchResults, playList, setPlaylist}) => {

    const addToPlayList = (trackId) => { // function to add new track to playList

        const searchCopy = [...searchResults];  // get shallow copy of searchResults array

        // .find() returns track object that matches Id
        const trackToAdd = searchCopy.find((track) => {track.id === trackId});

        // .filter() returns array of tracks that DON'T match Id input
        const newSearch = searchCopy.filter((track) => { track.id !== trackId});

        setSearchResults(newSearch); // sets new Search Result without the track
        setPlaylist([...playList,trackToAdd]); // sets new Play List with new added track
    }

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
                addToPlayList={addToPlayList}
                /> 
                )))
              }
            </div>
        </div>
    );
}

export default SearchResults;


 