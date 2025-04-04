import { useState, useEffect } from "react";
import './Track.css';


const Track = ({track, addToPlayList}) => {



    return(
        <div className="Track">
            <img 
                src={track.imageUrl}    
                alt={`${track.name} album cover`} 
                className="Track-img" 
            />
            <div className="Track-Info"> 
                <h3>{track.name}</h3>
                <div className="description"><strong>Artist(s):</strong> {track.artist} </div>
                <div className="description"><strong>Album:</strong> {track.album}</div>
                {/* <div className="description"><strong>key:</strong> {track.id}</div> */}
            </div>
            <div 
                className="add-to-playlist"
                onClick={() => addToPlayList(track.id)}
                >
                +
            </div>
        </div>
    );
}

export default Track;