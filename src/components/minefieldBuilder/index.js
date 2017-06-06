import { linkEvent } from 'inferno';
import Component from 'inferno-component';
import MinefieldBuilderBoard from '../minefieldBuilderBoard';
import MinefieldBuilderConfigMenu from '../minefieldBuilderConfigMenu';
import {
  emptyBoard,
  hasMine,
} from '../../lib/minesweeper';
import './minefieldBuilder.css';

const closed = 1 << 0;
const open   = 1 << 1;

function isRightClick(type) {
  return type === 2;
}

function handleTileClick(instance) {
  return function(pos, event) {
    event.stopPropagation();
    if (isRightClick(event.button)) return;
    instance.setState(function(prevState) {
      if (prevState.tiles[pos] & hasMine) {
        const newTiles = [...prevState.tiles];
        newTiles[pos] = 0;
        return {
          tiles: newTiles,
          mines: prevState.mines - 1,
        };
      }
      const newTiles = [...prevState.tiles];
      newTiles[pos] = hasMine;
      return {
        tiles: newTiles,
        mines: prevState.mines + 1,
      };
    });
  }
}

function handleConfigClick(instance, event) {
  instance.setState(function(prevState) {
    return {
      configMenu: prevState.configMenu & closed ? open : closed,
    }
  });
  event.stopPropagation();
}

function closeConfigMenu(instance) {
  return function() {
    instance.setState(function(prevState) {
      return {
        configMenu: closed,
      };
    });
  }
}

function handleConfigSubmit(instance, event) {
  return function(rows, cols) {
    const gameBoard = emptyBoard(rows, cols);
    instance.setState(function(prevState) {
      return {
        ...gameBoard,
        configMenu: closed,
      };
    });
  }
}

function preventContextMenu(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}

function clearMines(instance, event) {
  instance.setState(function(prevState) {
    const newBoard = emptyBoard(prevState.rows, prevState.cols);
    return {
      ...newBoard,
      mines: 0,
    }
  });
}

export default class MinefieldBuilder extends Component {

  state = {
    ...emptyBoard(),
    configMenu: open,
  }

  componentDidMount() {
    const game = document.getElementById('minefield-builder');
    game.addEventListener('contextmenu', preventContextMenu);
  }

  render() {
    const { tiles, cols, mines } = this.state;
    const { data: onTileClick } = linkEvent(handleTileClick(this));
    const { data: closeMenu } = linkEvent(closeConfigMenu(this));
    const { data: updateBoard } = linkEvent(handleConfigSubmit(this));
    return (
      <div>
        <div style={{ width: `${(cols * 16) + 40}px`}} className="game-container" id="minefield-builder">
          <div className="builder-control-panel" style={{ width: `${(cols * 16) + 2}px`}}>
            <div>
              <span>💣&nbsp;</span>
              <span>{mines}</span>
            </div>
          </div>
          <div
            style={{ width: `${(cols * 16) + 2}px`}}
            className='board'
            id='board'
            noNormalize
            hasNonKeyedChildren
          >
            {MinefieldBuilderBoard({ tiles, cols, onTileClick })}
          </div>
          <div className="config-menu-panel">
            <span onClick={linkEvent(this, handleConfigClick)} className="config-menu-icon">⚙️</span>
          </div>
          <MinefieldBuilderConfigMenu
            displayState={this.state.configMenu}
            rows={this.state.rows}
            cols={this.state.cols}
            closeConfigMenu={closeMenu}
            handleConfigSubmit={updateBoard}
          />
        </div>
        <div className="builder-action-panel">
          <button disabled={mines < 1 || mines >= tiles.length} className="primary">
            <span>💾&nbsp;</span>
            <span>Save Minefield</span>
          </button>
          <button onClick={ linkEvent(this, clearMines) }>
            <span>🗑&nbsp;</span>
            <span>Clear Mines</span>
          </button>
        </div>
      </div>
    );
  }
}
