import { useState, useEffect } from "react";
import './Track.css';


const Track = ({track}) => {

    //if(!track) { return null} ; // checks for track before rendering.

    const [playing, setPlaying] = useState(false);
    const [previewClip] = useState(track.previewUrl ? new Audio(track.previewUrl) : null); 
    const [error, setError] = useState('');

    const playPreview = () => {
        if(!previewClip) {
            setError("There's now preview clip for track!");
            return;
        }
        if (playing) {
            previewClip.pause();
            setPlaying(false);
        }
        else if (!playing) {
            previewClip.play();
            setPlaying(true);
        }
    }

    useEffect(()=>{
        const handlePreviewEnd = () => {setPlaying(false)}; // referred function for EventListener
        if(previewClip) { // Adds eventListener() to detect end of audio
            previewClip.addEventListener('ended', handlePreviewEnd);
        }
        return () => { // remove eventListener() when component dismounts 
            previewClip.removeEventListener('ended',handlePreviewEnd);
        }
    },[playing]);

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
            </div>
            {
                track.previewUrl 
                ? (<div className="preview-Bttn" onClick={playPreview}>
                    {playing? '||' :'▶'}
                </div>)
                :(<div className="info-Bttn">
                    ℹ
                </div>)
            }
        </div>
    );
}

export default Track;