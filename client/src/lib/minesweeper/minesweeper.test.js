import * as minesweeper from './';

describe('tiles()', function() {
  it('should return a clamped array of unsigned 8 bit integers {rows * cols} elements', function() {
    var t = minesweeper.tiles(16, 16);
    expect(t).toHaveLength(16 * 16);
    expect(t.buffer.byteLength).toBe(16 * 16);
  });
});

describe('minesweeper.getPerimeter()', function() {
  it('should return 8 neighboring tiles for any tile position', function() {
    var expected = new Int16Array([-5,-6,-1,4,5,6,1,-4]);
    var perimeter = minesweeper.getPerimeter(0, 5);
    expect(perimeter).toHaveLength(8);
    expect(perimeter).toEqual(expected);
  });
});

describe('INVALID_NEIGHBOR', () => {
  it('should return true for neighbors of a given tile that are in invalid positions', () => {
    const perimeter = minesweeper.getPerimeter(9,5);
    const expected = [ false, false, false, false, false, true, true, true ];
    const valueMap = minesweeper.INVALID_NEIGHBOR.map((direction, index) => direction(9, 25, 5, perimeter[index]));
    expect(valueMap).toHaveLength(8);
    expect(valueMap).toEqual(expected);
  });
});

describe('getThreatCount', () => {
  it('should correctly count the number of mines in a given tiles perimeter', () => {
    var t = new Uint8ClampedArray([
      0, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 1, 0,
      0, 0, 0, 0, 0
    ]);
    // var threats = [
    //   1, 1, 1, 0, 0,
    //   1, 0, 1, 0, 0,
    //   1, 1, 2, 1, 1,
    //   0, 0, 1, 0, 1,
    //   0, 0, 1, 1, 1
    // ];
    const perimeter = minesweeper.getPerimeter(12, 5);
    // const threatCount = minesweeper.getThreatCount(perimeter, t);
    const threatCount = minesweeper.getMineCount(12, t, 5, perimeter)
    expect(threatCount).toBe(2);
  });
  it('should not count mines in invalid perimeter positions', () => {
    var t = new Uint8ClampedArray([
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      1, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0
    ]);
    // var threats = [
    //   0, 0, 0, 0, 0,
    //   1, 1, 0, 0, 0,
    //   0, 1, 0, 0, 0,
    //   1, 1, 0, 0, 0,
    //   0, 0, 0, 0, 0
    // ];
    const perimeter = minesweeper.getPerimeter(4, 5);
    // const threatCount = minesweeper.getThreatCount(perimeter, t);
    const threatCount = minesweeper.getMineCount(4, t, 5, perimeter);
    expect(threatCount).toBe(0);
  });
});

describe('markThreatCounts', () => {
  it('should correctly mark threat counts per tile', () => {
    var t = new Uint8ClampedArray([
      0, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 1, 0,
      0, 0, 0, 0, 0
    ]);
    var expected = new Uint8ClampedArray([
      1, 1, 1, 0, 0,
      1, 0, 1, 0, 0,
      1, 1, 2, 1, 1,
      0, 0, 1, 0, 1,
      0, 0, 1, 1, 1
    ]);
    const threats = minesweeper.markThreatCounts(t, 5);
    expect(threats).toEqual(expected);
  });
  it('should not include invalid neighbors when marking', () => {
    var t = new Uint8ClampedArray([
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      1, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0
    ]);
    var expected = new Uint8ClampedArray([
      0, 0, 0, 0, 0,
      1, 1, 0, 0, 0,
      0, 1, 0, 0, 0,
      1, 1, 0, 0, 0,
      0, 0, 0, 0, 0
    ]);
    const threats = minesweeper.markThreatCounts(t, 5);
    expect(threats).toEqual(expected);
  });
  it('should mark threats in corners correctly', () => {
    var t = new Uint8ClampedArray([
      0, 0, 0, 0, 0,
      1, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 1, 0,
      1, 0, 0, 0, 0
    ]);
    var expected = new Uint8ClampedArray([
      1, 1, 0, 0, 0,
      0, 1, 0, 0, 0,
      1, 1, 1, 1, 1,
      1, 1, 1, 0, 1,
      0, 1, 1, 1, 1
    ]);
    const threats = minesweeper.markThreatCounts(t, 5);
    expect(threats).toEqual(expected);
  });
});

describe('safe()', function() {
  it('should return true before players reveals first mine', function() {
    var t = minesweeper.tiles();
    expect(minesweeper.safe(t)).toBe(true);
  });

  it('should return false when a tile with a mine is swept', function() {
    var t = [ 2, 2, 0, 3 ]
    expect(minesweeper.safe(t)).toBe(false);
  });

  it('should return true when all tiles without mines have been swept', function() {
    var t = [ 2, 2, 1, 2 ]
    expect(minesweeper.safe(t)).toBe(true);
  });

  it('should return false when a tile with a mine has been swept (9x9)', function() {
    var t = [
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      3, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    var threats = [
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 1, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    expect(minesweeper.safe(minesweeper.iterativeSweep(27, t, threats, 9))).toBe(false);
  });
});

describe('revealMines()', function() {
  it('should reveal all unswept mine positions', function() {
    var t = [
      0, 0, 0, 0, 0, 0, 0, 0, 1,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 1, 0, 0, 0,
      3, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 0,
      0, 0, 0, 1, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    var expected = [
      0, 0, 0, 0, 0, 0, 0, 0, 3,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 3, 0, 0, 0,
      3, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 3, 0,
      0, 0, 0, 3, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    var updatedBoard = minesweeper.revealMines(t);
    expect(updatedBoard).toEqual(expected);
  });
});

describe('flagTile()', function() {
  it('should return the array of tiles with the specified tile flagged', function() {
    var t = new Uint8ClampedArray([
      0, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 1, 0,
      0, 0, 0, 0, 0
    ]);
    var expected = new Uint8ClampedArray([
      4, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 1, 0,
      0, 0, 0, 0, 0
    ]);
    var updatedBoard = minesweeper.flagTile(0, t);
    expect(updatedBoard).toEqual(expected);
    expect(updatedBoard).toHaveLength(25);
  });
  it('should correctly flag a mined tile', function() {
    var t = new Uint8ClampedArray([
      0, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 1, 0,
      0, 0, 0, 0, 0
    ]);
    var expected = new Uint8ClampedArray([
      0, 0, 0, 0, 0,
      0, 5, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 1, 0,
      0, 0, 0, 0, 0
    ]);
    var updatedBoard = minesweeper.flagTile(6, t);
    expect(updatedBoard).toEqual(expected);
    expect(updatedBoard).toHaveLength(25);
  });
});

describe('iterativeSweep()', function() {
  it('should return a new arry of tiles after iteratively sweeping perimeters', function() {
    var t = minesweeper.tiles();
    var threats = minesweeper.markThreatCounts(t, 9)
    var updatedBoard = minesweeper.iterativeSweep(40, t, threats, 9);
    expect(updatedBoard).toHaveLength(81);
  });

  it('should iteratively sweep perimeters correctly', function() {
    var t = new Uint8ClampedArray([
      0, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 1, 0,
      0, 0, 0, 0, 0
    ]);
    var threats = [
      1, 1, 1, 0, 0,
      1, 0, 1, 0, 0,
      1, 1, 2, 1, 1,
      0, 0, 1, 0, 1,
      0, 0, 1, 1, 1
    ];
    var expected = new Uint8ClampedArray([
      0, 0, 2, 2, 2,
      0, 1, 2, 2, 2,
      0, 0, 2, 2, 2,
      0, 0, 0, 1, 0,
      0, 0, 0, 0, 0
    ]);

    var updatedBoard = minesweeper.iterativeSweep(4, t, threats, 5);
    expect(updatedBoard).toEqual(expected);
  });

  it('should iteratively sweep perimeters of default size board correctly', function() {
    var t = new Uint8ClampedArray([
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 1, 0, 0, 1, 0, 0, 1, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 1, 0, 0, 1, 0, 0, 1, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 1, 0, 0, 1, 0, 0, 1, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0
    ]);

    var threats = [
      1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 0, 1, 1, 0, 1, 1, 0, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 0, 1, 1, 0, 1, 1, 0, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 0, 1, 1, 0, 1, 1, 0, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1
    ];

    var expected = new Uint8ClampedArray([
      0, 0, 0, 0, 0, 2, 0, 0, 0,
      0, 1, 0, 0, 1, 0, 0, 1, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 1, 0, 0, 1, 0, 0, 1, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 1, 0, 0, 1, 0, 0, 1, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0
    ]);
    var updatedBoard = minesweeper.iterativeSweep(5, t, threats, 9);
    expect(updatedBoard).toEqual(expected);
  });
  it('should return a correctly swept board', function() {
    var t = new Uint8ClampedArray([
      0,0,0,0,0,
      0,0,0,0,0,
      0,0,1,0,0,
      0,0,0,0,0,
      0,0,0,0,0,
    ]);
    var threats = [
      0,0,0,0,0,
      0,1,1,1,0,
      0,1,0,1,0,
      0,1,1,1,0,
      0,0,0,0,0, 
    ];
    var sweptBoard = new Uint8ClampedArray([
      2,2,2,2,2,
      2,2,2,2,2,
      2,2,1,2,2,
      2,2,2,2,2,
      2,2,2,2,2,
    ]);
    var updatedBoard = minesweeper.iterativeSweep(0, t, threats, 5);
    expect(updatedBoard).toHaveLength(25);
    expect(updatedBoard).toEqual(sweptBoard);
  });
  it('should return board with all mines swept when run on mined tile', function() {
    var t = new Uint8ClampedArray([
      0, 0, 0, 0, 0, 0, 0, 0, 1,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 1, 0, 0, 0,
      1, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 0,
      0, 0, 0, 1, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0
    ]);
    var threats = minesweeper.markThreatCounts(t, 9);
    var expected = new Uint8ClampedArray([
      0, 0, 0, 0, 0, 0, 0, 0, 3,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 3, 0, 0, 0,
      3, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 3, 0,
      0, 0, 0, 3, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0
    ]);
    var updatedBoard = minesweeper.iterativeSweep(8, t, threats, 9);
    expect(updatedBoard).toEqual(expected); 
  });
  it('should return board with all mines swept when run on mined tile after some tiles have been swept', function() {
    var t = new Uint8ClampedArray([
      2, 2, 1, 0, 0, 0, 0, 1, 0,
      2, 2, 2, 2, 2, 1, 0, 0, 0,
      2, 2, 2, 2, 2, 0, 0, 0, 0,
      2, 2, 2, 2, 2, 1, 0, 0, 1,
      2, 2, 2, 2, 2, 2, 0, 0, 0,
      2, 2, 2, 2, 2, 2, 0, 0, 0,
      2, 2, 1, 2, 2, 2, 1, 0, 0,
      2, 2, 1, 2, 2, 2, 2, 2, 0,
      0, 1, 0, 2, 2, 2, 2, 2, 1
    ]);
    var threats = minesweeper.markThreatCounts(t, 9);
    var expected = new Uint8ClampedArray([
      2, 2, 3, 0, 0, 0, 0, 3, 0,
      2, 2, 2, 2, 2, 3, 0, 0, 0,
      2, 2, 2, 2, 2, 0, 0, 0, 0,
      2, 2, 2, 2, 2, 3, 0, 0, 3,
      2, 2, 2, 2, 2, 2, 0, 0, 0,
      2, 2, 2, 2, 2, 2, 0, 0, 0,
      2, 2, 3, 2, 2, 2, 3, 0, 0,
      2, 2, 3, 2, 2, 2, 2, 2, 0,
      0, 3, 0, 2, 2, 2, 2, 2, 3
    ]);
    var updatedBoard = minesweeper.iterativeSweep(65, t, threats, 9);
    expect(updatedBoard).toEqual(expected); 
  });
});

describe('nonMineTileSwept()', function() {
  it('return true when passed a swept, non-mined tile value', function() {
    const testValue = minesweeper.nonMineTileSwept(2);
    expect(testValue).toBe(true);
  });
});

describe('gameWon', function() {
  it('returns true when all non-mined tiles are swept', function() {
    var t = new Uint8ClampedArray([
      2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 1, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 1, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2
    ]);
    const win = minesweeper.gameWon(t, 2);
    expect(win).toBe(true);
  });
  it('returns true when all mined tiles are flagged', function() {
    var t = new Uint8ClampedArray([
      2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 5, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 5, 2, 2, 2, 2, 2,
      2, 2, 2, 0, 2, 2, 2, 2, 2
    ]);
    const win = minesweeper.gameWon(t, 2);
    expect(win).toBe(true);
  });
});