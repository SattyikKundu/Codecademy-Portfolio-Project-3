import { useState } from 'react';
import './SearchBar.css';

const SearchBar = () => {

    return(
        <div className="Search-Bar">
            <input placeholder='Enter a Track Title' />
            <div className="Search-Button" >SEARCH</div>
        </div>
    );
}

export default SearchBar;