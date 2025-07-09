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
1. First, typing a track name (or search query) into App's search text box
![(1) Type into search text box](https://github.com/user-attachments/assets/b6478ede-c198-4d39-a0dc-82484b819050)

2. If login token not already on local Storage, click 'Ok' on alert which then redirects to Spotify Authentication Screen. Otherwise, the search will work like normal.
![(1) Click on 'Ok' in alert box to proceed to Spotify login](https://github.com/user-attachments/assets/830dcdaf-dcee-4eab-aeae-af5e5a2ccdeb)

3. If user is redirected to Spotify login page, login to your account. This will create an authentication token on your local Storage. This token allows access to Spotify account, retrieval of music tracks on search, and submitting of created playlists to user's Spotify account.
![(3 1) Spotify Account login page (account name hidden)](https://github.com/user-attachments/assets/cc1fc909-7006-4b87-b308-cff95044e11d)

4. After successful login (authentication token now in localStorage), the user should now be redirected back to App homepage. Now type into Search Bar again and click *Search* (In below screenshot, I used **The Beatles** search term). Results should now be visible in "Results" container/section (left section in below image).
![(4) Search Results](https://github.com/user-attachments/assets/17f79feb-4e32-4c5c-b9ba-659190162077)

5. When user clicks on selected "add track" (or plus) button, which is colored green when hovered over and pressed (button circled in red), the track then gets added to the "Playlist" section (right section in below image).
![(5) Plus button to add track to playlist section](https://github.com/user-attachments/assets/2b68d9de-4a17-4fd3-9375-5c98f28c9d27)

6. As you can see, the selected track from previous screenshot has now been added to the "Playlist" section. Also in this section, you can click the "delete track" (or minus) button, which is colored red on hover and press, to remove track from Playlist. However, deleting track doesn't cause it to go back to the search results section; If you want the same track again, you need to use the search bar again.
![(6) Remove track button in 'Playlist' section](https://github.com/user-attachments/assets/e6e73e95-d74a-48dd-ac41-444cd492f963)

7. Finally, in order to submit your playlist to Spotify, you must have a playlist name AND at least 1 track. In below screenshot, I typed playlist name at top of "Playlist" section; I typed **The "Beatles" (my favorites)** for my created playlist's name. Then click in *Save to Spotify* button to submit playlist.
![(7) Ready to submit playlist](https://github.com/user-attachments/assets/28517510-fc91-45f8-9d1a-114eb85fa683)

8. After clicking *Save to Spotify* button, an alert pops up notifying you to playlist being submitted. Press *OK* button to proceed.
![(8) Alert notice that playlist was submitted](https://github.com/user-attachments/assets/6492e8c6-fa6d-4ca2-90ba-405a38039beb)

9. At last, the submitted playlist should now be visible inside the logged-in user's Spotify account. In the below Screenshot of my account, you can see the same **The "Beatles" (my favorites)** playlist created earlier as well as the 4 matching tracks I added as well, just like in the screenshot for Step #7. 
![(9 1) Playlist added to Spotify account (private info covered)](https://github.com/user-attachments/assets/307ef59c-aaa3-4325-9a31-a7868c9d0b9d)

---

## IV. Current App Limitations (VERY Important!!!)

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
