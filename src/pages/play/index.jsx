import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Tile from '../../components/tile'
import ConfigMenu from '../../components/configMenu'
import Stopwatch from '../../components/stopwatch'
import MineCount from '../../components/mineCount'
import Loader from '../../components/loader'
import Status from '../../components/status'
import {
  buildBoard,
  lost,
  won,
  active,
  inactive,
  flagTile,
  swept,
  flagged,
  sweep,
  checkWin,
  checkSafe,
  getFlaggedTileCount,
} from '../../lib/minesweeper'
import useInterval from '../../lib/useInterval'
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
  }, {
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


function isRightClick(type) {
  return type === 2;
}

function disableContextMenu(event) {
  event.preventDefault()
  event.stopPropagation()
}

const MAX = 999

export default function Play() {
  const [board, setBoard] = useState({
    rows: 9,
    cols: 9,
    mines: 10,
    tiles: [],
  })
  const { gameId:id } = useParams()
  const gameId = parseInt(id, 10)
  const isCustomGame = gameId > 3
  const [state, setState] = useState(INITIAL)
  const [game, setGame] = useState(inactive)
  const [sweeping, setSweeping] = useState(false)
  const [menuOpen, setMenuOpen] = useState(gameId === 3 ? true :false)
  const [stopwatch, setStopwatch] = useState({ elapsed: 0, paused: true })
  useInterval(() => {
    setStopwatch({ ...stopwatch, elapsed: stopwatch.elapsed + 1 })
  }, (stopwatch.paused || stopwatch.elapsed >= MAX) ? null : 1000)
  const router = useHistory()
  useEffect(() => {
    async function getBoard() {
      if (gameId < 4) {
        const { rows, cols, mines } = difficulties[gameId]
        setBoard(buildBoard(rows, cols, mines))
        setState(READY)
        return
      }
      try {
        const res = await fetch(`https://minesweeper-backend-api.herokuapp.com/minefields/${gameId}`)
        if (!res.ok) {
          return router.push('/404')
        }
        const layout = await res.json()
        setBoard(buildBoard(layout.rows, layout.cols, layout.mines, layout.tiles))
        sessionStorage.setItem('backup', JSON.stringify(layout.tiles))
        setState(READY)
      } catch (err) {
        setState(ERROR)
      }
    }
    getBoard()
  }, [gameId, router])

  function toggleMenu() {
    setMenuOpen(!menuOpen)
  }

  function relax(event) {
    if (isRightClick(event.button)) return
    setSweeping(false)
  }

  useLayoutEffect(() => {
    if (state === READY) {
      const boardDom = document.querySelector('#board')
      boardDom.addEventListener('contextmenu', disableContextMenu)
      return () => {
        boardDom.removeEventListener('contextmenu', disableContextMenu)
      }
    }
  }, [state])
  function startGame() {
    setGame(active)
    setStopwatch({ ...stopwatch, paused: false })
  }
  function revealTile(position) {
    return function handleTileClick(event) {
      event.stopPropagation()
      if (isRightClick(event.button)) {
        if (game === inactive) startGame()
        if (board.mines === getFlaggedTileCount(board.tiles)) return
        if (board.tiles[position] & swept) return
        const newTiles = flagTile(position, board.tiles);
        const wonGame = checkWin(newTiles, board.mines);
        setBoard({ ...board, tiles: newTiles })
        if (wonGame) {
          setGame(won)
          setStopwatch({ ...stopwatch, paused: true })
          return true
        }
        return false;
      }
      if (
        game === lost || 
        game === won ||
        board.tiles[position] & flagged ||
        board.tiles[position] & swept
      ) {
        return game === won
      }
      if (game === inactive) startGame()
      const newTiles = sweep(position, board.tiles, board.threats, board.cols);
      const gameOver = !(checkSafe(newTiles));
      if (gameOver) {
        setBoard({ ...board, tiles: newTiles })
        setStopwatch({ ...stopwatch, paused: true  })
        setGame(lost)
        return false;
      };
      const wonGame = checkWin(newTiles, board.mines);
      if (wonGame) {
        setBoard({ ...board, tiles: newTiles })
        setStopwatch({ ...stopwatch, paused: true  })
        setGame(won)
        return true;
      }
      setSweeping(true)
      setBoard({ ...board, tiles: newTiles })
      return false;
    }

  }
  function reset() {
    setBoard(buildBoard(board.rows, board.cols, board.mines, !isCustomGame? null : JSON.parse(sessionStorage.getItem('backup'))))
    setGame(inactive)
    setStopwatch({ paused: true, elapsed: 0 })
  }
  function updateBoard(event) {
    event.preventDefault()
    const config = new FormData(event.target)
    setBoard(
      buildBoard(
        parseInt(config.get('rows')),
        parseInt(config.get('cols')),
        parseInt(config.get('mines')),
      )
    )
    setGame(inactive)
    setStopwatch({ paused: true, elapsed: 0 })
    setMenuOpen(false)
  }
  if (state === LOADING || state === INITIAL) {
    return <Loader>Loading your game...</Loader>
  }
  return (
    <div className="play-page-container">
      <div style={{ width: `${(board.cols * 16) + 40}px` }} className="game-container" id="minesweeper">
        <section className="control-panel" style={{ width: `${(board.cols * 16) + 2}px` }}>
          <MineCount count={board.mines - getFlaggedTileCount(board.tiles)} />
          <Status state={game} panic={sweeping} onClick={reset} />
          <Stopwatch elapsed={stopwatch.elapsed} />
        </section>
        <section
          style={{ width: `${(board.cols * 16) + 2}px` }}
          className={`board${game & active ? ' active' : ''}`}
          id='board'
          onMouseUp={relax}
        >
          {[...board.tiles].map((tile, index) => (
            <Tile
              key={btoa(`${tile}-${index}`)}
              value={tile}
              position={index}
              threats={board.threats[index]}
              onMouseDown={revealTile(index)}
              game={game}
            />
          ))}
        </section>
        <section className={`config-menu-panel${isCustomGame ? ' hidden' : ''}`}>
          {!isCustomGame && (
            <span
              onClick={toggleMenu}
              className={`config-menu-icon`}
              role="img"
              aria-label="Customization Menu"
            >
              ⚙️
            </span>
          )}
        </section>
        {!isCustomGame && (
          <ConfigMenu
            open={menuOpen}
            rows={board.rows}
            cols={board.cols}
            mines={board.mines}
            onCancel={toggleMenu}
            onSubmit={updateBoard}
          />
        )}
      </div>
    </div>
  )
}