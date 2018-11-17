import React, {createContext, Component, Children} from 'react';
import {Router, Link, Location} from "@reach/router";
import {Transition, TransitionGroup} from "react-transition-group";

import {AppContextConsumer, AppContextProvider} from "./AppContext";

import Home from '../pages/Home';
import About from '../pages/About';

import SVGMask from './SVGMask';

const PROJECT_LIST = new Map([
	[
		'slug-0',
		{
			projectName: "hello hi bye",
			heroImage: "/dist/abstract-q-c-640-480-6.jpg"
		}
	],
	[
		'slug-1',
		{
			projectName: "hello hi bye 7",
			heroImage: "/dist/abstract-q-c-640-480-7.jpg"
		}
	],
	[
		'slug-2',
		{
			projectName: "hello hi bye 8",
			heroImage: "/dist/abstract-q-c-640-480-8.jpg"
		}
	],
	[
		'slug-3',
		{
			projectName: "hello hi bye 9",
			heroImage: "/dist/abstract-q-c-640-480-9.jpg"
		}
	],
	[
		'slug-4',
		{
			projectName: "hello hi bye 21",
			heroImage: "/dist/abstract-q-c-640-480-6.jpg"
		}
	],
	[
		'slug-5',
		{
			projectName: "hello hi bye 22",
			heroImage: "/dist/abstract-q-c-640-480-7.jpg"
		}
	],
	[
		'slug-6',
		{
			projectName: "hello hi bye 23",
			heroImage: "/dist/abstract-q-c-640-480-8.jpg"
		}
	],
	[
		'slug-7',
		{
			projectName: "hello hi bye 24",
			heroImage: "/dist/abstract-q-c-640-480-9.jpg"
		}
	],
]);

function getProps({isCurrent}) {
	return isCurrent ? {style: {pointerEvents: 'none'}} : null;
}

let Menu = () => (
		<nav style={{position: 'absolute', zIndex: 2, display: 'block', background: 'white'}}>
			<Link to="/" getProps={getProps}>Home</Link>
			<Link to={`/project/${PROJECT_LIST.keys().next().value}`} getProps={getProps}>Projects</Link>
			<Link to="/lab" getProps={getProps}>Lab</Link>
			<Link to="/about" getProps={getProps}>About</Link>
		</nav>
);

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
	render() {
		const props = this.props;
		const colors = {
			project: 'red',
			lab: 'yellow',
			about: 'green'
		};

		return <div style={Object.assign({}, style, {
			background: colors[props.type],
			zIndex: props.state == 'entering' || props.state == 'entered' ? 1 : 0
		}, props.state == 'entering' ? {clipPath: `url(#my${props.type})`} : null)}>
			<SVGMask type={props.type} state={props.state}/>
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
			<TransitionRouter />
		</AppContextProvider>
	}
}

class TransitionRouter extends Component {
	shouldComponentUpdate(nextProps) {
		console.log(this.props, nextProps);
		return true;
	}

	render() {
		const children = this.props.children;

		return <Location>
			{({location}) => (
					<TransitionGroup component={null}>
						<Transition key={location.key} timeout={1000}>
							{state => (
									<Router location={location} key={location.pathname}>
										<Home path="/" type="home" state={state} />
										<Page path="/project/:projectSlug" type="project" state={state} />
										<Page path="/lab" type="lab" state={state} />
										<About path="/about" type="about" state={state} />
									</Router>
							)}
						</Transition>
					</TransitionGroup>
			)}
		</Location>;
	}
}
