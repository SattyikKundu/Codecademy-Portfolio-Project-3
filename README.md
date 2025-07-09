# "Jammming" playlist maker for Spotify

This is **Portfolio Project #3** for my Full-stack web development course on Codecademy. This app that allows users to search for tracks using the Spotify API, create a custom playlist, and save it directly to their Spotify account.

---

## I. Project Overview

- **What is this app?**  
  It's a playlist creation tool built using React and the Spotify Web API.

- **What does it do?**  
  It lets users search for tracks, build and name a playlist, and finally upload their created playlist into their Spotify account.

- **Who is it for?**  
  Spotify users who want a faster and more curated way to build playlists.

- **KEY Features:**
  - Search query bar that will return tracks based on search result.
  - Scrollable "Results" section that holds all tracks returned from search query.
  - "Playlist" section where users can add tracks from "Results" section when creating playlist
  - "Save to Spotify" button where user can submit created playlist, after naming it, to their Spotify account.

---

## II. Tech Stack

- **React**           — used 'react-scripts' for frontend development.
- **Netlify**         — used for public deployment of the app.
- **Spotify Web API** — used to access user's Spotify account for authentication (OAuth with PKCE flow), searching tracks, and uploading created playlist. 
- **CSS**             — used for styling purposes.
- **React hooks**     — used `useState` and `useEffect` for local state management and effects triggering, respectively, in react app.
- **LocalStorage**    — used for storage and handling of authentication token (will upgrade to httpOnly cookie later on).

---

## III. Live Site & Demo Screenshots

- 🔗 **Live Site:** [https://myplaylistmaker.netlify.app](https://myplaylistmaker.netlify.app)

### **Screenshots of How App works:**
1. Typing a track into App's search bar
2. If login token not already on local Storage, click 'Ok' on alert which then redirects to Spotify Authentication Screen
3. After successful login (authentication token now in localStorage), type into Search Bar again and click 'Search'
4. Results should now be visible in 'Results' container/section.

5.1 Click on the plus(+) button next to track to add track to the "Playlist" section

5.2 Similarly, You can click the minus(-) button in "Playlist" section to remove track from Playlist (but track doesn't go back to 

  - Viewing formatted search results
  - Building a playlist and submitting to Spotify

---

## IV. Limitations (Important)

- Spotify API restrictions prevent public use of the app until approved for production.
- Only the developer's Spotify account can currently log in.
- This limitation is due to a Spotify policy update (April 2025).
- For full use by others, Spotify requires:
  - Production request approval
  - A backend for secure token exchange (recommended)

---

## V. How to Use This App Locally

### a. Requirements
- Node.js and npm installed
- A Spotify developer account

### b. Steps to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/spotify-playlist-maker.git
   cd spotify-playlist-maker
