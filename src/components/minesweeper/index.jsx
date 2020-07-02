import React, { useState, useLayoutEffect } from 'react'
import Stopwatch from '../stopwatch';
import ConfigMenu from '../configMenu';
import Tile from '../tile'
import {
  buildBoard,
  lost,
  won,
  active,
  inactive,
  flagTile,
  gameWon,
  swept,
  flagged,
  sweep,
  checkWin,
  checkSafe,
  flaggedTiles,
} from '../../lib/minesweeper';
import './minesweeper.css';

function getEmotionStatus(game, sweeping) {
  if (sweeping > 0) return "😱"
  switch (game) {
    case lost:
      return '💀';
    case won:
      return '😎';
    default:
      return '😊';
  }
};

const closed = 1 << 0;
const open = 1 << 1;

function isRightClick(type) {
  return type === 2;
}

function buildGameBoard() { }
function updateBoard(event) {
  event.preventDefault()
  console.log(event.target)
}

function generateBoardTiles(props, game) {
  const { mines, cols, tiles, rows, threats } = props
  let boardTiles = []
  tiles.forEach((tile, index) => {
    boardTiles.push(
      <Tile
        key={btoa(`${tile}-${index}`)}
        value={tile}
        threats={threats[index]}
        cols={cols}
        onMouseDown={event => {
          if (isRightClick(event.button)) return
        }}
        game={game.state}
      />
    )
  })
  return boardTiles
}

export default function Minesweeper(props) {
  const { mines, cols, tiles, rows, threats } = props
  const [game, setGame] = useState({ state: inactive, sweeping: false })
  const [controls, setControls] = useState({ configMenu: 0 })
  function handleConfigClick() {
    setControls({...controls, configMenu: controls.configMenu ^ 1 })
  }
  function toggleSweep(event) {
    if (game.state & active) {
      console.log('process', event.type)
      if (isRightClick(event.button)) return
      setGame({ ...game, sweeping: !game.sweeping })
    }
  }
  useLayoutEffect(() => {
    const boardDom = document.querySelector('#board')
    boardDom.addEventListener('contextmenu', event => {
      event.preventDefault()
      event.stopPropagation()
      return false
    })
  })
  return (
    <div style={{ width: `${(cols * 16) + 40}px` }} className="game-container" id="minesweeper">
      <div className="control-panel" style={{ width: `${(cols * 16) + 2}px` }}>
        <div>
          <span role="img" aria-label="mine count">💣&nbsp;</span>
          <span>{mines - flaggedTiles(tiles)}</span>
        </div>
        <div>
          <span onClick={buildGameBoard} className="game-status-icon" role="img" aria-label="status">
            {getEmotionStatus(game.state, game.sweeping)}
          </span>
        </div>
        <div>
          <Stopwatch startAt={0} paused />
        </div>
      </div>
      <div
        style={{ width: `${(cols * 16) + 2}px` }}
        className={`board${game.state & active ? ' active' : ''}`}
        id='board'
        onMouseDown={toggleSweep}
        onMouseUp={toggleSweep}
      >
        {generateBoardTiles(props, game)}
      </div>
      <div className="config-menu-panel">
        <span
          onClick={handleConfigClick}
          className={`config-menu-icon`}
        >
          ⚙️
        </span>
      </div>
      <ConfigMenu
        open={controls.configMenu}
        rows={rows}
        cols={cols}
        mines={mines}
        onCancel={handleConfigClick}
        onSubmit={updateBoard}
      />
    </div>
  );
}