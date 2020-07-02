import React from 'react'
import { Link } from 'react-router-dom'
import GameCard from '../gameCard';

export default function PlayMenu(props) {
  return (
    <div className="play-menu" onClick={props.onClick}>
      <Link to="/play/0">
        <GameCard rows={9} cols={9} mines={10} />
      </Link>
      <Link to="/play/1">
        <GameCard rows={16} cols={16} mines={40} />
      </Link>
      <Link to="/play/2">
        <GameCard rows={16} cols={30} mines={99} />
      </Link>
      <Link to="/play/3">
        <GameCard name="Custom" rows="R" cols="C" mines="M"/>
      </Link>
    </div>
  );
}