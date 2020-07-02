import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import PlayMenu from '../../components/playMenu'
import './home.css'

const Home = () => {
  const [ playMenuOpen, setPlayMenuOpen ] = useState(false)
  function togglePlayMenu() {
    setPlayMenuOpen(!playMenuOpen)
  }
  const playMenuClass = playMenuOpen ? 'menu-open' : ''
  return (
    <Fragment>
      {playMenuOpen && (
        <PlayMenu onClick={togglePlayMenu} />
      )}
      <div className={`home-page-container ${playMenuClass}`}>
        <h1>Minesweeper</h1>
        <div className="mode-selector-container">
          <div onClick={togglePlayMenu} >
            <h1><span role="img" aria-label="Play">🕹</span></h1>
            <h3>Play</h3>
            <p>The classic game of luck and logic.</p>
          </div>
          <Link to="/build">
            <h1><span role="img" aria-label="Build">🛠</span></h1>
            <h3>Build</h3>
            <p>Create and share custom minefields.</p>
          </Link>
          <Link to="/browse">
            <h1><span role="img" aria-label="Browse">🔍</span></h1>
            <h3>Browse</h3>
            <p>Find and play a minefield made by the community.</p>
          </Link>
        </div>
      </div>
    </Fragment>
  )
}

export default Home