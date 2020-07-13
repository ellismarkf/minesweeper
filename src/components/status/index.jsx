import React from 'react'
import {
  lost,
  won,
} from '../../lib/minesweeper'
import './status.css'

function getEmotionStatus(state) {
  switch (state) {
    case lost:
      return '💀';
    case won:
      return '😎';
    default:
      return '😊';
  }
};

export default function Status(props) {
  return (
    <span onClick={props.onClick} className="game-status-icon" role="img" aria-label="status">
      {props.panic ? '😱' :  getEmotionStatus(props.state)}
    </span>
  )
}