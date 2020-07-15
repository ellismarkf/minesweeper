import React, { Fragment } from 'react'
import StatsTable from '../statsTable';
import './gameCard.css'

function difficultyIcon(ratio) {
  if (ratio >= 8) {
    return '😨';
  }
  if (ratio > 4 && ratio < 8) {
    return '😰';
  }
  if (ratio <= 4) {
    return '😱';
  }
  return '⚙️';
}

function difficultyName(ratio) {
  if (ratio >= 8) {
    return 'Too Young To Die';
  }
  if (ratio > 4 && ratio < 8) {
    return 'Hurt Me Plenty';
  }
  if (ratio <= 4) {
    return 'Nightmare';
  }
  return 'Too Young To Die';
}

export default function GameCard({rows, cols, mines, name }) {
  const ratio = Math.floor((rows * cols)/mines);
  const label = name || difficultyName(ratio);
  return (
    <Fragment>
      <h1>
        <span role="img" aria-label="difficulty">
          {difficultyIcon(ratio)}
        </span>
      </h1>
      <h3 className="game-card-title">{label}</h3>
      <StatsTable rows={rows} cols={cols} mines={mines} />
    </Fragment>
  );
};