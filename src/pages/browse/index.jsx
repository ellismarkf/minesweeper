import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../../components/loader';
import GameCard from '../../components/gameCard'
import './browse.css';

const INITIAL = 0,
  READY = 1,
  LOADING = 2,
  ERROR = -1

export default function BrowsePage() {
  const [minefields, setMinefields] = useState([])
  const [state, setState] = useState(INITIAL)
  useEffect(() => {
    fetch('https://minesweeper-backend-api.herokuapp.com/minefields')
      .then(res => res.json())
      .then(minefields => {
        setMinefields(minefields)
        setState(READY)
      })
      .catch(error => {
        console.error(error)
        setState(ERROR)
      })
  }, [])
  if (state === READY && minefields.length === 0) {
    return (
      <div className="empty-minefield-viewer">
        <h1><span role="img" aria-label="sad face">😢</span></h1>
        <h2>Looks like nobody has built any custom minefields yet.</h2>
        <p><Link to="/build">Build one</Link> now for great good!</p>
      </div>
    )
  }
  if (state === INITIAL || state === LOADING) {
    return <Loader>Loading...</Loader>
  }
  if (state === READY && minefields.length > 0) {
    return (
      <div className="game-link-container">
        {minefields.map(minefield => (
          <Link to={`/play/${minefield.id}`} key={minefield.id}>
            <GameCard
              rows={minefield.rows}
              cols={minefield.cols}
              mines={minefield.mines}
              name={minefield.name}
            />
          </Link>
        ))}
      </div>
    )
  }
  if (state === ERROR) {
    return (
      <div className="catch-all">
        <h1><span role="img" aria-label="0">💣</span></h1>
        <p>Something went wrong!</p>
      </div>
    )
  }
}