import React from 'react'
import { getPlaceValue } from '../../lib/utils' 

export default function MineCount(props) {
  const ones = getPlaceValue(props.count, 1);
  const tens = getPlaceValue(props.count, 10);
  const hundreds = getPlaceValue(props.count, 100);
  return (
    <span><span role="img" aria-label="mine count">💣</span>{hundreds}{tens}{ones}</span>
  )
}