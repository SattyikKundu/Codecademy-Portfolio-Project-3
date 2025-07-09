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
- **Spotify Web API** — used to access user's Spotify account for authentication (using PKCE flow), searching tracks, and uploading created playlist. 
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

## IV. Current Limitations of App (VERY Important to Read!!!)

- Due to the current Spotify API policy (as of April 2025), Spotify apps are by default in *development mode* in the Spotify Developer account.
- This means that currently, **ONLY** the app owner(myself) and other pre-approved users can login and fully use the app uploaded on Netlify.
- In order for anyone to login and use the app, an approval request has to be sent to Spotify asking to allow the app to run in *production mode*.
- Currently, this app hasn't been approved to run in *production mode*. I eventually intend to request Spotify to allow my app to run in *production mode* so all public users can use my app uploaded on Netlify.
- Essentially, my live app on Netlify (https://myplaylistmaker.netlify.app) serves mainly for display purposes until I get approval for *production mode* from Spotify.
- If anyone wants to run the app, the current best option is to download the respository and run this app locally. Instructions are shown on next section.

---

## V. How to Use This App Locally

### a. Requirements
- Have ***Node.js*** installed to run app locally
- Use **npm install** command to install packages listed in ***package.json*** file. 
- A Spotify developer account to create a Spotify app that provides the Spotify API to

### b. Steps to Set Up Spotify Developer account
1. First create an account at: https://developer.spotify.com/.
2. After logging in, go to dashboard. Either click on user's account icon on top-right → then click *dashboard*. Or simply type https://developer.spotify.com/dashboard in url after logging in.
3. In dashboard, click in ***Create App*** button to create an Spotify app to connect the locally run app with.
4. During the ***Create app*** stage, fill out the required fields including *App name*, *App description*, and *Redirect URIs* (**NOTE**: The *Redirect URIs* is where the user gets redirected to after Spotify authentication success/failure. Also, Spotify has currently prohibited *localhost* of any sort for being used as a *Redirect URI*; you'll need to use an alternative(<u>*for example*</u>: use a Tunneling Service (like *ngrok* or *localtunnel*)).
5. After completing the fields in the ***Create app*** stage, click in *Save* button at bottom to save Spotify app settings. 
6. The Spotify app should be created now. Save the **ClientID** as well as the **Redirect URI** you added earlier. You will need these during local setup of app (next sub-section).

### c. Steps to Run Locally

1. First, clone this repository and save on your local machine:
   ```bash
   git clone https://github.com/yourusername/spotify-playlist-maker.git
   cd spotify-playlist-maker

2. Use **npm install** command to install packages listed in ***package.json*** file.
3. Change name of *.env.example* file to just *.env*. This file will stored the environment variables for the app.
4. Inside the *.env* file, add the **ClientID** and the **Redirect URI** you obtained or defined during the App creation within your Spotify Developers account.
5. Finally, you can run the app locally using a ***npm start*** command to run the app inside your Command Line Interface (CLI) or Independent Developer Environment (IDE).
