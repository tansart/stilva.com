import React, {Component} from 'react';
import {Router, Location} from "@reach/router";
import {Transition, TransitionGroup} from "react-transition-group";

import Home from '../pages/Home';
import Client from '../pages/Client';

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			scrollY: 0
		}
	}

	componentDidMount() {
		document.addEventListener('scroll', this.onScroll);
	}

	componentWillUnmount() {
		document.removeEventListener('scroll', this.onScroll);
	}

	onScroll = _ => {
		this.scrollY = window.scrollY;
	}

	onEnter = _ => {
		this.setState({scrollY: this.scrollY});
		window.scrollTo(0,0);
	}

	render() {
		return <Location>
			{({location}) => (<TransitionGroup component={null} key="transition-group">
				<Transition key={location.key} timeout={875} onEnter={this.onEnter}>
					{state => (
							<Router location={location} key={location.pathname}>
								<Home path="/" type="home" transitionState={state} scrollY={this.state.scrollY}/>
								<Client path="/client/:clientId" type="client" transitionState={state} scrollY={this.state.scrollY}/>
							</Router>
					)}
				</Transition>
			</TransitionGroup>)}
		</Location>;
	}
}
