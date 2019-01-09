/* eslint-disable no-unused-vars */
import React from 'react';
import {render} from 'react-dom';
import {canUseDOM} from './utils/dom';

import './styles/index.scss';
import 'prismjs/themes/prism.css';

if(canUseDOM) {
	// this isn't great. Heavy, and it breaks on iOS
	require('intersection-observer');
	history && (history.scrollRestoration = 'manual');
}

function init() {
  const App = require('./components/app').default;
  const node = document.getElementById('app');

	render(<App />, node)
}

if (module.hot) {
  module.hot.accept('./components/app', () => requestAnimationFrame(init));
}

init();
