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

export const inactive= 0;
export const active  = 1 << 0;
export const won     = 1 << 1;
export const lost    = 1 << 2;
export const sweeping= 1 << 3;

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
    if (tiles[pos] & hasMine) continue;
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

export function revealMines(tiles) {
   for(let i = 0; i < tiles.length; i++) {
    if ((tiles[i] & hasMine)) tiles[i] |= swept;
    continue;
  };
  return tiles;
};

export function sweep(pos, tiles, threats, cols) {
  tiles[pos] |= swept;
  if (threats[pos] > 0) {
    return tiles;
  }
  if ((tiles[pos] & hasMine)) {
    return revealMines(tiles);
  }
  let next = [];
  next.push(pos)

  while (next.length !== 0) {
    let currentPos = next.pop();
    let valueAt = getPerimeter(currentPos, cols);
    if (!(tiles[currentPos] & swept)) {
      tiles[currentPos] |= swept;
    }
    
    for (let i = 0; i < valueAt.length; i++) {
      if (tiles[valueAt[i]] === undefined) continue;
      if (tiles[valueAt[i]] & hasMine) continue;
      if (INVALID_NEIGHBOR[i](currentPos, tiles.length, cols, valueAt[i])) continue;
      if (tiles[valueAt[i]] & swept) continue;
      if (tiles[valueAt[i]] & flagged) continue;
      if (threats[valueAt[i]] === 0) {
        next.push(valueAt[i]);
      }
      if (threats[valueAt[i]] > 0) {
        tiles[valueAt[i]] |= swept;
      }
    }
  }
  return tiles;
};

export function checkSafe(tiles) {
  let safe = true;
  for(let i = 0; i < tiles.length; i++) {
    if ((tiles[i] & swept) && (tiles[i] & hasMine)) {
      safe = false;
      break;
    }
  }
  return safe;
}

export function mineIsFlagged(value) {
  return (
    (value & hasMine) &&
    (value & flagged)
  );
}

function mineIsNotFlagged(value) {
  return (
    (value & hasMine) &&
    !(value & flagged)
  );
}

export function flagTile(pos, tiles) {
  switch (tiles[pos]) {
    case hasMine:
    case 0:
      tiles[pos] |= flagged;
      break;
    case hasMine | flagged:
      tiles[pos] &= hasMine;
      break;
    case swept | flagged:
      tiles[pos] &= swept;
      break;
    case 0 | flagged:
      tiles[pos] = 0;
      break;
    default:
      tiles[pos] |= flagged;
      break;
  }
  return tiles;
}

export function nonMineTileSwept(value) {
  return (
    (value & swept) &&
    !(value & hasMine)
  );
}

export function nonMineTileFlagged(value) {
  return (
    (value & flagged) &&
    !(value & hasMine)
  );
}

export function checkWin(tiles, totalMines) {
  let minesFlagged = 0;
  let sweptTiles = 0;
  let flaggedNonMines = 0;
  let nonMineTiles = tiles.length - totalMines;
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i]
    if (mineIsFlagged(tile)) minesFlagged +=1;
    if (nonMineTileSwept(tile)) sweptTiles += 1;
    if (nonMineTileFlagged(tile)) flaggedNonMines += 1;
  }
  const allNonMineTilesSwept = nonMineTiles === sweptTiles;
  const allMinesFlagged = minesFlagged === totalMines;
  return allNonMineTilesSwept || (allMinesFlagged && flaggedNonMines === 0);
};

export function countRemainingMines(tiles) {
  let mines = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (mineIsNotFlagged(tiles[i])) mines += 1;
    continue;
  }
  return mines;
}

function tileIsFlagged(value) {
  return value & flagged;
}

export function flaggedTiles(tiles) {
  let flaggedCount = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (tileIsFlagged(tiles[i])) flaggedCount += 1;
    continue;
  }
  return flaggedCount;
}

export function buildEmptyBoard(rows = 9, cols = 9) {
  return {
    rows,
    cols,
    mines: 0,
    tiles: tiles(rows, cols),
  }
}

export function buildBoard(rows = 9, cols = 9, mines = 10, layout = null) {
  const randomLayout = addMines(tiles(rows, cols), mines);
  const importLayout = layout !== null
  return {
    rows,
    cols,
    mines,
    remainingMines: mines,
    tiles: importLayout
      ? layout
      : randomLayout,
    threats: importLayout
      ? markThreatCounts(layout, cols)
      : markThreatCounts(randomLayout, cols),
    mode: 0,
    game: inactive,
  }
};