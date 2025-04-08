import Track from '../Track/Track';
import './SearchResults.css';

const SearchResults = ({searchResults, setSearchResults, playList, setPlaylist}) => {

    const addToPlayList = (trackId) => { // function to add new track to playList

        // .find() returns track object that matches Id (note: don't use {} since it 
        // requires an explicit return(this caused the <Track> list below to crash earlier.))
        const trackToAdd = searchResults.find((track) => track.id === trackId);

        if(!trackToAdd) return; // If no track, return to stop function

        // .filter() returns array of tracks that DON'T match Id input
        const newSearch = searchResults.filter((track) => track.id !== trackId);

        setSearchResults(newSearch);          // sets new Search Result without the track
        setPlaylist([...playList,trackToAdd]); // sets new Play List with new added track
    }

    return(
        <div className="Search-Results">
            <h2> Results </h2>
            <div className="Search-Results-Display">
              { 
              /* If no search results yet, it prints notice.
                 Otheriwse, each track is listed via .map() function. */
              (!searchResults || searchResults.length===0)
              ? (<p>First, Enter your Search Query and Press Submit!</p>)
              : (searchResults.map((track) => (
                <Track 
                  key={track.id} 
                  track={track}
                  addToPlayList={() => addToPlayList(track.id)}
                /> 
                )))
              }
            </div>
        </div>
    );
}

export default SearchResults;


 