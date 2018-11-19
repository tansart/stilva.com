import React, {Component} from 'react';
import Canvas from '../components/Canvas';
import ProjectListItem from '../components/ProjectListItem';
import ProjectListMiddleItem from '../components/ProjectListMiddletem';
import cx from 'classnames';

import {AppContextConsumer} from '../components/AppContext';

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

	componentDidMount() {
		setTimeout(_ => this.setState({show: true}), 250)
	}

	shouldComponentUpdate(nextProps, nextState) {
		const {state, props} = this;
		return state.show !== nextState.show
				|| state.projectId !== nextState.projectId
				|| props.state !== nextProps.state;
	}

	projectList(projectList) {
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

		return list;
	}

	render() {
		const props = this.props;
		const projectListClassname = cx('project-list', {
			'show': this.state.show
		});

		return <AppContextConsumer>
			{({projectList}) => (<div className="home">
				<div className={projectListClassname}>
					{this.projectList(projectList)}
				</div>
				{props.state == 'entered' ? <Canvas projectId={this.state.projectId} />: null}
			</div>)}
		</AppContextConsumer>
	}
}
