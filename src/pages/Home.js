import {h, Component} from 'preact'; // eslint-disable-line no-unused-vars
import cx from 'classnames';

import ProjectListItem from '../components/ProjectListItem';
import ProjectListMiddleItem from '../components/ProjectListMiddletem';

export default class Home extends Component{
	constructor(props) {
		super(props);

		this.state = {
			show: false
		};
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

		return <div className={projectListClassname}>
			{[1,2,3,4,5,6,7,8,9,10].map((_, i) => i%3 === 1 ? <ProjectListMiddleItem index={i} />: <ProjectListItem index={i} />)}
		</div>;
	}
}
