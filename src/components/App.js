import React from 'react';
import {Router, TransitionableReactRoute} from "@stilva/transitionable-react-router";

import Home from '../pages/Home';

import ClientList from '../pages/Client/ClientList';
import ClientEntry from '../pages/Client/ClientEntry';

import LabList from '../pages/Lab/LabList';
import LabEntry from '../pages/Lab/LabEntry';

import PPEntry from '../pages/PPEntry';

export const App = React.memo(function AppFactory() {
  return <TransitionableReactRoute
    timeout={850}
    animateOnMount={true}
  >
    <LabList path="/lab" />
    <LabEntry path="/lab/:labId" />

    <ClientList path="/client" />
    <ClientEntry path="/client/:clientId" />

    <PPEntry path="/paperlesspost" />

    <Home defaultpath />
  </TransitionableReactRoute>;
});

export default function() {
  return <Router>
    <App />
  </Router>;
}
