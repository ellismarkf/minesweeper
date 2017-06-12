import Component from 'inferno-component';
import { Link } from 'inferno-router';
import GameLink from '../../components/gameLink';
import Loader from '../../components/loader';
import './browsePage.css';

export default class BrowsePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minefields: [],
      loading: false,
      fetched: false,
    }
  }

  componentDidMount() {
    this.setState({
      loading: true,
    });
    window.fetch(`https://minesweeper-backend-api.herokuapp.com/minefields`)
    .then(res => res.json())
    .then(result => {
      this.setState({
        minefields: result,
        loading: false,
        fetched: true,
      });
    })
    .catch(err => {
      console.log(err);
      this.setState({
        loading: false,
        fetched: true,
      });
    });
  }
  render() {
    if (!this.state.loading && this.state.fetched && this.state.minefields.length < 1) {
      return (
        <div className="empty-minefield-viewer">
          <h1>😢</h1>
          <h2>Looks like nobody has built any custom minefields yet.</h2>
          <p><Link to="/build">Build one</Link> now for great good!</p>
        </div>
      );
    }
    if (this.state.loading) {
      return (
        <Loader message="...Loading"/>
      );
    }
    return (
      <div className="game-link-container">
        {this.state.minefields.map(minefield => (
          <GameLink
            gameId={minefield.id}
            rows={minefield.rows}
            cols={minefield.cols}
            mines={minefield.mines}
            name={minefield.name}
          />
        ))}
      </div>
    );
  }
}