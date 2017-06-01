import { linkEvent } from 'inferno';
import Component from 'inferno-component';
import { Link } from 'inferno-router';
import PlayMenu from '../../components/playMenu';
import './home.css'

function openPlayMenu(instance, event) {
  instance.setState({
    playMenu: 1,
  });
}

function closePlayMenu(instance) {
  return function() {
    instance.setState({
      playMenu: 0,
    });
  }
}

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playMenu: 0,
    }
  }

  render() {
    const playMenuClass = this.state.playMenu > 0 ? 'menu-open' : '';
    const { data: handleMenuClose } = linkEvent(closePlayMenu(this));
    return (
      <div>
        {this.state.playMenu > 0 &&
          <PlayMenu closePlayMenu={handleMenuClose} />
        }
        <div className={`home-page-container ${playMenuClass}`}>
          <h1>Minesweeper</h1>
          <div className="mode-selector-container">
            <div onClick={linkEvent(this, openPlayMenu)} >
              <h1>🕹</h1>
              <h3>Play</h3>
              <p>The classic game of luck and logic.</p>
            </div>
            <Link to="/build">
              <h1>🛠</h1>
              <h3>Build</h3>
              <p>Create and share custom minefields.</p>
            </Link>
            <Link to="/browse">
              <h1>🔍</h1>
              <h3>Browse</h3>
              <p>Find and play a minefield made by the community.</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }
};