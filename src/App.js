import { linkEvent } from 'inferno';
import Component from 'inferno-component';
import Minesweeper from './components/minesweeper';
import {
  board,
  lost,
  won,
  flagTile,
  gameWon,
  swept,
  flagged,
  iterativeSweep,
  safe
} from './lib/minesweeper'
import './App.css';



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
  return function() {
    instance.setState(function(prevState) {
      return {
        ...board(prevState.rows, prevState.cols, prevState.mines),
      }
    });
  };
};

export default class App extends Component {
  
  state = {
    ...board(9,9,10),
  };

  componentDidMount() {
    const game = document.getElementById('minesweeper');
    game.oncontextmenu = function(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };
  }

  render() {
    const { data: tileClickHandler } = linkEvent(handleTileClick(this));
    const { data: resetHandler } = linkEvent(buildBoard(this));
    return (
      <div>
        <Minesweeper
          {...this.state}
          onTileClick={tileClickHandler}
          onReset={resetHandler}
        />
      </div>
    );
  }
};