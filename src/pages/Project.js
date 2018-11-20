import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
import {navigate} from '@reach/router';

import {getPrevNext, isProject} from '../utils/menu';
import {projectList} from '../data';

import ProjectCanvas from '../components/ProjectCanvas';

const STATUS_IS_IDLE = 0;
const STATUS_IS_SWIPING = 1;

export default class Project extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show: false,
			leave: false,
			isActive: STATUS_IS_IDLE,
			currentX: 0,
			clientWidth: 1
		};

		this.end = this.end.bind(this);
		this.init = this.init.bind(this);
		this.move = this.move.bind(this);
	}

	init(e) {
		e.preventDefault();

		const {clientX} = getEvent(e);

		this.setState({
			isActive: STATUS_IS_SWIPING,
			initX: clientX,
			currentX: clientX,
			clientWidth: this.node.clientWidth
		});
	}

	move(e) {
		const {clientX} = getEvent(e);

		if (this.state.isActive !== STATUS_IS_SWIPING) {
			return;
		}

		this.setState({
			isActive: STATUS_IS_SWIPING,
			currentX: clientX,
		});
	}

	end(e) {
		this.setState({
			isActive: STATUS_IS_IDLE,
		});
	}

	componentDidUpdate(prevProps) {
		if (this.props.projectId != prevProps.projectId) {
			this.setState({
				leave: false,
				isActive: STATUS_IS_IDLE,
				currentX: 0
			});
		}
	}

	componentDidMount() {
		const {location, prevLocation} = this.props;

		if(!prevLocation || (isProject(location.pathname) && isProject(prevLocation.pathname))) {
			return this.setState({show: true});
		}

		setTimeout(_ => this.setState({show: true}), 250);
	}

	render() {
		const mouseEvents = {
			onMouseDown: this.init,
			onTouchStart: this.init,

			onMouseUp: this.end,
			onTouchCancel: this.end,
			onTouchEnd: this.end,
		};

		if (this.state.isActive === STATUS_IS_SWIPING) {
			mouseEvents['onTouchMove'] = this.move;
			mouseEvents['onMouseMove'] = this.move;
		}

		let dist = this.state.isActive !== STATUS_IS_IDLE ? (this.state.initX - this.state.currentX) / this.state.clientWidth : 0;
		if (Math.abs(dist) > .35) {
			dist = Math.sign(dist);
		}

		if (Math.abs(dist) == 1 && !this.state.leave) {
			this.setState({
				leave: true
			}, _ => {
				const [prev, curr, next] = getPrevNext(projectList, this.props.projectId);
				navigate(`/project/${dist < 0 ? prev[0]: next[0]}`);
			});
		}

		return <div className="project" style={{transform: `translateX(${this.state.show ? 0: -100}%)`}} {...mouseEvents} ref={el => this.node = el} key={`key_${this.props.projectId}`}>
			<div className="project__canvas-wrapper">
				<ProjectCanvas dist={dist} projectId={this.props.projectId} key={`key_canvas_${this.props.projectId}`}
											 projectList={projectList} getPrevNext={getPrevNext}/>
				<img src={projectList.get(this.props.projectId).heroImage}
						 style={{position: 'absolute', width: '80%', zIndex: 0}}/>
			</div>
			<div className="project__title">
				<Title dist={dist}>{projectList.get(this.props.projectId).projectName}</Title>
			</div>
		</div>
	}
}

function Title({dist, children}) {
	return <div className="project__title-word">
		<span
				className="project__title-overlay"
				style={{opacity: 1, transform: `translate3d(${Math.sign(dist) * easeOut(Math.abs(dist)) * -100}%, 0, 0)`}}
		>{children}</span>
		{children}
	</div>;
}

function easeOut(k) {
	return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
}

function getEvent(e) {
	return e['changedTouches'] ? e.changedTouches[0] : e;
}
