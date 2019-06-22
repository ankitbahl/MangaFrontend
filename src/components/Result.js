import React from 'react';
import logo from '../logo.svg';
import '../assets/css/App.css';
import './assets/css/bootstrap.css';

function Results() {
  return (
    <div className="App">
      <h1>Manga Downloader</h1>
      <div className="content">
        <input type="text" placeholder="Search Manga"/>
        <button>Search</button>
      </div>
    </div>
  );
}

export default Results;
