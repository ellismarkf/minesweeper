import Board from '../board';
import { flaggedTiles, lost, won, sweeping } from '../../lib/minesweeper';
import './minesweeper.css';

function emotion(game) {
  switch (game) {
    case lost:
      return '💀';
    case won:
      return '😎';
    case sweeping:
      return '😱'
    default:
      return '😊';
  }
};

export default function Minesweeper({ tiles, threats, cols, context, game, mines }) {
  return (
    <div style={{ width: `${(cols * 16) + 40}px`}} className="game-container" id="minesweeper">
      <div className="control-panel" style={{ width: `${(cols * 16) + 2}px`}}>
        <div>💣 {mines - flaggedTiles(tiles)}</div>
        <div>{ emotion(game) }</div>
        <div>⏱</div>
      </div>
      <div style={{ width: `${(cols * 16) + 2}px`}} className='board' noNormalize hasNonKeyedChildren>
        {Board({ tiles, threats, cols, context })}
      </div>
    </div>
  );
}
