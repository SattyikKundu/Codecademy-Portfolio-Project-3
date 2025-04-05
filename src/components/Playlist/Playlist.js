import Track from '../Track/Track';
import './Playlist.css'; // styling

const PlayList = ({playList, setPlaylist}) => {

    const removeTrack = (trackId) => { // function to drop track from current playlist

        const shallowCopy = [...playList]; // save shallow copy
        
        // return all tracks, except for the dropped track
        const newPlaylist = shallowCopy.filter((track) => track.id !== trackId);
        
        setPlaylist(newPlaylist); // save new playlist without dropped track
    }



    return (
        <div class="Playlist">
            <input placeholder='Enter New Playlist Name...' />
            <div className="PlayList-Display">
              { 
              (!playList || playList.length===0)
              ? (<p>No tracks added yet...</p>)
              : (playList.map((track) => (
                <Track
                  key={track.id}
                  track={track}
                  removeTrack={removeTrack}
                />
              )))
               }
            </div>
        </div>
    );
}

export default PlayList;