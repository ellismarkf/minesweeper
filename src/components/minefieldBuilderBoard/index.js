import MinefieldBuilderTile, { shouldUpdate } from '../minefieldBuilderTile';

export default function MinefieldBuilderBoard({ tiles, cols, onTileClick, game }) {
  const tileElements = [];
  for (let i = 0; i < tiles.length; i++) {
    tileElements.push(
      <MinefieldBuilderTile
        pos={i}
        value={tiles[i]}
        onTileClick={onTileClick}
        onComponentShouldUpdate={shouldUpdate}
      />
    )
  }
  return tileElements;
}
