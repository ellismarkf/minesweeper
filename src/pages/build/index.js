import Component from 'inferno-component';
import { linkEvent } from 'inferno';
import MinefieldBuilder from '../../components/minefieldBuilder';

function redirectToBrowsePage(instance) {
  return function() {
    instance.props.router.push('/browse');
  }
}

export default class BuildPage extends Component {
  render() {
    const { data: redirect } = linkEvent(redirectToBrowsePage(this));
    return (
      <div>
        <h1>Build a Custom Minefield</h1>
        <MinefieldBuilder onSaveSuccess={redirect} />
      </div>
    );
  }
}