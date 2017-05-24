import Inferno, { render } from 'inferno';
import App from './App';
require('inferno-devtools');

Inferno.options.recyclingEnabled = true;
render(<App />, document.getElementById('app'));
