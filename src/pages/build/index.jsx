import React, { useState, Fragment, useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { BuilderTile } from '../../components/tile'
import MineCount from '../../components/mineCount'
import MinefieldBuilderConfigMenu from '../../components/builderMenu';
import {
  buildEmptyBoard,
  hasMine,
} from '../../lib/minesweeper';
import './build.css';

const DEFAULT_NAME = 'New Board Name';

function preventContextMenu(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}

function getBoardName(name) {
  return (name === DEFAULT_NAME || name === '' || name === undefined || name === null) ? `Minefield ${Date.now()}` : name
}

function postMinefield(body) {
  return window.fetch('https://minesweeper-backend-api.herokuapp.com/minefields', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })
}

export default function Build() {
  const [state, setState] = useState({
    ...buildEmptyBoard(),
    configMenu: true,
  })
  const router = useHistory()
  useLayoutEffect(() => {
    const boardDom = document.querySelector('#board')
    boardDom.addEventListener('contextmenu', preventContextMenu)
    return () => {
      boardDom.removeEventListener('contextmenu', preventContextMenu)
    }
  }, [])
  function toggleConfigMenu() {
    setState(state => ({
      ...state,
      configMenu: !state.configMenu
    }))
  }
  function updateBoard(event) {
    event.preventDefault()
    const config = new FormData(event.target)
    const newBoard = buildEmptyBoard(
      parseInt(config.get('rows')),
      parseInt(config.get('cols'))
    )
    setState({
      ...state,
      configMenu: false,
      ...newBoard
    })
  }
  function clearMines() {
    setState({
      ...state,
      ...buildEmptyBoard(state.rows, state.cols)
    })
  }
  function placeMine(position) {
    return function eventClosure(event) {
      setState(prev => {
        const newTiles = [...prev.tiles]
        const positionHasMine = prev.tiles[position] === hasMine
        newTiles.splice(position, 1, positionHasMine ? 0 : hasMine)
        const newMineCount = positionHasMine ? prev.mines - 1 : prev.mines + 1
        return {
          ...prev,
          mines: newMineCount,
          tiles: newTiles
        }
      })
    }
  }
  function submitBoard(event) {
    const name = getBoardName(document.querySelector('#board-name').value)
    const body = JSON.stringify({
      rows: state.rows,
      cols: state.cols,
      tiles: state.tiles,
      mines: state.mines,
      name
    })
    return postMinefield(body)
      .then(() => router.push('/browse'))
      .catch(e => console.error(e))
  }
  return (
    <Fragment>
      <div className="title-container">
        <label className="text-input-icon"><span role="img" aria-label="edit">📝</span></label>
        <input placeholder="New board name" name="name" id="board-name" className="game-title" maxLength="25" autoComplete="off" spellCheck={false} />
      </div>
      <div style={{ width: `${(state.cols * 16) + 40}px` }} className="game-container" id="minefield-builder">
        <section className="control-panel" style={{ width: `${(state.cols * 16) + 2}px` }}>
          <MineCount count={state.mines} />
        </section>
        <section
          style={{ width: `${(state.cols * 16) + 2}px` }}
          className='board'
          id='board'
        >
          {[...state.tiles].map((tile, index) => (
            <BuilderTile
              key={btoa(`${tile}${index}`)}
              value={tile}
              position={index}
              onMouseDown={placeMine(index)}
            />
          ))}
        </section>
        <section className="config-menu-panel">
          <span onClick={toggleConfigMenu} className="config-menu-icon" role="img" aria-label="customize">⚙️</span>
        </section>
        <MinefieldBuilderConfigMenu
          open={state.configMenu}
          rows={state.rows}
          cols={state.cols}
          onCancel={toggleConfigMenu}
          onSubmit={updateBoard}
        />
      </div>
      <div className="builder-action-panel">
        <button onClick={clearMines}>
          <span role="img" aria-label="delete">🗑&nbsp;</span>
          <span>Clear Mines</span>
        </button>
        <button
          disabled={state.mines < 1 || state.mines >= state.tiles.length}
          className="primary"
          onClick={submitBoard}
        >
          <span role="img" aria-label="save">💾&nbsp;</span>
          <span>Save Minefield</span>
        </button>
      </div>
    </Fragment>
  )
}
