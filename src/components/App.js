import React, {memo} from 'react';
import {Router, Location} from "@reach/router";
import {Transition, TransitionGroup} from "react-transition-group";

import Home from '../pages/Home';
import Client from '../pages/Client';

export default memo(function App() {
	return <Location>
		{({location}) => (<TransitionGroup component={null} key="transition-group">
			<Transition key={location.key} timeout={875}>
				{state => (
						<Router location={location} key={location.pathname}>
							<Home path="/" type="home" transitionState={state}/>
							<Client path="/client/:clientId" type="client" transitionState={state}/>
						</Router>
				)}
			</Transition>
		</TransitionGroup>)}
	</Location>;
});
