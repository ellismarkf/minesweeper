import Component from 'inferno-component';
import Minesweeper from '../../components/minesweeper';
import './play.css';

export default class Play extends Component {

  render() {
    return (
      <div>
        <div className="play-page-container">
          <Minesweeper />
        </div>
      </div>
    );
  }
};