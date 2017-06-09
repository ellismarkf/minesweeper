import { linkEvent } from 'inferno';
import { Link } from 'inferno-router';
import StatsTable from '../statsTable';
import GameLink from '../gameLink';

function closePlayMenu(props, event) {
  props.closePlayMenu();
}

export default function PlayMenu(props) {
  return (
    <div className="play-menu" onClick={linkEvent(props, closePlayMenu)}>
      <GameLink gameId={0} rows={9} cols={9} mines={10} />
      <GameLink gameId={1} rows={16} cols={16} mines={40} />
      <GameLink gameId={2} rows={16} cols={30} mines={99} />
      <Link to="/play/3">
        <h1>⚙️</h1>
        <h3>Custom</h3>
        <StatsTable rows="R" cols="C" mines="M" />
      </Link>
    </div>
  );
}