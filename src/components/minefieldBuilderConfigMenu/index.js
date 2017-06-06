import { linkEvent } from 'inferno';
import Component from 'inferno-component';

const open = 1 << 1;

function handleConfigSubmit(instance, event) {
  event.preventDefault();
  const { rows, cols, mines } = instance.state;
  instance.props.handleConfigSubmit(rows, cols, mines);
}

function closeConfigMenu(instance, event) {
  event.preventDefault();
  instance.props.closeConfigMenu();
}

function handleInputChange(instance, event) {
  instance.setState({
    [event.target.name]: window.parseInt(event.target.value),
  });
}

function handleSetDifficulty(instance, event) {
  const { difficulty } = event.target.dataset;
  switch(difficulty) {
    case "too_young_to_die":
      instance.setState({
        rows: 9,
        cols: 9,
      });
      break;
    case "hurt_me_plenty":
      instance.setState({
        rows: 16,
        cols: 16,
      });
      break;
    case "nightmare":
      instance.setState({
        rows: 16,
        cols: 30,
      });
      break;
    default:
      return;
  }
}

export default class MinefieldBuilderConfigMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: props.rows || 9,
      cols: props.cols || 9,
    }
  }

  render() {
    return (
      <div className={`config-menu ${this.props.displayState & open ? 'open' : ''}`}>
        <form onSubmit={linkEvent(this, handleConfigSubmit)}>
          <div className="standard-difficulty-settings-container">
            <span onClick={linkEvent(this, handleSetDifficulty)} data-difficulty={'too_young_to_die'}>😨</span>                
            <span onClick={linkEvent(this, handleSetDifficulty)} data-difficulty={'hurt_me_plenty'}>😰</span>            
            <span onClick={linkEvent(this, handleSetDifficulty)} data-difficulty={'nightmare'}>😱</span>            
          </div>
          <div className="input-container">
            <div>
              <label htmlFor="rows" title="Rows">↕️</label>              
              <input type="text" value={this.state.rows} onChange={linkEvent(this, handleInputChange)} name="rows" />
            </div>
            <div>
              <label htmlFor="cols" title="Columns">↔️️</label>            
              <input type="text" value={this.state.cols} onChange={linkEvent(this, handleInputChange)} name="cols" />
            </div>
          </div>
          <div className="config-actions-container">
            <button type="submit" className="config-submit">👌</button>
            <button onClick={linkEvent(this, closeConfigMenu)}>❌</button>
          </div>
        </form>
      </div>
    );
  }
}