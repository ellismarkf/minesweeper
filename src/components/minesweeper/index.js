import { linkEvent } from 'inferno';
import Component from 'inferno-component';
import Board from '../board';
import {
  board,
  lost,
  won,
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
    if (game & lost || game & won) return;
    if (tiles[pos] & flagged) return;
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
    const newTiles = iterativeSweep(pos, tiles, threats, cols);
    const gameOver = !(safe(newTiles));
    if (gameOver) {
      instance.setState({
        tiles: newTiles,
        game: lost,
      });
      return false;
    };
    const wonGame = gameWon(newTiles, mines);
    if (wonGame) {
      instance.setState({
        tiles: newTiles,
        game: won,
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
    return {
      ...board(prevState.rows, prevState.cols, prevState.mines),
    }
  });
};

export default class Minesweeper extends Component {
  constructor(props) {
    super(props);
    if (props.tiles) {
      this.state = board(
        props.row,
        props.cols,
        props.mines,
        props.tiles
      );
    }
    if (props && !props.tiles) {
      this.state = board(
        props.rows,
        props.cols,
        props.mines
      );
    }
  }

  state = board();

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
    return (
      <div style={{ width: `${(cols * 16) + 40}px`}} className="game-container" id="minesweeper">
        <div className="control-panel" style={{ width: `${(cols * 16) + 2}px`}}>
          <div>💣 {mines - flaggedTiles(tiles)}</div>
          <div><span onClick={linkEvent(this, buildBoard)}>{ emotion(game) }</span></div>
          <div>⏱ {'000'}</div>
        </div>
        <div style={{ width: `${(cols * 16) + 2}px`}} className='board' noNormalize hasNonKeyedChildren>
          {Board({ tiles, threats, cols, onTileClick, game })}
        </div>
      </div>
    );
  }
}
