/* eslint-disable no-unused-vars */
import {h, render, Component} from 'preact';
/* eslint-enable no-unused-vars */

import './styles/index.scss';

function init() {
  const App = require('./components/app').default;
  const node = document.getElementById('app');

	render(<App />, node, node.firstElementChild)
}

if (module.hot) {
  require('preact/debug');
  module.hot.accept('./components/app', () => requestAnimationFrame(init));
}

init();
