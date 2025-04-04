import { useEffect, useState } from 'react';
import './SearchBar.css';
import Spotify from '../util/Spotify';

const SearchBar = ({setSearchResults}) => {

    const [onTypeInput, setOnTypeInput] = useState(''); // stores input value as it's being typed
    const [submitClicked, setSubmitClicked] = useState(false); // toggles when submit is clicked
    const [searchOutput, setSearchOutput] = useState([]); // stores searchResults for checking

    const typeSearch = (event) => { // used to track and show text as its typed in search box
        setOnTypeInput(event.target.value);
    }

    const submitSearch = () => { // On click, submitted input sent back to <App/>
        setSearchResults(searchOutput); // sets and stores searchResults in App.js
        setSubmitClicked(prev => !prev); // toggles 'submitClicked' value
    }

    const formatData = (data) => { 
        /* Function ensures that output is formatted properly before storing. This helps 
           ensure that all parameter values will be passed properly to other components. */

        if (data && data.tracks.items) {

            const formattedTracks = data.tracks.items.map(track => {
                
                const artistNames = track.artists.map(artist => artist.name); // Extract artist names

                let formattedArtists; // Format names of artists based on # of artists 
                if(artistNames.length === 1){
                    formattedArtists = `'${artistNames[0]}'`;
                } 
                else if (artistNames.length === 2) {
                    formattedArtists = `'${artistNames[0]}' & '${artistNames[1]}'`;
                }
                else {
                    formattedArtists = `'${artistNames[0]}', '${artistNames[1]}', etc.`;
                }
                
                return {
                    id: track.id,
                    name: track.name,
                    artist: formattedArtists,
                    album: track.album.name,
                    imageUrl: track.album.images[0]?.url || '', //handles case where there's no image
                    //previewUrl: track.previewUrl,
                    uri: track.uri,
                }
        });
        return formattedTracks;
        }            
    }

    // Get search results after submitting input
    useEffect(() =>{

        const fetchResults = async () => {
            console.log('fetchResults() started');

            if (onTypeInput==='') {
                console.log('Search term is missing!');
                return null;
            } 

            const searchResultsData = await Spotify.returnSearchResults(onTypeInput);
            console.log('Latest search output: ', searchResultsData);

            if (searchResultsData === 'The access token expired') {

                console.log('access_token needs refresh (via searchResults');

                Spotify.refreshToken(); // refresh access_token (and store updated parameters in localStorage)
                fetchResults(); // run fetchResults() again after refreshed token 
            }
            else {
                console.log('Data Output WITHOUT error: ', searchResultsData);
                setSearchOutput(formatData(searchResultsData));
            }
        }

        fetchResults();

    },[submitClicked]);



    return(
        <div className="Search-Bar">
            <input 
                placeholder='Enter a Track Title' 
                value={onTypeInput} 
                onChange={(event) => typeSearch(event)}  
            />
            <div 
                className="Search-Button" 
                onClick={submitSearch} 
            >
                SEARCH
            </div>
           {/* <p>Submit clicked toggle: {submitClicked.toString()}</p> */}
        </div>
    );
}

export default SearchBar;