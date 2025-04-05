import Track from '../Track/Track';
import './Playlist.css'; // styling
import '../util/Spotify.js';
import { useState } from 'react';


const PlayList = ({playList, setPlaylist}) => {

    const[listName, setListName] = useState(''); // stores name of playlist as user types

    const updateName = (event) => { // function updates playlist name as user types
        setListName(event.target.value);
    }

    const removeTrack = (trackId) => {     // function to drop track from current playlist
        const shallowCopy = [...playList]; // save shallow copy
        const newPlaylist = shallowCopy.filter((track) => track.id !== trackId); // return all tracks except for removed track
        setPlaylist(newPlaylist);          // save new playlist without dropped track
    }

    //const submitPlaylist(playList) { } // used to submit playlist to Spotify account

    return (
        <div class="Playlist">
            <input 
                placeholder='Enter New Playlist Name...' 
                value={listName}
                onChange={(event) => updateName(event)}    
            />
            <div className="PlayList-Display">
              {/* .map() used to display all current tracks in Playlist */}
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
            <div className='button-space'>
                {/* (INCOMPLETE) Playlist submission button appears under certain conditions */}
                {
                    (playList.length >0)
                    ? <div className='submit-button'>Submit Playlist</div>
                    : none
                }
            </div>
        </div>
    );
}

export default PlayList;