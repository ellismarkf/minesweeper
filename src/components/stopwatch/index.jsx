import React from 'react'
import { getPlaceValue } from '../../lib/utils'

export default function Stopwatch({ elapsed = 0}) {
  const ones = getPlaceValue(elapsed, 1);
  const tens = getPlaceValue(elapsed, 10);
  const hundreds = getPlaceValue(elapsed, 100);
  return (
    <span><span aria-label="stopwatch" role="img">⏱</span>{hundreds}{tens}{ones}</span>
  )
}