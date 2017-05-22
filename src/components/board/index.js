import Tile, { shouldUpdate } from '../tile';

export default function Board({ tiles, threats, cols, context }) {
  const tileElements = [];
  for (let i = 0; i < tiles.length; i++) {
    tileElements.push(
      <Tile
        pos={i}
        value={tiles[i]}
        threats={threats[i]}
        context={context}
        onComponentShouldUpdate={shouldUpdate}
      />
    )
  }
  return tileElements;
}
