import Component from 'inferno-component';
import Minesweeper from './components/minesweeper';

export default class App extends Component {
  render() {
    return (
      <div>
        <Minesweeper rows={16} cols={16} mines={10} />
      </div>
    );
  }
};