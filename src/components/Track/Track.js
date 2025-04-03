import { useState, useEffect } from "react";
import './Track.css';


const Track = ({track}) => {

    if(!track) { return null} ; // checks for track before rendering.

    return(
        <div className="Track">
            <img 
                src={track.imageUrl}    
                alt={`${track.name} album cover`} 
                className="Track-img" 
            />
            <div className="Track-Info"> 
                <h3>{track.name}</h3>
                <div className="dscrpt-text"><strong>Artist(s):</strong> {track.artist} </div>
                <div className="dscrpt-text"><strong>Album:</strong> {track.album}</div>
            </div>
        </div>
    );
}

export default Track;