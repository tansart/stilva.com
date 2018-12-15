import React, {Component, Fragment, memo} from 'react';
import {Router, Location} from "@reach/router";
import {Transition, TransitionGroup} from "react-transition-group";

import Home from '../pages/Home';
import Client from '../pages/Client';

import PreviousLocationFactory from '../components/PreviousLocation';
import TransitionCanvas from '../components/TransitionCanvas';

const PreviousLocation = PreviousLocationFactory();

export default memo(function App() {
	return <Location>
		{({location}) => (<PreviousLocation location={location}>
			{({location, previousLocation}) => (<Fragment>
				<TransitionCanvas location={location} previousLocation={previousLocation}
													key={location.key}/>
				<TransitionGroup component={null} key="transition-group">
					<Transition key={location.key} timeout={TransitionCanvas.animationTime}>
						{state => (
								<Router location={location} key={location.pathname}>
									<Home path="/" type="home" transitionState={state}/>
									<Client path="/client/:clientId" type="client" transitionState={state}/>
								</Router>
						)}
					</Transition>
				</TransitionGroup>
			</Fragment>)}
		</PreviousLocation>)}
	</Location>;
});
