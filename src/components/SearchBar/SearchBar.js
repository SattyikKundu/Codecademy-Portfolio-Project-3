import { useEffect, useState } from 'react';
import './SearchBar.css';

const SearchBar = ({onSearch}) => {

    const [onTypeInput, setOnTypeInput] = useState(''); // stores input value as it's being typed
    const [submitClicked, setSubmitClicked] = useState(false); // toggles when submit is clicked
    const [searcResults, setSearchResults] = useState([]); // stores searchResults for checking

    const typeSearch = (event) => { // used to track and show text as its typed in search box
        setOnTypeInput(event.target.value);
    }

    const submitSearch = () => { // On click, submitted input sent back to <App/>
        onSearch(onTypeInput);
        setSubmitClicked(!submitClicked); // toggles 'submitClicked' value
    }


    // Get search results after submitting input
    useEffect(() =>{

        //async fetchResults(){
            console.log('fetchResults() started');
        //        }

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
        </div>
    );
}

export default SearchBar;