import Component from 'inferno-component';
import { Link } from 'inferno-router';

export default class App extends Component {
  render() {
    return (
      <div>
        <Link to="/">🏠 Home</Link>
        { this.props.children } 
      </div>
    );
  }
};