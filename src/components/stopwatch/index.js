import Component from 'inferno-component';

function greaterThan0(num) {
  return num > 0;
}

function lessThan10(num) {
  return num < 10;
}

function shouldDisplay(num) {
  return greaterThan0(num) && lessThan10(num);
}

export default class Stopwatch extends Component {

  state = {
    elapsed: 0,
    intervalId: 0,
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.mode === 0 || this.props.mode === 2) && nextProps.mode === 1) {
      const instance = this;
      const intervalId = window.setInterval(function() {
        instance.setState(function(prevState) {
          return {
            elapsed: prevState.elapsed + 1,
          }
        });
      }, 1000);
      instance.setState({
        elapsed: 0,
        intervalId,
      });
    }
    if (this.props.mode === 1 && nextProps.mode === 0) {
      this.setState(function(prevState) {
        return {
          intervalId: window.clearInterval(prevState.intervalId),
        };
      });
    }
    if (this.props.mode === 1 && nextProps.mode === 2) {
      this.setState(function(prevState) {
        return {
          intervalId: window.clearInterval(prevState.intervalId),
          elapsed: 0,
        }
      });
    }
    if (this.props.mode === 0 && nextProps.mode === 2) {
      this.setState({
        elapsed: 0,
      });
    }
  }

  render() {
    const { elapsed } = this.state;
    const tensValue = Math.floor(elapsed / 10);
    const hundredsValue = Math.floor(elapsed / 100);
    const ones = elapsed % 10;
    const tens = shouldDisplay(tensValue) ? tensValue : 0;
    const hundreds = shouldDisplay(hundredsValue) ? hundredsValue : 0;
    return (
      <div>
        <span>⏱&nbsp;</span>
        <span>{hundreds}{tens}{ones}</span>
      </div>
    );
  }
}
