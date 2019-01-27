import React, {useState, useEffect} from 'react';
import {Router, Location} from "@reach/router";
import {Transition, TransitionGroup} from "react-transition-group";

import Home from '../pages/Home';
import Client from '../pages/Client';
import Lab from '../pages/Lab';

export default function App() {

	const [scrollY, setScrollY] = useState(0);

	const onScroll = _ => setScrollY(window.scrollY);

	const onEnter = _ => {
		setScrollY(scrollY);
		window.scrollTo(0,0);
	};

	useEffect(_ => {
		document.addEventListener('scroll', onScroll);

		return function cleanup() {
			document.removeEventListener('scroll', onScroll);
		}
	}, []);

	return <Location>
		{({location}) => (<TransitionGroup component={null} key="transition-group">
			<Transition key={location.key} timeout={875} onEnter={onEnter}>
				{state => (
						<Router location={location} key={location.pathname}>
							<Home path="/" type="home" transitionState={state} scrollY={scrollY}/>
							<Client path="/client/:clientId" type="client" transitionState={state} scrollY={scrollY}/>
							<Lab path="/lab" type="lab" transitionState={state} scrollY={scrollY}/>
						</Router>
				)}
			</Transition>
		</TransitionGroup>)}
	</Location>;
}
