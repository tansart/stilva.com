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
			prevX: null,
			deltaX: null,
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
			prevX: clientX,
			initX: clientX
		});
	}

	move(e) {
		const {clientX} = getEvent(e);

		this.setState({
			isActive: STATUS_IS_SWIPING,
			prevX: clientX,
			deltaX: this.state.prevX - clientX
		});
	}

	end(e) {
		const {clientX} = getEvent(e);

		this.setState({
			isActive: STATUS_IS_BUSY,
			deltaX: Math.sign(this.state.prevX - this.state.initX) * Math.max(1, Math.abs(this.state.prevX - this.state.initX)/25)
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

		return <div className="project" {...mouseEvents}>
			<ProjectCanvas deltaX={this.state.deltaX/1000} />
			<img src={"/dist/abstract-q-c-640-480-6.jpg"} style={{position: 'absolute', width: '80%', zIndex: 0}} />
		</div>
	}
}

function getEvent(e) {
	return e['changedTouches'] ? e.changedTouches[0]: e;
}
