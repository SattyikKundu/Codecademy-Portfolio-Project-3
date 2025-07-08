import './LogoutButtons.css';

const LogoutButtons = ({loggedIn}) => {

  const handleLogout = () => { // logout from current account used for App
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expiration_time");
    window.location.reload(); // forces reauth on next interaction
    alert("You have logged out from this app. Submit a search term again to re-authenticate a Spotify account.");
  };

  return (
    <div className='logout-buttons-box'>
    {
      (loggedIn) ? 
      (<button onClick={()=>handleLogout()}>Logout from App</button>) :
      (<span>After submitting your search term, you'll be redirected to Spotify login.</span>)
    }
    </div>
    )
}

export default LogoutButtons;