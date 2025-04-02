import { useEffect, useState } from 'react';
import './SearchBar.css';
import Spotify from '../util/Spotify';

const SearchBar = ({onSearch}) => {

    const [onTypeInput, setOnTypeInput] = useState(''); // stores input value as it's being typed
    const [submitClicked, setSubmitClicked] = useState(false); // toggles when submit is clicked
    const [searchResults, setSearchResults] = useState([]); // stores searchResults for checking

    const typeSearch = (event) => { // used to track and show text as its typed in search box
        setOnTypeInput(event.target.value);
    }

    const submitSearch = () => { // On click, submitted input sent back to <App/>
        onSearch(onTypeInput);
        setSubmitClicked(prev => !prev); // toggles 'submitClicked' value
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
                setSearchResults(searchResultsData);
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