import { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({onSearch}) => {

    const [onTypeInput, setOnTypeInput] = useState(''); // stores input value as it's being typed

    const typeSearch = (event) => { // used to track and show text as its typed in search box
        setOnTypeInput(event.target.value);
    }

    const submitSearch = () => { // On click, submitted input sent back to <App/>
        onSearch(onTypeInput);
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
                onClick={submitSearch} 
            >
                SEARCH
            </div>
        </div>
    );
}

export default SearchBar;