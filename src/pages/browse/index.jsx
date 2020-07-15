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
  return (
    <div className="browse-container">
      <form>
        <section>
          <label>Board Name</label>
          <input type="text" />
        </section>
        <section>
          <label>Easy</label>
          <input type="checkbox" />
          <label>Intermediate</label>
          <input type="checkbox" />
          <label>Hard</label>
          <input type="checkbox" />
        </section>
      </form>
      {(state === READY && minefields.length === 0) && (
        <div className="empty-minefield-viewer">
          <h1><span role="img" aria-label="sad face">😢</span></h1>
          <h2>Looks like nobody has built any custom minefields yet.</h2>
          <p><Link to="/build">Build one</Link> now for great good!</p>
        </div>
      )}
      {(state === INITIAL || state === LOADING) && (
        <Loader>Loading...</Loader>
      )}
      {(state === READY && minefields.length > 0) && (
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
      )}
    </div>
  )
  // if (state === READY && minefields.length === 0) {
  //   return (
  //     <div className="empty-minefield-viewer">
  //       <h1><span role="img" aria-label="sad face">😢</span></h1>
  //       <h2>Looks like nobody has built any custom minefields yet.</h2>
  //       <p><Link to="/build">Build one</Link> now for great good!</p>
  //     </div>
  //   )
  // }
  // if (state === INITIAL || state === LOADING) {
  //   return <Loader>Loading...</Loader>
  // }
  // if (state === READY && minefields.length > 0) {
  //   return (
  //     <div className="game-link-container">
  //       {minefields.map(minefield => (
  //         <Link to={`/play/${minefield.id}`} key={minefield.id}>
  //           <GameCard
  //             rows={minefield.rows}
  //             cols={minefield.cols}
  //             mines={minefield.mines}
  //             name={minefield.name}
  //           />
  //         </Link>
  //       ))}
  //     </div>
  //   )
  // }
}