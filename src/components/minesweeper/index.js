import Board from '../board';
import './minesweeper.css';

const Minesweeper = ({ tiles, threats, cols, context }) => (
  <div style={{ width: `${cols * 20}px`}} className='board' noNormalize hasNonKeyedChildren>
    {Board({ tiles, threats, cols, context })}
  </div>
);

export default Minesweeper;