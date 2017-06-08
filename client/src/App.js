import Component from 'inferno-component';

export default class App extends Component {
  render() {
    return (
      <div>
        { this.props.children } 
      </div>
    );
  }
};