import {h, Component} from 'preact'; // eslint-disable-line no-unused-vars
import cx from 'classnames';

import Canvas from '../components/Canvas';
import ProjectListItem from '../components/ProjectListItem';
import ProjectListMiddleItem from '../components/ProjectListMiddletem';

export default class Home extends Component{
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
		setTimeout(() => {
			this.setState({show: true});
		}, 1000);
	}

	render() {
		const projectListClassname = cx('project-list', {
			'show': this.state.show
		});

		const {projectList} = this.context;

		let i = 0;
		let list = [];
		const entries = projectList.entries();

		for (let [key, data] of entries) {
			if(i%3 === 1) {
				list.push(<ProjectListMiddleItem index={i} projectHover={this.projectHover} slug={key} {...data} />);
			} else {
				list.push(<ProjectListItem index={i} projectHover={this.projectHover} slug={key} {...data} />);
			}
			i++;
		}

		return <div>
			<div className={projectListClassname}>
				{list}
			</div>
			<Canvas projectId={this.state.projectId} />
		</div>
	}
}
