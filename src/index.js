import React from 'react';
import {render} from 'react-dom';
import {canUseDOM} from './utils/dom';

import './styles/index.scss';
import 'prismjs/themes/prism.css';

if (canUseDOM) {
  history && (history.scrollRestoration = 'manual');
}

function init() {
  const App = require('./components/App').default;
  const node = document.getElementById('app');

  render(<App/>, node)
}

if (module.hot) {
  module.hot.accept('./components/App', () => requestAnimationFrame(init));
}

init();
