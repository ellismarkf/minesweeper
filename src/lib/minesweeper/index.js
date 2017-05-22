export function partition(size) {
  return new ArrayBuffer(size);
};

export function tiles(rows = 9, cols = 9) {
  return new Uint8ClampedArray(partition(rows * cols));
};

export function addMines(tiles, mines) {
  return new Uint8ClampedArray(partition(tiles.length))
  .fill(1, 0, mines)
  .sort(() => Math.random() - 0.5);
};

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

export function getPerimeter(tileIndex, cols) {
  PERIMETER[0] = tileIndex - cols;        // N
  PERIMETER[1] = tileIndex - (cols + 1);  // NW
  PERIMETER[2] = tileIndex - 1;           // W
  PERIMETER[3] = tileIndex + (cols - 1);  // SW
  PERIMETER[4] = tileIndex + cols;        // S
  PERIMETER[5] = tileIndex + (cols + 1);  // SE
  PERIMETER[6] = tileIndex + 1;           // E
  PERIMETER[7] = tileIndex - (cols - 1);  // NE
  return PERIMETER;
};

export function invalidN(tileIndex, tileCount, cols, neighbor) {
  return neighbor < 0;
};
export function invalidS(tileIndex, tileCount, cols, neighbor) {
  return neighbor >= tileCount;
};
export function invalidE(tileIndex, tileCount, cols, neighbor) {
  return ((tileIndex + 1) % cols === 0) && (
    (neighbor === (tileIndex + 1)) ||
    (neighbor === (tileIndex - (cols - 1))) ||
    (neighbor === (tileIndex + (cols + 1)))
  );
};
export function invalidW(tileIndex, tileCount, cols, neighbor) {
  return (tileIndex % cols === 0) && (
    neighbor === (tileIndex - 1) ||
    neighbor === (tileIndex + (cols - 1)) ||
    neighbor === (tileIndex - (cols + 1))
  );
};
export function invalidNE(tileIndex, tileCount, cols, neighbor) {
  return (
    invalidN(tileIndex, tileCount, cols, neighbor) ||
    invalidE(tileIndex, tileCount, cols, neighbor)
  );
};
export function invalidNW(tileIndex, tileCount, cols, neighbor) {
  return (
    invalidN(tileIndex, tileCount, cols, neighbor) ||
    invalidW(tileIndex, tileCount ,cols, neighbor)
  );
};
export function invalidSE(tileIndex, tileCount, cols, neighbor) {
  return (
    invalidS(tileIndex, tileCount, cols ,neighbor) ||
    invalidE(tileIndex, tileCount ,cols, neighbor)
  );
};
export function invalidSW(tileIndex, tileCount, cols, neighbor) {
  return (
    invalidS(tileIndex, tileCount, cols, neighbor) ||
    invalidW(tileIndex, tileCount, cols, neighbor)
  );
};

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

export function getMineCount(pos, tiles, cols, perimeter) {
  let threatCount = 0;
  for (var i = 0; i < perimeter.length; i++) {
    if (INVALID_NEIGHBOR[i](pos, tiles.length, cols, perimeter[i])) continue;
    if (tiles[perimeter[i]] & hasMine) threatCount += 1;
  }
  return threatCount;
};

export function markThreatCounts(tiles, cols) {
 return tiles.map((tileValue, pos, tiles) => {
    const perimeter = getPerimeter(pos, cols);
    return getMineCount(pos, tiles, cols, perimeter);
  });
};

export function iterativeSweep(pos, tiles, threats, cols) {
  var newTiles = new Uint8ClampedArray(tiles);
  newTiles[pos] |= swept;
  if ((newTiles[pos] & hasMine) || (threats[pos] > 0)) {
    return newTiles;
  }
  var next = [];
  next.push(pos)

  while (next.length !== 0) {
    var currentPos = next.pop();
    var valueAt = getPerimeter(currentPos, cols);
    if (!(newTiles[currentPos] & swept)) {
      newTiles[currentPos] |= swept;
    }
    
    for (var i = 0; i < valueAt.length; i++) {
      if (newTiles[valueAt[i]] === undefined) continue;
      if (newTiles[valueAt[i]] & hasMine) continue;
      if (INVALID_NEIGHBOR[i](currentPos, newTiles.length, cols, valueAt[i])) continue;
      if (newTiles[valueAt[i]] & swept) continue;
      if (threats[valueAt[i]] === 0) {
        next.push(valueAt[i]);
      }
      if (threats[valueAt[i]] > 0) {
        newTiles[valueAt[i]] |= swept;
      }
    }
  }
  return newTiles;
};

export function safe(tiles) {
  let safe = true;
  for(let i = 0; i < tiles.length; i++) {
    if ((tiles[i] & swept) && (tiles[i] & hasMine)) {
      safe = false;
      break;
    }
  }
  return safe;
}

export function revealMines(tiles) {
  for(let i = 0; i < tiles.length; i++) {
    if (!(tiles[i] & hasMine)) continue;
    tiles[i] |= swept;
  };
  return tiles;
};

export function board(rows = 9, cols = 9, mines = 10) {
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
};