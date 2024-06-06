import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './assets/css/layout.css';
import './assets/css/nav.css';
import './assets/css/common.css';
import './assets/css/outweights.css';
import './assets/css/daily.css';
import './assets/css/storage.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

