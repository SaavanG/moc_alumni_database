import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';

// Configure axios defaults - use environment variable or fallback to localhost
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 