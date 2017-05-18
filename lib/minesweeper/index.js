export const partition = (size) =>
  new ArrayBuffer(size);

export const tiles = (rows = 9, cols = 9) =>
  new Uint8ClampedArray(partition(rows * cols))

export const addMines = (tiles, mines) =>
  new Uint8ClampedArray(partition(tiles.length))
  .fill(1, 0, mines)
  .sort(() => Math.random() - 0.5)


export const board = (rows = 9, cols = 9, mines = 10) => {
  const t = addMines(tiles(rows, cols), mines)
  return {
    rows,
    cols,
    mines,
    remainingMines: mines,
    tiles: t,
    threats: markThreatCounts(t, cols),
    mode: 0,
    game: 0
  }
}
export const hasMine = 1 << 0;
export const swept   = 1 << 1;
export const flagged = 1 << 2;

export const playing = 1 << 0;
export const editing = 1 << 1;

export const active  = 1 << 0;
export const won     = 1 << 1;
export const lost    = 1 << 2;

export const PERIMETER = new Int16Array(8);
export const SECONDARY_PERIMETER = new Int16Array(8);

export const getPerimeter = (tileIndex, cols) => {
  PERIMETER[0] = tileIndex - cols;        // N
  PERIMETER[1] = tileIndex - (cols + 1);  // NW
  PERIMETER[2] = tileIndex - 1;           // W
  PERIMETER[3] = tileIndex + (cols - 1);  // SW
  PERIMETER[4] = tileIndex + cols;        // S
  PERIMETER[5] = tileIndex + (cols + 1);  // SE
  PERIMETER[6] = tileIndex + 1;           // E
  PERIMETER[7] = tileIndex - (cols - 1);  // NE
  return PERIMETER;
}

const getSecondaryPerimeter = (tileIndex, cols) => {
  SECONDARY_PERIMETER[0] = tileIndex - cols;        // N
  SECONDARY_PERIMETER[1] = tileIndex - (cols + 1);  // NW
  SECONDARY_PERIMETER[2] = tileIndex - 1;           // W
  SECONDARY_PERIMETER[3] = tileIndex + (cols - 1);  // SW
  SECONDARY_PERIMETER[4] = tileIndex + cols;        // S
  SECONDARY_PERIMETER[5] = tileIndex + (cols + 1);  // SE
  SECONDARY_PERIMETER[6] = tileIndex + 1;           // E
  SECONDARY_PERIMETER[7] = tileIndex - (cols - 1);  // NE
  return SECONDARY_PERIMETER;
};

export const getThreatCount = (perimeter, tiles) =>
  perimeter.reduce((threats, pos) =>
    tiles[pos] & hasMine ? threats += 1 : threats
  , 0)

export const markThreatCounts = (tiles, cols) =>
  tiles.map( (tile, index, tiles ) => {
    const perimeter = getPerimeter(index, cols)
    return getThreatCount(perimeter, tiles)
  })

export const invalidN = (tileIndex, tileCount, cols, neighbor) =>
  neighbor < 0;
export const invalidS = (tileIndex, tileCount, cols, neighbor) =>
  neighbor >= tileCount;
export const invalidE = (tileIndex, tileCount, cols, neighbor) =>
  ((tileIndex + 1) % cols === 0) && (
    (neighbor === (tileIndex + 1)) ||
    (neighbor === (tileIndex - (cols - 1))) ||
    (neighbor === (tileIndex + (cols + 1)))
  );
export const invalidW = (tileIndex, tileCount, cols, neighbor) =>
  (tileIndex % cols === 0) && (
    neighbor === (tileIndex - 1) ||
    neighbor === (tileIndex + (cols - 1)) ||
    neighbor === (tileIndex - (cols + 1))
  );
export const invalidNE = (tileIndex, tileCount, cols, neighbor) =>
  invalidN(tileIndex, tileCount, cols, neighbor) ||
  invalidE(tileIndex, tileCount, cols, neighbor);
export const invalidNW = (tileIndex, tileCount, cols, neighbor) =>
  invalidN(tileIndex, tileCount, cols, neighbor) ||
  invalidW(tileIndex, tileCount ,cols, neighbor);
export const invalidSE = (tileIndex, tileCount, cols, neighbor) =>
  invalidS(tileIndex, tileCount, cols ,neighbor) ||
  invalidE(tileIndex, tileCount ,cols, neighbor);
export const invalidSW = (tileIndex, tileCount, cols, neighbor) =>
  invalidS(tileIndex, tileCount, cols, neighbor) ||
  invalidW(tileIndex, tileCount, cols, neighbor);

export const INVALID_NEIGHBOR = [
  invalidN,
  invalidNW,
  invalidW,
  invalidSW,
  invalidS,
  invalidSE,
  invalidE,
  invalidNE,
];

export const iterativeSweep = (pos, tiles, threats, cols) => {
  const newTiles = new Uint8ClampedArray(tiles);
  newTiles[pos] |= swept;
  if ((newTiles[pos] & hasMine) || (threats[pos] > 0)) {
    return newTiles;
  }
  const next = [];
  const ready = new Set();
  ready.add(pos)
  next.push(pos)

  while (next.length !== 0) {
    const currentPos = next.pop();
    const valueAt = getPerimeter(currentPos, cols);
    if (!(newTiles[currentPos] & swept)) {
      newTiles[currentPos] |= swept;
    }
    
    for (let i = 0; i < valueAt.length; i++) {
      if (newTiles[valueAt[i]] === undefined) continue;
      if (newTiles[valueAt[i]] & hasMine) continue;
      if (INVALID_NEIGHBOR[i](currentPos, newTiles.length, cols, valueAt[i])) continue;
      if (newTiles[valueAt[i]] & swept) continue;
      if (ready.has(valueAt[i])) continue;
      if (threats[valueAt[i]] === 0) {
        ready.add(valueAt[i]);
        next.push(valueAt[i]);
      }
      if (threats[valueAt[i]] > 0) {
        newTiles[valueAt[i]] |= swept;
      }
    }
  }
  return newTiles;
}

export const safe = tiles =>
  tiles.reduce( (safe, tile) =>
    safe && (
      !(tile & swept) || ((tile & swept) && !(tile & hasMine))
    )
  , true)

export const revealMines = tiles =>
  tiles.map( tile =>
    tile & hasMine ? tile | swept : tile
  )