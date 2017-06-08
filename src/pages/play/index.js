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
  componentDidMount() {
    const { gameId } = this.props.params;
    const id = parseInt(gameId, 10);
    if (id < 4) return;
    window.fetch(
      `https://minesweeper-backend-api.herokuapp.com/minefields/${id}`
    )
    .then(res => res.json())
    .then(result => {
      console.log(result);
    });
  }

  render() {
    const { gameId } = this.props.params;
    const id = parseInt(gameId, 10);
    const props = difficulties[id];
    return (
      <div className="play-page-container">
        <Minesweeper {...props} />
      </div>
    );
  }
};