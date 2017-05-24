import Component from 'inferno-component';
import Minesweeper from './components/minesweeper';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div>
        <Minesweeper />
      </div>
    );
  }
};