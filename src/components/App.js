import React, {createContext, Component, Fragment} from 'react';
import {Router, Link, Location} from "@reach/router";
import {Transition, TransitionGroup} from "react-transition-group";

import {AppContextConsumer, AppContextProvider} from "./AppContext";

import Home from '../pages/Home';
import About from '../pages/About';

import PROJECT_LIST from '../projectList'

import TransitionMask from './TransitionMask';

function getProps({isCurrent}) {
	return isCurrent ? {style: {pointerEvents: 'none'}} : null;
}

let Menu = _ => <AppContextConsumer>
	{({projectList}) => <nav style={{position: 'absolute', zIndex: 3, display: 'block', background: 'white'}}>
		<Link to="/" getProps={getProps}>Home</Link>
		<Link to={`/project/${projectList.keys().next().value}`} getProps={getProps}>Projects</Link>
		<Link to="/lab" getProps={getProps}>Lab</Link>
		<Link to="/about" getProps={getProps}>About</Link>
	</nav>}
</AppContextConsumer>;

const style = {
	display: 'block',
	position: 'absolute',
	height: '100vh',
	top: 0,
	left: 0,
	width: '100vw'
};

const context = {
	projectList: PROJECT_LIST,
	getPrevNext: (projectList, projectId) => {
		const keys = Array.from(projectList.keys());
		const entries = Array.from(projectList.entries());
		const index = keys.indexOf(projectId);

		const prevIndex = index - 1 < 0 ? keys.length - 1 : index - 1;
		const nextIndex = (index + 1) % keys.length;

		return [entries[prevIndex], entries[index], entries[nextIndex]];
	}
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
			transform: `translateX(${this.state.show ? 0: -100}%)`,
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

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <AppContextProvider value={context}>
			<Menu/>
			<TransitionRouter/>
		</AppContextProvider>
	}
}

class TransitionRouter extends Component {
	shouldComponentUpdate(nextProps) {
		console.log(this.props, nextProps);
		return true;
	}

	render() {
		return <Location>
			{({location}) => (
					<TransitionGroup component={null}>
						<Transition key={location.key} timeout={500}>
							{state => (
									<Fragment>
										<TransitionMask location={location} state={state}/>
										<Router location={location} key={location.pathname}>
											<Home path="/" type="home" state={state}/>
											<Page path="/project/:projectSlug" type="project" state={state}/>
											<Page path="/lab" type="lab" state={state}/>
											<About path="/about" type="about" state={state}/>
										</Router>
									</Fragment>
							)}
						</Transition>
					</TransitionGroup>
			)}
		</Location>;
	}
}
