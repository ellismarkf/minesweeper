"use strict";

const board = (rows = 9, cols = 9, mines = 10) => {
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

const partition = (size) =>
  new ArrayBuffer(size);

const tiles = (rows = 9, cols = 9) =>
  new Uint8ClampedArray(partition(rows * cols))

const addMines = (tiles, mines) =>
  new Uint8ClampedArray(partition(tiles.length))
  .fill(1, 0, mines)
  .sort(() => Math.random() - 0.5)

const markThreatCounts = (tiles, cols) =>
  tiles.map( (tile, index, tiles ) => {
    const perimeter = getPerimeter(index, tiles.length, cols)
    return getThreatCount(perimeter, tiles)
  })

const hasMine = 1 << 0,
      swept   = 1 << 1,
      flagged = 1 << 2

const playing = 1 << 0,
      editing = 1 << 1

const active  = 1 << 0,
      won     = 1 << 1,
      lost    = 1 << 2

const PERIMETER = new Int16Array(8);
const SECONDARY_PERIMETER = new Int16Array(8);
const perimeter = (tileIndex, cols) => new Set([
  tileIndex - cols,
  tileIndex - (cols + 1),
  tileIndex - 1,
  tileIndex + (cols - 1),
  tileIndex + cols,
  tileIndex + (cols + 1),
  tileIndex + 1,
  tileIndex - (cols - 1),
])

const getPerimeter2 = (tileIndex, tileCount, cols) =>
  new Int16Array([...perimeter(tileIndex, cols)])
  .filter( pos => {
    const invalidW = checkWest(tileIndex, cols, pos)
    const invalidE = checkEast(tileIndex, cols, pos)
    const invalidY = pos < 0 || pos >= tileCount

    return !invalidW && !invalidE && !invalidY
  })

const getPerimeter = (tileIndex, cols) => {
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

const updateValidity = (tileIndex, tileCount, cols) => {
  NEIGHBOR_VALIDITY[0] = invalidN(PERIMETER[0]);
  NEIGHBOR_VALIDITY[1] = invalidNW(tileIndex, cols, PERIMETER[1]);
  NEIGHBOR_VALIDITY[2] = invalidW(tileIndex, cols, PERIMETER[2]);
  NEIGHBOR_VALIDITY[3] = invalidSW(tileIndex, tileCount, cols, PERIMETER[3]);
  NEIGHBOR_VALIDITY[4] = invalidS(PERIMETER[4], tileCount);
  NEIGHBOR_VALIDITY[5] = invalidSE(tileIndex, tileCount, cols, PERIMETER[5]);
  NEIGHBOR_VALIDITY[6] = invalidE(tileIndex, cols, PERIMETER[6]);
  NEIGHBOR_VALIDITY[7] = invalidNE(tileIndex, cols, PERIMETER[7])
  return NEIGHBOR_VALIDITY;
}

const updateValidityTable = () => {
  NEIGHBOR_VALIDITY[0] = invalidN;
  NEIGHBOR_VALIDITY[1] = invalidNW;
  NEIGHBOR_VALIDITY[2] = invalidW;
  NEIGHBOR_VALIDITY[3] = invalidSW;
  NEIGHBOR_VALIDITY[4] = invalidS;
  NEIGHBOR_VALIDITY[5] = invalidSE;
  NEIGHBOR_VALIDITY[6] = invalidE;
  NEIGHBOR_VALIDITY[7] = invalidNE;
  return NEIGHBOR_VALIDITY;
}

const getThreatCount = (perimeter, tiles) =>
  perimeter.reduce((threats, pos) =>
    tiles[pos] & hasMine ? threats += 1 : threats
  , 0)

const checkWest = (t, c, pI) =>
  t % c === 0 &&
    (pI === (t - 1) || pI === (t + (c - 1)) || pI === (t - (c + 1)))

const checkEast = (t, c, pI) =>
  (t + 1) % c === 0 &&
    (pI === (t + 1) || pI === (t - (c - 1)) || pI === (t + (c + 1)))

const invalidN = (tileIndex, tileCount, cols, neighbor) =>
  neighbor < 0;
const invalidS = (tileIndex, tileCount, cols, neighbor) =>
  neighbor >= tileCount;
const invalidE = (tileIndex, tileCount, cols, neighbor) =>
  ((tileIndex + 1) % cols === 0) && (
    (neighbor === (tileIndex + 1)) ||
    (neighbor === (tileIndex - (cols - 1))) ||
    (neighbor === (tileIndex + (cols + 1)))
  );
const invalidW = (tileIndex, tileCount, cols, neighbor) =>
  (tileIndex % cols === 0) && (
    neighbor === (tileIndex - 1) ||
    neighbor === (tileIndex + (cols - 1)) ||
    neighbor === (tileIndex - (cols + 1))
  );
const invalidNE = (tileIndex, tileCount, cols, neighbor) =>
  invalidN(tileIndex, tileCount, cols, neighbor) ||
  invalidE(tileIndex, tileCount, cols, neighbor);
const invalidNW = (tileIndex, tileCount, cols, neighbor) =>
  invalidN(tileIndex, tileCount, cols, neighbor) ||
  invalidW(tileIndex, tileCount ,cols, neighbor);
const invalidSE = (tileIndex, tileCount, cols, neighbor) =>
  invalidS(tileIndex, tileCount, cols ,neighbor) ||
  invalidE(tileIndex, tileCount ,cols, neighbor);
const invalidSW = (tileIndex, tileCount, cols, neighbor) =>
  invalidS(tileIndex, tileCount, cols, neighbor) ||
  invalidW(tileIndex, tileCount, cols, neighbor);

const INVALID_NEIGHBOR = [
  invalidN,
  invalidNW,
  invalidW,
  invalidSW,
  invalidS,
  invalidSE,
  invalidE,
  invalidNE,
];

const sweep = (pos, tiles, threats, cols) => {
  const currentTile = tiles[pos]
  const threatCount = threats[pos]
  const sweptTile = currentTile | swept
  const updatedBoard = tiles.map((tile, i) =>
    i === pos ? sweptTile : tile
  )
  if ((currentTile & hasMine) || (threatCount > 0)) return updatedBoard
  const perimeter = getPerimeter2(pos, updatedBoard.length, cols)
  const newestBoard = perimeter.reduce((board, pPos) =>
    !(board[pPos] & swept) ? sweep(pPos, board, threats, cols) : board
  , updatedBoard);
  return newestBoard;
}

const iterativeSweep = (pos, tiles, threats, cols) => {
  const newTiles = new Uint8ClampedArray(tiles);
  newTiles[pos] = newTiles[pos] | swept;
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
      newTiles[currentPos] = newTiles[currentPos] | swept;
    }
    inner:
    for (let i = 0; i < valueAt.length; i++) {
      if (newTiles[valueAt[i]] === undefined) continue inner;
      if (newTiles[valueAt[i]] & hasMine) continue inner;
      if (INVALID_NEIGHBOR[i](currentPos, newTiles.length, cols, valueAt[i])) continue inner;
      if (newTiles[valueAt[i]] === 2) continue inner;
      if (ready.has(valueAt[i])) continue inner;
      if (threats[valueAt[i]] === 0) {
        ready.add(valueAt[i]);
        next.push(valueAt[i]);
      }
      if (threats[valueAt[i]] > 0) {
        newTiles[valueAt[i]] = newTiles[valueAt[i]] | swept;
      }
    }
  }
  return newTiles;
}

const safe = tiles =>
  tiles.reduce( (safe, tile) =>
    safe && (!(tile & swept)  || tile & swept && !(tile & hasMine))
  , true)

const revealMines = tiles =>
  tiles.map( tile =>
    tile & hasMine ? tile | swept : tile
  )

module.exports = {
  board,
  partition,
  tiles,
  addMines,
  markThreatCounts,
  perimeter,
  getPerimeter,
  getThreatCount,
  checkWest,
  checkEast,
  sweep,
  iterativeSweep,
  safe,
  revealMines,
  hasMine,
  swept,
  flagged,
  playing,
  editing,
  active,
  won,
  lost
}
