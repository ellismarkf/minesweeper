import './loader.css';

export default function Loader({ message }) {
  return (
    <div className="loader-container">
      <h1>{message}</h1>
      <div className="loader-animation-container">
        <span className="smile"> ☺️ </span>
        <span className="scream"> 😱 </span>
        <span className="bomb"> 💣 </span>
        <span className="boom"> 💥 </span>
      </div>
    </div>
  );
}