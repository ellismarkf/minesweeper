import Component from 'inferno-component';
import GameLink from '../../components/gameLink';
import Loader from '../../components/loader';
import './browsePage.css';

export default class BrowsePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minefields: [],
      loading: false,
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
      });
    })
    .catch(err => {
      console.log(err);
      this.setState({
        loading: false,
      });
    });
  }
  render() {
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