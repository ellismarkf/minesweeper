import React, { useState } from 'react'

function getDifficulty(preset) {
  switch(preset) {
    case "too_young_to_die":
      return {
        rows: 9,
        cols: 9,
      }
    case "hurt_me_plenty":
      return {
        rows: 16,
        cols: 16,
      }
    case "nightmare":
      return {
        rows: 16,
        cols: 30,
      }
    default:
      return;
  }
}

export default function BuilderConfigMenu({ rows = 9, cols = 9, open, onSubmit, onCancel }) {
  const [state, setState] = useState({ rows, cols })
  function handleInputChange(event) {
    setState({ ...state, [event.target.name]: parseInt(event.target.value, 10)})
  }
  function setDifficulty(event) {
    const { difficulty } = event.target.dataset;
    setState(getDifficulty(difficulty))
  }
  return (
    <div className={`config-menu ${open ? 'open' : ''}`}>
    <form onSubmit={onSubmit}>
      <div className="standard-difficulty-settings-container">
        <span onClick={setDifficulty} data-difficulty={'too_young_to_die'} role="img" aria-label="easy">😨</span>                
        <span onClick={setDifficulty} data-difficulty={'hurt_me_plenty'} role="img" aria-label="intermediate">😰</span>            
        <span onClick={setDifficulty} data-difficulty={'nightmare'} role="img" aria-label="hard">😱</span>            
      </div>
      <div className="input-container">
        <div>
          <label htmlFor="rows" title="Rows"><span role="img" aria-label="rows">↕️</span></label>              
          <input type="text" value={state.rows} onChange={handleInputChange} name="rows" />
        </div>
        <div>
          <label htmlFor="cols" title="Columns"><span role="img" aria-label="columns">↔️️</span></label>            
          <input type="text" value={state.cols} onChange={handleInputChange} name="cols" />
        </div>
      </div>
      <div className="config-actions-container">
        <button type="button" onClick={onCancel}><span role="img" aria-label="cancel">❌</span></button>
        <button type="submit" className="config-submit"><span role="img" aria-label="submit">👌</span></button>
      </div>
    </form>
  </div>
  )
}
