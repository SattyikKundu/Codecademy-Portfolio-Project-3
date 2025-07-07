import { createRoot } from 'react-dom/client'; // used to render components in DOM

import App from './App/App.js'; // import <App> component from here

/* define <body id='root'> form index.html as program starting point. */
const root = createRoot(document.getElementById("root")); 

root.render(<App/>); // renders the <App> component

