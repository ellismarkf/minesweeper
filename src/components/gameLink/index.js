import { Link } from 'inferno-router';
import StatsTable from '../statsTable';

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
  return '😨';
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

export default function GameLink({ gameId, rows, cols, mines, name }) {
  const ratio = Math.floor((rows * cols)/mines);
  const label = name ? name : difficultyName(ratio);
  return (
    <Link to={`/play/${gameId}`}>
      <h1>{difficultyIcon(ratio)}</h1>
      <h3>{label}</h3>
      <StatsTable rows={rows} cols={cols} mines={mines} />
    </Link>
  );
};