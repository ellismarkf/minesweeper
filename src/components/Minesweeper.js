import Inferno from 'inferno';
import './minesweeper.css';

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

const content = (tile, threats) =>
  tile === 2 && threats > 0 ? threats : tileContent[tile]

const Board = (tiles, threats, cols, onTileClick) => {
  const tileElements = [];
  for (let i = 0; i < tiles.length; i++) {
    tileElements.push(
      <div
        className={`${tileStyle[tiles[i]]} ${threats[i] > 0 ? 'm' + threats[i]  : ''}`}
        onClick={() => onTileClick(i)}
      >
        <span>{content(tiles[i], threats[i])}</span>
      </div>
    )
  }
  return tileElements;
}

const Minesweeper = ({ tiles, threats, cols, onTileClick }) => (
  <div style={{ width: `${cols * 20}px`}} className='board'>
    {[...Board(tiles, threats, cols, onTileClick)]}
  </div>
);

export default Minesweeper;