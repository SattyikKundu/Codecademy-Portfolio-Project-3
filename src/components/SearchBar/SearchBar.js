import { useState } from 'react';
import Spotify from '../util/Spotify';
import './SearchBar.css';

const SearchBar = ({setSearchResults, loggedIn, setLoggedIn}) => {

    const [onTypeInput, setOnTypeInput] = useState(''); // stores input value as it's being typed

    /*************************************************************************************************************/
    /********************* All functions for the Search Bar component ********************************************/
    /*************************************************************************************************************/

    // #1: used to track and show text as its typed in search box
    const typeSearch = (event) => { 
        setOnTypeInput(event.target.value);
    }

    // #2: Checks if these authentication values are in localStorage (see Spotify.js to learn more)
    const authenticateApp = async () => { 

        if(!loggedIn) { // If EITHER 'access_token' or 'refresh_token' is missing, undefined, or null, user is NOT logged-in

            let urlParams = new URLSearchParams(window.location.search); // checks if auth. 'code' is already in url parameters
            let code      = urlParams.get("code");

            if (code && code !== "") {  // If 'code' exists and isn't empty, proceed...

                await Spotify.getToken(code); // generate and save new access_token, refresh_token,
                                              // and expiration_time to localStorage

                setLoggedIn(true);

                window.history.replaceState({}, document.title, "/"); // Scrubs 'code' param data from url

            } 
            else { // There's no tokens nor 'code' available. Reauthenticate
                alert("You need to first login to your Spotify account in order to search for tracks as well as create & save playlists. Click the 'OK' button to proceed with account login."); // first give notice to user
                Spotify.redirectToSpotifyAuth(); // Authenticate, get 'code', and store all params in localStorage
                return;                          // prevents function from calling below else() block since redirectToSpotifyAuth() doesn't immediately trigger
            }
        }
        else{ // Otherwise, both access and refresh tokens exist

            if(Spotify.isTokenExpired()) { // if authentucate token expired, reauthenticate
                await Spotify.refreshToken();
                setLoggedIn(true);
            }
            else {      // access_token is NOT expired 
                return; // exists function since token is valid
            }
        }
    };


    /* #3: Function ensures that search results output (which contains JSON data of various tracks) 
     *     is formatted properly before storing. This helps ensure that all parameter values will be 
     *     passed properly to other components. 
     */
    const formatData = (data) => { 

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
                    id:       track.id,
                    name:     track.name,
                    artist:   formattedArtists,
                    duration: duration,
                    album:    track.album.name,
                    imageUrl: track.album.images[0]?.url || '', //handles case where there's no image
                    uri:      track.uri,
                }
        });
        return formattedTracks; // returns all tracks as formatted
        }            
    }

    // #4: Featch search results after entering into search bar
    const fetchResults = async () => {

        const trimmedInput = onTypeInput.trim();

        if (trimmedInput==='') { return null;} // If search term empty/missing, return null ends function

        await authenticateApp(); // Only checks auth when user clicks "Search"

        let searchResultsData = await Spotify.returnSearchResults(trimmedInput);

        if (searchResultsData === 'The access token expired') { // If token expired, refresh it and try again

            await Spotify.refreshToken(); // refresh access_token (and store updated parameters in localStorage)
            searchResultsData = await Spotify.returnSearchResults(trimmedInput); // retry for search results 
        }

        if (searchResultsData && searchResultsData.tracks) { // if tracks returned from result format and save data
            const formattedResultsData = formatData(searchResultsData);
            setSearchResults(formattedResultsData);
        }
        else {
            setSearchResults([]);  // else, clear the search results data
        }
        setOnTypeInput(''); // Clear input field after search
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