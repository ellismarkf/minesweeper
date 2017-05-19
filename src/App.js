import { version } from 'inferno';
import Component from 'inferno-component';
import Logo from './logo';
import Minesweeper from './components/Minesweeper';
import { board, iterativeSweep } from '../lib/minesweeper'
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      rows: 9,
      cols: 9,
      tiles: [],
      threats: [],
    }
  }

  buildBoard = (instance, event) => {
    const { rows, cols } = instance.state;
    this.setState((prev) => {
      const newState = {
        ...prev,
        ...board(rows, cols),
      };
      return newState;
    });
  }
  
  sweep = tile => {
    const { tiles, threats, cols } = this.state;
    const newTiles = iterativeSweep(tile, tiles, threats, cols)
    console.log('sweep: ', tile);
    this.setState({
      tiles: newTiles,
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Logo width="80" height="80" />
          <h2>{`Welcome to Inferno ${version}`}</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={(e) => this.buildBoard(this, e)}></button>
        <Minesweeper
          {...this.state}
          onTileClick={this.sweep}
        />
      </div>
    );
  }
}

export default App;
