import { linkEvent } from 'inferno';
import { iterativeSweep } from '../../lib/minesweeper';

const tileContent = {
  0: '',
  1: '',
  2: '',
  3: '💣',
  4: '🚩'
}

const tileStyle = {
  0: 'tile',
  1: 'tile',
  2: 'swept-tile',
  3: 'swept-mine'
}

function generateContent(value, threats) {
  return value === 2 && threats > 0 ? threats : tileContent[value];
};

function handleClick(props) {
  const { pos, context: { data: context }} = props;
  const newTiles = iterativeSweep(pos, context.state.tiles, context.state.threats, context.state.cols);
  context.setState({
    tiles: newTiles,
  });
};

export function shouldUpdate(lastProps, nextProps) {
  return lastProps.value !== nextProps.value;
}

export default function Tile(props) {
  const { value, threats } = props;
  return (
    <div
      className={`${tileStyle[value]} ${threats > 0 ? 'm' + threats  : ''}`}
      onClick={linkEvent(props, handleClick)}
      noNormalize
    >
      <span>{generateContent(value, threats)}</span>
    </div>
  );
}