import React, {Component} from 'react';
import Canvas from '../components/Canvas';
import ProjectListItem from '../components/ProjectListItem';
import ProjectListMiddleItem from '../components/ProjectListMiddletem';
import cx from 'classnames';

import {AppContextConsumer} from '../components/AppContext';

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

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show: false,
			projectId: -1
		};

		this.projectHover = this.projectHover.bind(this);
	}

	projectHover(projectId) {
		this.setState({projectId});
	}

	componentWillLeave(cb) {
		setTimeout(cb, 500);
	}

	componentDidMount() {
		requestAnimationFrame(() => {
			this.setState({show: true});
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		const {state, props} = this;
		console.log(this.props, nextProps, this.props == nextProps);
		console.log(this.state, nextState, this.state == nextState);
		return state.show !== nextState.show
				|| state.projectId !== nextState.projectId
				|| props.state !== nextProps.state;
	}

	render() {
		const props = this.props;
		const projectListClassname = cx('project-list', {
			'show': this.state.show
		});

		// const {projectList} = this.context;
		const projectList = PROJECT_LIST;

		let i = 0;
		let list = [];
		const entries = projectList.entries();

		for (let [key, data] of entries) {
			if (i % 3 === 1) {
				list.push(<ProjectListMiddleItem key={`_${i}`} index={i} projectHover={this.projectHover} slug={key} {...data} />);
			} else {
				list.push(<ProjectListItem key={`_${i}`} index={i} projectHover={this.projectHover} slug={key} {...data} />);
			}
			i++;
		}

		return <div className="home">
			<div className={projectListClassname}>
				{list}
			</div>
			{props.state == 'entered' ? <Canvas projectId={this.state.projectId} />: null}
		</div>
	}
}
