/* eslint-disable no-unused-vars */
import React from 'react';
import {render} from 'react-dom';
/* eslint-enable no-unused-vars */

import './styles/index.scss';

function init() {
  const App = require('./components/app').default;
  const node = document.getElementById('app');

	render(<App />, node)
}

if (module.hot) {
  module.hot.accept('./components/app', () => requestAnimationFrame(init));
}

init();
