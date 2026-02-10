import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/* Always start at top on page load / refresh */
window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App onReady={() => {}} />
  </React.StrictMode>,
);
