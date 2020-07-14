import React, { useState } from 'react'
import './configMenu.css'

const easy = {
  rows: 9,
  cols: 9,
  mines: 10,
}

const intermediate = {
  rows: 16,
  cols: 16,
  mines: 40,
}

const hard = {
  rows: 16,
  cols: 30,
  mines: 99,
}

export default function ConfigMenu(props) {
  const [inputs, setInput] = useState({ rows: 0, cols: 0, mines: 0 })
  function setPreset(event) {
    const { difficulty } = event.target.dataset;
    switch(difficulty) {
      case "too_young_to_die":
        setInput(easy);
        break;
      case "hurt_me_plenty":
        setInput(intermediate);
        break;
      case "nightmare":
        setInput(hard);
        break;
      default:
        return;
    }
  }
  function handleInputChange(event) {
    const { name, value } = event.target
    setInput({ [name]: value })
  }
  return (
    <div className={`config-menu${props.open ? ' open': ''}`}>
      <form onSubmit={props.onSubmit}>
        <div className="standard-difficulty-settings-container">
          <span onClick={setPreset} data-difficulty={'too_young_to_die'} role="img" aria-label="easy">😨</span>                
          <span onClick={setPreset} data-difficulty={'hurt_me_plenty'} role="img" aria-label="intermediate">😰</span>            
          <span onClick={setPreset} data-difficulty={'nightmare'} role="img" aria-label="hard">😱</span>            
        </div>
        <div className="input-container">
          <div>
            <label htmlFor="rows" title="Rows">
              <span role="img" aria-label="columns">↕️</span>
            </label>              
            <input type="text" value={inputs.rows} onChange={handleInputChange} name="rows" />
          </div>
          <div>
            <label htmlFor="cols" title="Columns">
              <span role="img" aria-label="rows">↔️️</span>
            </label>
            <input type="text" value={inputs.cols} onChange={handleInputChange} name="cols" />
          </div>
          <div>
            <label htmlFor="mines" title="Mines">
              <span role="img" aria-label="mines">💣</span>
            </label>            
            <input type="text" value={inputs.mines} onChange={handleInputChange} name="mines" />
          </div>
        </div>
        <div className="config-actions-container">
          <button type="submit" className="config-submit">
            <span role="img" aria-label="submit">👌</span>
          </button>
          <button onClick={props.onCancel} type="button">
            <span role="img" aria-label="cancel">❌</span>
          </button>
        </div>
      </form>
    </div>
  );
}