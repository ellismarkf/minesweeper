import Inferno, { render } from 'inferno';
import Component from 'inferno-component';
import App from './App';
import Home from './pages/home';
import Play from './pages/play';
import Build from './pages/build';
import Browse from './pages/browse';
import { Router, Route, IndexRoute } from 'inferno-router';
import createBrowserHistory from 'history/createBrowserHistory';
import './index.css';


class NoMatch extends Component {
  render() {
    return (
      <div className="catch-all">
        <h1>4 💣 4</h1>
        <p>You found a mine!</p>
      </div>
    );
  }
}


const browserHistory = createBrowserHistory();

function Routes(props) {
  return (
    <Router history={props.history}>
      <Route component={ App } >
        <IndexRoute component={ Home } />
        <Route path="/play/:gameId" component={ Play }/>
        <Route path="/build" component={ Build } />
        <Route path="/browse" component={ Browse } />
        <Route path="*" component={ NoMatch }/>
      </Route>
    </Router>
  );
}

// require('inferno-devtools');
Inferno.options.recyclingEnabled = true;
render(<Routes history={browserHistory} />, document.getElementById('app'));
