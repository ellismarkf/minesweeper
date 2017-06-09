import Component from 'inferno-component';
import Minesweeper from '../../components/minesweeper';
import { board } from '../../lib/minesweeper';
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

  state = {
    rows: 9,
    cols: 9,
    mines: 10,
    tiles: [],
    loading: false,
  }

  componentDidMount() {
    const { gameId } = this.props.params;
    const id = parseInt(gameId, 10);
    if (id < 4) return;
    this.setState({
      loading: true,
    });
    window.fetch(
      `https://minesweeper-backend-api.herokuapp.com/minefields/${id}`
    )
    .then(res => res.json())
    .then(result => {
      this.setState({
        rows: result.rows,
        cols: result.cols,
        mines: result.mines,
        tiles: result.tiles,
        loading: false,
      });
    })
    .catch(err => {
      console.log(err.message, err.stack);
      this.setState(function(prevState) {
        return {
          ...board(prevState.rows, prevState.cols, prevState.mines),
          loading: false,
        }
      });
    });
  }

  render() {
    const { gameId } = this.props.params;
    const id = parseInt(gameId, 10);
    if (id < 4) {
      const props = difficulties[id];
      return (
        <div className="play-page-container">
          <Minesweeper {...props} />
        </div>
      );
    }
    if (this.state.loading) {
      return (
        <h1>...Loading your game</h1>
      )
    }
    return (
      <div className="play-page-container">
        <Minesweeper {...this.state} />
      </div>
    );
  }
};