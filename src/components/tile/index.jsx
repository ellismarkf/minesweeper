import React from 'react'
import { swept, won, lost } from '../../lib/minesweeper';
import './tile.css';

const tileContent = {
  0: '',
  1: '',
  2: '',
  3: '💥',
  4: '🚩',
  5: '🚩',
  6: '🚩',
  7: '💣',
};

const gameWonTileContent = {
  0: '',
  1: '🚩',
  2: '',
  3: '💥',
  4: '🚩',
  5: '🚩',
  6: '🚩',
  7: '💣',
};

const gameOverTileContent = {
  0: '',
  1: '',
  2: '',
  3: '💥',
  4: '🚩',
  5: '🚩',
  6: '🚩',
  7: '💣',
};

const tileStyle = {
  0: 'tile',
  1: 'tile',
  2: 'swept-tile',
  3: 'swept-mine',
  4: 'flagged-tile',
  5: 'flagged-tile',
  6: 'flagged-swept-tile',
  7: 'flagged-swept-mine'
}

const gameWonTileStyle = {
  0: 'tile',
  1: 'flagged-tile',
  2: 'swept-tile',
  3: 'swept-mine',
  4: 'flagged-tile',
  5: 'flagged-tile',
  6: 'flagged-swept-tile',
  7: 'flagged-swept-mine'
}

const gameOverTileStyle = {
  0: 'tile',
  1: 'tile',
  2: 'swept-tile',
  3: 'swept-mine',
  4: 'flagged-tile',
  5: 'flagged-tile',
  6: 'flagged-swept-tile',
  7: 'flagged-swept-mine'
}

function tileStyleSet(game, value) {
  switch(game) {
    case won:
      return gameWonTileStyle[value];
    case lost:
      return gameOverTileStyle[value];
    default:
      return tileStyle[value];
  }
};

function tileContentSet(game, value) {
  switch(game) {
    case won:
      return gameWonTileContent[value];
    case lost:
      return gameOverTileContent[value];
    default:
      return tileContent[value];
  }
};

function generateContent(value, threats, game) {
  return value === 2 && threats > 0 ? threats : tileContentSet(game, value);
};

function sweptTileHasMinesNearby(value, threats) {
  return ((value & swept) && (threats > 0));
}

function generateClassList(value, threats, game) {
  let classList = `${tileStyleSet(game, value)}`;
  if (sweptTileHasMinesNearby(value, threats)) {
    classList = `${classList} m${threats}`;
  };
  return classList;
}

export default function Tile(props) {
  const { value, threats, game, onMouseDown, position } = props;
  return (
    <div
      className={generateClassList(value, threats, game)}
      onMouseDown={onMouseDown}
      data-position={position}
    >
      <span>{generateContent(value, threats, game)}</span>
    </div>
  );
}

const builderTileContent = {
  0: '',
  1: '💣'
}

export function BuilderTile(props) {
  const { value, onMouseDown, position } = props;
  return (
    <div
      className="tile"
      onMouseDown={onMouseDown}
      data-position={parseInt(position, 10)}
    >
      <span>{builderTileContent[value]}</span>
    </div>
  )
}