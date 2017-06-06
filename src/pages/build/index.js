import Component from 'inferno-component';
import MinefieldBuilder from '../../components/minefieldBuilder';

export default class BuildPage extends Component {
  render() {
    return (
      <div>
        <h1>Build a Custom Minefield</h1>
        <MinefieldBuilder />
      </div>
    );
  }
}