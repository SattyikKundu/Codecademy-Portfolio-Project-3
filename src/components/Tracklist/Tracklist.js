import { useState, useEffect } from "react";
import Track from '../Track/Track.js';
import './Tracklist.css';

const TrackList = ({searchResults}) => {

    if(!searchResults || searchResults.length===0) {return <p>No results found!</p>}

    return (
        <>
        {
            searchResults.map((track) => {
                return (
                    <Track 
                        key={track.id}
                        track={track}
                    />
                );
            })
        }
        </>
    );
}

export default TrackList;