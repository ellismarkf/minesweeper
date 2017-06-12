import Component from 'inferno-component';
import Minesweeper from '../../components/minesweeper';
import Loader from '../../components/loader';
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
    .then(res => {
      if (!res.ok) {
        return this.props.router.push('/404');
      }
      return res.json();
    })
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
          <Minesweeper {...props} custom={0} />
        </div>
      );
    }
    if (this.state.loading) {
      return (
        <Loader message="...Loading your game"/>
      )
    }
    return (
      <div className="play-page-container">
        <Minesweeper {...this.state} custom={1}/>
      </div>
    );
  }
};