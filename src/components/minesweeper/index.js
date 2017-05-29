import { linkEvent } from 'inferno';
import Component from 'inferno-component';
import Board from '../board';
import Stopwatch from '../stopwatch';
import ConfigMenu from '../configMenu';
import {
  board,
  lost,
  won,
  active,
  inactive,
  flagTile,
  gameWon,
  swept,
  flagged,
  iterativeSweep,
  safe,
  flaggedTiles,
  sweeping,
} from '../../lib/minesweeper';
import './minesweeper.css';

function emotion(game) {
  switch (game) {
    case lost:
      return '💀';
    case won:
      return '😎';
    case sweeping:
      return '😱'
    default:
      return '😊';
  }
};

const closed = 1 << 0;
const open   = 1 << 1;

function isRightClick(type) {
  return type === 2;
}

function handleTileClick(instance) {
  return function(pos, event) {
    const { 
      tiles,
      game,
      mines,
      threats,
      cols,
    } = instance.state;
    if (game === inactive) {
      instance.setState({
        game: active,
      });
      startStopWatch(instance);
    }    
    if (game & lost || game & won) return;
    if (isRightClick(event.button)) {
      if (tiles[pos] & swept) return;
      const newTiles = flagTile(pos, tiles);
      const wonGame = gameWon(newTiles, mines);
      instance.setState(function(prevState) {
        return {
          tiles: newTiles,
          game: wonGame ? won : prevState.game,
        }
      });
      return false;
    }
    if (tiles[pos] & flagged) return;
    const newTiles = iterativeSweep(pos, tiles, threats, cols);
    const gameOver = !(safe(newTiles));
    if (gameOver) {
      instance.setState(function(prevState) {
        return {
          tiles: newTiles,
          game: lost,
          stopwatchId: window.clearInterval(prevState.stopwatchId)
        }
      });
      return false;
    };
    const wonGame = gameWon(newTiles, mines);
    if (wonGame) {
      instance.setState(function(prevState) {
        return {
          tiles: newTiles,
          game: won,
          stopwatchId: window.clearInterval(prevState.stopwatchId)
        }
      });
      return true;
    }
    instance.setState({
      tiles: newTiles,
    });
    return false;   
  }
}

function buildBoard(instance) {
  instance.setState(function(prevState) {
    const gameBoard = board(prevState.rows, prevState.cols, prevState.mines);
    return {
      ...prevState,
      ...gameBoard,
      stopwatch: 0,
      stopwatchId: window.clearInterval(prevState.stopwatchId),
    }
  });
};

function handleConfigClick(instance) {
  instance.setState(function(prevState) {
    return {
      configMenu: prevState.configMenu & closed ? open : closed,
    }
  });
}

function closeConfigMenu(instance) {
  return function() {
    instance.setState(function(prevState) {
      return {
        configMenu: closed,
      }
    });
  }
}

function handleConfigSubmit(instance, event) {
  return function(rows, cols, mines) {
    const gameBoard = board(rows, cols, mines);
    instance.setState(function(prevState) {
      return {
        ...gameBoard,
        configMenu: closed,
        stopwatch: 0,
        stopwatchId: window.clearInterval(prevState.stopwatchId),
      }
    });
  }
}


function startStopWatch(instance) {
  const intervalId = window.setInterval(function() {
    instance.setState(function(prevState) {
      return {
        stopwatch: prevState.stopwatch + 1,
      }
    });
  }, 1000);
  instance.setState({
    stopwatchId: intervalId
  });
}

export default class Minesweeper extends Component {
  constructor(props) {
    super(props);
    if (props.tiles) {
      const gameBoard = board(
        props.row,
        props.cols,
        props.mines,
        props.tiles
      );
      this.state = {
        ...gameBoard,
        configMenuOpen: false,
        stopwatch: 0,
        stopwatchId: 0,
      };
    }
    if (props && !props.tiles) {
      const gameBoard = board(
        props.rows,
        props.cols,
        props.mines
      );
      this.state = {
        ...gameBoard,
        configMenu: closed,
        stopwatch: 0,
        stopwatchId: 0,
      };
    }
  }

  state = {
    ...board(),
    configMenu: 0,
    stopwatch: 0,
    stopwatchId: 0,
  }

  componentDidMount() {
    const game = document.getElementById('minesweeper');
    game.oncontextmenu = function(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };
  }

  render() {
    const { tiles, threats, cols,  game, mines } = this.state;
    const { data: onTileClick } = linkEvent(handleTileClick(this));
    const { data: closeMenu } = linkEvent(closeConfigMenu(this));
    const { data: updateBoard } = linkEvent(handleConfigSubmit(this));
    return (
      <div style={{ width: `${(cols * 16) + 40}px`}} className="game-container" id="minesweeper">
        <div className="control-panel" style={{ width: `${(cols * 16) + 2}px`}}>
          <div>
            <span>💣&nbsp;</span>
            <span>{mines - flaggedTiles(tiles)}</span>
          </div>
          <div>
            <span onClick={linkEvent(this, buildBoard)} className="game-status-icon">
              { emotion(game) }
            </span>
          </div>
          <div>
            <Stopwatch seconds={this.state.stopwatch} />
          </div>
        </div>
        <div style={{ width: `${(cols * 16) + 2}px`}} className='board' noNormalize hasNonKeyedChildren>
          {Board({ tiles, threats, cols, onTileClick, game })}
        </div>
        <div className="config-menu-panel">
          <span onClick={linkEvent(this, handleConfigClick)} className="config-menu-icon">⚙️</span>
        </div>
        <ConfigMenu
          displayState={this.state.configMenu}
          rows={this.state.rows}
          cols={this.state.cols}
          mines={this.state.mines}
          closeConfigMenu={closeMenu}
          handleConfigSubmit={updateBoard}
        />
      </div>
    );
  }
}
