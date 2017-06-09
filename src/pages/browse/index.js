import Component from 'inferno-component';
import GameLink from '../../components/gameLink';
import './browsePage.css';

export default class BrowsePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minefields: [],
    }
  }

  componentDidMount() {
    window.fetch(`https://minesweeper-backend-api.herokuapp.com/minefields`)
    .then(res => res.json())
    .then(result => { this.setState({ minefields: result }) })
    .catch(err => { console.log(err) });
  }
  render() {
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