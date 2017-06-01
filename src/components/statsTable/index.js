import './statsTable.css'

export default function StatsTable({ rows, cols, mines }) {
  return (
    <table className="game-stats">
      <thead>
        <th> ↔️ </th>
        <th> ↕️ </th>
        <th> 💣 </th>
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