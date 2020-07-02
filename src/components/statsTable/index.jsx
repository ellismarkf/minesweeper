import React from 'react'
import './statsTable.css'

export default function StatsTable({ rows, cols, mines }) {
  return (
    <table className="game-stats">
      <thead>
        <tr>
          <th>
            <span role="img" aria-label="rows">↔️</span>
          </th>
          <th>
            <span role="img" aria-label="columns">↕️</span>
          </th>
          <th>
            <span role="img" aria-label="mines">💣</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{cols}</td>
          <td>{rows}</td>
          <td>{mines}</td>
        </tr>
      </tbody>
    </table>
  );
}