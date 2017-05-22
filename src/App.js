import { version, linkEvent } from 'inferno';
import Component from 'inferno-component';
import Logo from './logo';
import Minesweeper from './components/minesweeper';
import { board } from './lib/minesweeper'
import './App.css';


function buildBoard(instance) {
  instance.setState({
    ...board(9,9,10),
  })
}

export default class App extends Component {
  
  state = {
    ...board(9,9,10),
  };

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
        <button onClick={linkEvent(this, buildBoard)}></button>
        <Minesweeper
          {...this.state}
          context={ linkEvent(this)}
        />
      </div>
    );
  }
};