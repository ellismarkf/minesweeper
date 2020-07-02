import React from 'react'
import './loader.css';

export default function Loader({ children }) {
  return (
    <div className="loader-container">
      <h1>{children}</h1>
      <div className="loader-animation-container">
        <span className="smile" role="img" aria-label="smile"> ☺️ </span>
        <span className="scream" role="img" aria-label="scream"> 😱 </span>
        <span className="bomb" role="img" aria-label="bomb"> 💣 </span>
        <span className="boom" role="img" aria-label="boom"> 💥 </span>
      </div>
    </div>
  );
}