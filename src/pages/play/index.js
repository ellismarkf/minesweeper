import Component from 'inferno-component';
import Minesweeper from '../../components/minesweeper';
import './play.css';

const difficulties = [
  {
    rows: 9,
    cols: 9,
    mines: 10,
  },
  {
    rows: 16,
    cols: 16,
    mines: 40,
  },
  {
    rows: 16,
    cols: 30,
    mines: 99,
  },{
    rows: 9,
    cols: 9,
    mines: 10,
    configMenu: 2,
  }
];

export default class Play extends Component {

  render() {
    console.log(this.props);
    const { gameId } = this.props.params;
    const props = difficulties[parseInt(gameId, 10)];
    return (
      <div className="play-page-container">
        <Minesweeper {...props} />
      </div>
    );
  }
};