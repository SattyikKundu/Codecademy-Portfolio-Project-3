import { useState } from 'react';
import Spotify from '../util/Spotify';
import './SearchBar.css';


const SearchBar = ({setSearchResults}) => {

    const [onTypeInput, setOnTypeInput] = useState(''); // stores input value as it's being typed

    const typeSearch = (event) => { // used to track and show text as its typed in search box
        setOnTypeInput(event.target.value);
    }

    const formatData = (data) => { 
        // Function ensures that output is formatted properly before storing. This helps 
        // ensure that all parameter values will be passed properly to other components. 

        if (data && data.tracks.items) { // Checks if data exists and if 'items' nested in data is found

            // Below .map() returns a JavaScript object FOR EACH track
            const formattedTracks = data.tracks.items.map(track => {
                
                /* 1st format names of artists for track */
                const artistNames = track.artists.map(artist => artist.name); // Extract artist names

                let formattedArtists; // Format names of artists for each track based on # of artists 
                if(artistNames.length === 1){
                    formattedArtists = `'${artistNames[0]}'`;
                } 
                else if (artistNames.length === 2) {
                    formattedArtists = `'${artistNames[0]}' & '${artistNames[1]}'`;
                }
                else {
                    formattedArtists = `'${artistNames[0]}', '${artistNames[1]}', etc.`;
                }
                
                /* 2nd, convert track duration from milliseconds to minutes:seconds format (ex: 3:04) */
                const trackTime = track.duration_ms;
                const minutes = Math.floor(trackTime / 60000);
                const seconds = Math.floor((trackTime % 60000) / 1000);
                const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
                const duration =  minutes + ':' + formattedSeconds;

                return { // final JavaScript object that contains important track information
                    id: track.id,
                    name: track.name,
                    artist: formattedArtists,
                    duration: duration,
                    album: track.album.name,
                    imageUrl: track.album.images[0]?.url || '', //handles case where there's no image
                    uri: track.uri,
                }
        });
        return formattedTracks; // returns all tracks as formatted
        }            
    }

    const fetchResults = async () => {

        if (onTypeInput==='') { return null;} // If search term empty/missing, return null ends function

        const searchResultsData = await Spotify.returnSearchResults(onTypeInput);

        if (searchResultsData === 'The access token expired') { // If token expired, refresh it

            Spotify.refreshToken(); // refresh access_token (and store updated parameters in localStorage)
            fetchResults();         // re-run fetchResults() after refreshing token 
        }
        else {
            setSearchResults(formatData(searchResultsData));  // save Search Output (after formatting data)
        }
    }


    return(
        <div className="Search-Bar">
            <input 
                placeholder='Enter a Track Title'
                value={onTypeInput} 
                onChange={(event) => typeSearch(event)}  
            />
            <div 
                className="Search-Button" 
                onClick={fetchResults}
            >
                SEARCH
            </div>
        </div>
    );
}

export default SearchBar;