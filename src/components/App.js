import React, {useState, useEffect} from 'react';
import {Router, Location} from "@reach/router";
import {Transition, TransitionGroup} from "react-transition-group";
import cx from 'classnames';

import Home from '../pages/Home';
import Client from '../pages/Client';
import Lab from '../pages/Lab';

export default function App() {
  return <Location>
    {({location}) => (<TransitionGroup component={null} key="transition-group">
      <Transition key={location.key} timeout={875}>
        {state => <Router location={location} key={location.key}
                          className={cx(getClassName(location.pathname), `page--${state}`)}>
          <Home path="/" type="home" transitionState={state} locationKey={location.key}/>
          <Client path="/client/:clientId" type="client" transitionState={state} locationKey={location.key}/>
          <Lab path="/lab" type="lab" transitionState={state} locationKey={location.key}/>
        </Router>}
      </Transition>
    </TransitionGroup>)}
  </Location>;
}

function getClassName(pathname) {
  return pathname === '/' ? 'page--left' : 'page--right'
}
