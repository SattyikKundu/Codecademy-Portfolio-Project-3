import './Track.css';

const Track = ({track, addToPlayList, removeTrack}) => {

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
                <div className="description"><strong>Duration:</strong> {track.duration}</div>
            </div>
            {/* Button changes depending on if track is in <SearchResults> or <PlayList> component */}
                {(addToPlayList) 
                ?(<div className='add-to-playlist' onClick={() => addToPlayList(track.id)}>+</div>)
                :(<div className='drop-from-playlist' onClick={() => removeTrack(track.id)}><span>-</span></div>)}
        </div>
    );
}

export default Track;