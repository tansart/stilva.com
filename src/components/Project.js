import {h, Component} from 'preact'; // eslint-disable-line no-unused-vars

import ProjectCanvas from './ProjectCanvas';

const STATUS_IS_IDLE = 0;
const STATUS_IS_SWIPING = 1;
const STATUS_IS_BUSY = 2;

export default class Project extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isActive: STATUS_IS_IDLE,
			currentX: 0,
			clientWidth: 0
		};

		this.end = this.end.bind(this);
		this.init = this.init.bind(this);
		this.move = this.move.bind(this);
	}

	init(e) {
		e.preventDefault();

		if(this.state.isActive === STATUS_IS_BUSY) {
			return false;
		}

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

		this.setState({
			isActive: STATUS_IS_SWIPING,
			currentX: clientX
		});
	}

	end(e) {
		const {clientX} = getEvent(e);

		this.setState({
			isActive: STATUS_IS_BUSY,
		});

		setTimeout(_ => {
			this.setState({
				isActive: STATUS_IS_IDLE
			});
		});
	}

	render() {
		const mouseEvents = {
			onMouseDown: this.init,
			onTouchStart: this.init,

			onMouseUp: this.end,
			onTouchCancel: this.end,
			onTouchEnd: this.end,
		};

		if(this.state.isActive === STATUS_IS_SWIPING) {
			mouseEvents['onTouchMove'] = this.move;
			mouseEvents['onMouseMove'] = this.move;
		}

		let dist = this.state.isActive !== STATUS_IS_IDLE ? (this.state.initX - this.state.currentX)/this.state.clientWidth: 0;
		if(Math.abs(dist) > .35) {
			dist = Math.sign(dist);
		}

		return <div className="project" {...mouseEvents} ref={el => this.node = el}>
			<ProjectCanvas dist={dist} />
			<img src={"/dist/abstract-q-c-640-480-6.jpg"} style={{position: 'absolute', width: '80%', zIndex: 0}} />
		</div>
	}
}

function getEvent(e) {
	return e['changedTouches'] ? e.changedTouches[0]: e;
}
