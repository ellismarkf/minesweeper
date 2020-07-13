import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Home, Play, Browse } from './pages'
import './App.css';

const NoMatch = () => (
  <div className="catch-all">
    <h1>4 <span role="img" aria-label="0">💣</span> 4</h1>
    <p>You found a mine!</p>
  </div>
)

const Build = () => <p>build</p>

function App() {
  return (
    <Router>
      <header>
        <Link to="/">
          <span role="img" aria-label="Home">🏠</span> Home
        </Link>
      </header>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/play/:gameId">
          <Play />
        </Route>
        <Route path="/build">
          <Build />
        </Route>
        <Route path="/browse">
          <Browse />
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
