import { linkEvent } from 'inferno';
import { iterativeSweep, swept, safe, won, lost, flagTile, flagged } from '../../lib/minesweeper';

const tileContent = {
  0: '',
  1: '',
  2: '',
  3: '💣',
  4: '🚩',
  5: '🚩',
  6: '🚩',
  7: '💣'
}

const tileStyle = {
  0: 'tile',
  1: 'tile',
  2: 'swept-tile',
  3: 'swept-mine',
  4: 'flagged-tile',
  5: 'flagged-tile',
  6: 'flagged-swept-tile',
  7: 'flagged-swept-mine'
}

function generateContent(value, threats) {
  return value === 2 && threats > 0 ? threats : tileContent[value];
};

function sweptTileHasMinesNearby(value, threats) {
  return ((value & swept) && (threats > 0));
}

function generateClassList(value, threats) {
  let classList = `${tileStyle[value]}`;
  if (sweptTileHasMinesNearby(value, threats)) {
    classList = `${classList} m${threats}`;
  };
  return classList;
}

function isRightClick(type) {
  return type === 2;
}

function handleClick(props, event) {
  const { button: clickType } = event;
  const { pos, context: { data: context }} = props;
  if (context.state.game & lost || context.state.game & won) return;
  if (isRightClick(clickType)) {
    if (context.state.tiles[pos] & swept) return;
    const newTiles = flagTile(pos, context.state.tiles);
    context.setState({
      tiles: newTiles,
    });
    return false;
  }
  if (context.state.tiles[pos] & flagged) return;
  const newTiles = iterativeSweep(pos, context.state.tiles, context.state.threats, context.state.cols);
  const notMine = safe(newTiles);
  context.setState(function(prevState) {
    return {
      tiles: newTiles,
      game: notMine ? prevState.game : lost,
    }
  });
  return false;
};

export function shouldUpdate(lastProps, nextProps) {
  return lastProps.value !== nextProps.value;
}

export default function Tile(props) {
  const { value, threats } = props;
  return (
    <div
      className={generateClassList(value, threats)}
      onMouseDown={linkEvent(props, handleClick)}
      noNormalize
    >
      <span>{generateContent(value, threats)}</span>
    </div>
  );
}