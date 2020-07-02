import React, { useState } from 'react'
import useInterval from '../../lib/useInterval'

const MAX = 999

function getPlaceValue(n, place) {
  return Math.floor((n % (place * 10)) / place)
}

export default function Stopwatch({ startAt = 0, paused = true, max = MAX }) {
  const [elapsed, setElapsed] = useState(startAt)
  useInterval(() => {
    setElapsed(elapsed + 1)
  }, paused || elapsed >= max ? null : 1000)
  const ones = getPlaceValue(elapsed, 1);
  const tens = getPlaceValue(elapsed, 10);
  const hundreds = getPlaceValue(elapsed, 100);
  return (
    <div>
      <span aria-label="stopwatch" role="img">⏱</span>
      <span>{' '}{hundreds}{tens}{ones}</span>
    </div>
  )
}