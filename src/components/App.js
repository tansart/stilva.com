import React, {Component, memo, Fragment} from 'react';
import {Router, Location} from "@reach/router";
import {Transition, TransitionGroup} from "react-transition-group";

import Home from '../pages/Home';
import Project from '../pages/Project';
import About from '../pages/About';

import Menu from './Menu';
import TransitionMask from './TransitionMask';

import {getIndex} from '../utils/menu';

const style = {
	display: 'block',
	position: 'absolute',
	height: '100vh',
	top: 0,
	left: 0,
	width: '100vw'
};

class Page extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show: false
		};
	}

	componentDidMount() {
		setTimeout(_ => {
			this.setState({show: true})
		}, 250);
	}

	render() {
		const props = this.props;
		const colors = {
			project: 'red',
			lab: 'yellow',
			about: 'green'
		};

		return <div style={Object.assign({}, style, {
			background: colors[props.type],
			transform: `translateX(${this.state.show ? 0 : -100}%)`,
			zIndex: props.state == 'entering' || props.state == 'entered' ? 1 : 0
		})}>
			<h1 style={{color: 'white', paddingTop: '100px', zIndex: 1, display: 'block', position: 'relative'}}>
				{Date.now()} {props.type} {props.state}
			</h1>
			<div>
				<h1>hi</h1>
				<h1>hi</h1>
				<h1>hi</h1>
				<h1>hi</h1>
			</div>
			{props.type}
		</div>
	}
}

class LocationTracker extends Component {
	constructor(props) {
		super(props);

		this.prevLocation = null;
	}

	componentDidMount() {
		this.prevLocation = this.props.location;
	}

	componentDidUpdate() {
		this.prevLocation = this.props.location;
	}

	render() {
		return this.props.children(this.props.location, this.prevLocation);
	}
}

export default memo(function App() {
	return <Location>
		{({location}) => (<LocationTracker location={location}>
			{(location, prevLocation) => [<Menu key="menu" url={location.pathname} />,
				<TransitionGroup component={null} key="transition-group" >
					<Transition key={`transition-${getIndex(location.pathname)}`} timeout={500}>
						{state => (
								<Fragment>
									<TransitionMask location={location} prevLocation={prevLocation} state={state}/>
									<Router location={location} key={location.pathname}>
										<Home path="/" type="home" state={state}/>
										<Project path="/project/:projectId" type="project" prevLocation={prevLocation} state={state}/>
										<Page path="/lab" type="lab" state={state}/>
										<About path="/about" type="about" state={state}/>
									</Router>
								</Fragment>
						)}
					</Transition>
				</TransitionGroup>]}
		</LocationTracker>)}
	</Location>;
});
