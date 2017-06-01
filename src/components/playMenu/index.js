import { linkEvent } from 'inferno';
import { Link } from 'inferno-router';
import StatsTable from '../statsTable';

function closePlayMenu(props, event) {
  props.closePlayMenu();
}

export default function PlayMenu(props) {
  return (
    <div className="play-menu" onClick={linkEvent(props, closePlayMenu)}>
      <Link to="/play/0">
        <h1> 😨 </h1>
        <h3>Too Young To Die</h3>
        <StatsTable rows={9} cols={9} mines={10} />
      </Link>
      <Link to="/play/1">
        <h1>😰</h1>
        <h3>Hurt Me Plenty</h3>
        <StatsTable rows={16} cols={16} mines={40} />
      </Link>
      <Link to="/play/2">
        <h1>😱</h1>
        <h3>Nightmare</h3>
        <StatsTable rows={16} cols={30} mines={99} />
      </Link>
      <Link to="/play/3">
        <h1>⚙️</h1>
        <h3>Custom</h3>
        <StatsTable rows="R" cols="C" mines="M" />
      </Link>
    </div>
  );
}