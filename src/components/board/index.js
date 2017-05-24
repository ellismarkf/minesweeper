import Tile, { shouldUpdate } from '../tile';

export default function Board({ tiles, threats, cols, onTileClick, game }) {
  const tileElements = [];
  for (let i = 0; i < tiles.length; i++) {
    tileElements.push(
      <Tile
        pos={i}
        value={tiles[i]}
        threats={threats[i]}
        onTileClick={onTileClick}
        onComponentShouldUpdate={shouldUpdate}
        game={game}
      />
    )
  }
  return tileElements;
}
