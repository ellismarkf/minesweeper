import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Minesweeper from '../../components/minesweeper';
import Loader from '../../components/loader';
import { buildBoard } from '../../lib/minesweeper'
import './play.css';

const difficulties = [
  {
    rows: 9,
    cols: 9,
    mines: 10,
  },
  {
    rows: 16,
    cols: 16,
    mines: 40,
  },
  {
    rows: 16,
    cols: 30,
    mines: 99,
  },{
    rows: 9,
    cols: 9,
    mines: 10,
    configMenu: 2,
  }
];

const INITIAL = 0,
      READY = 1,
      LOADING = 2,
      ERROR = -1

function log(event) {
  return console.log(event)
}

export default function Play () {
  const [board, setBoard] = useState({
    rows: 9,
    cols: 9,
    mines: 10,
    tiles: [],
  })
  const [state, setState] = useState(INITIAL)
  const { gameId } = useParams()
  const router = useHistory()
  useEffect(() => {
    async function getBoard() {
      const id = parseInt(gameId, 10)
      if (id < 4) {
        const { rows, cols, mines } = difficulties[id]
        setBoard(buildBoard(rows, cols, mines))
        setState(READY)
        return
      }
      try {
        const res = await fetch(`https://minesweeper-backend-api.herokuapp.com/minefields/${id}`)
        if (!res.ok) {
          return router.push('/404')
        }
        const layout = await res.json()
        setBoard({
          rows: layout.rows,
          cols: layout.cols,
          mines: layout.mines,
          tiles: layout.tiles,
        })
      } catch(err) {
        console.log(err.message, err.stack);
        setState(ERROR)
      }
    }
    getBoard()
  }, [gameId, router])
  if (state === LOADING || state === INITIAL) {
    return <Loader>Loading your game...</Loader>
  }
  return (
    <div className="play-page-container">
      <Minesweeper
        {...board} 
        onTileClick={log}
        onStartClick={log}
      />
    </div>
  )
}