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

  componentDidMount() {
    const game = document.getElementById('minesweeper');
    game.oncontextmenu = function(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };
  }

  render() {
    return (
      <div>
        <button onClick={linkEvent(this, buildBoard)}></button>
        <Minesweeper
          {...this.state}
          context={ linkEvent(this)}
        />
      </div>
    );
  }
};