/* eslint-disable no-unused-vars */
import Router from 'preact-router';
import {h, Component} from 'preact';
import cx from 'classnames';
/* eslint-enable no-unused-vars */
import Transition from 'preact-transition-group';

class ProjectListItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			reveal: false
		};
	}

	componentDidMount() {
		this.node.addEventListener('transitionend', _ => {
			this.setState({reveal: true})
		})
	}

	render(props) {
		const moduloIndex = (props.index + 2)%3;
		const span = <span className="project-list__bar"></span>;
		const title = <span className="project-list__title">QWERTY</span>;

		const projectListClassname = cx('project-list__wrap', {
			'right': moduloIndex === 2,
			'left': moduloIndex === 1,
			'reveal': this.state.reveal
		});

		return <a className={projectListClassname} style={{transitionDelay: `${props.index * 250}ms`}} ref={el => this.node = el}>
			{moduloIndex === 2 ? span: null}
			{title}
			{moduloIndex === 1 ? span: null}
		</a>;
	}
}

class ProjectListMiddleItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			phase: 0
		};
	}

	componentDidMount() {
		this.node.addEventListener('transitionend', _ => this.setState({phase: this.state.phase + 1}));
		setTimeout(_ => this.setState({phase:1}));
	}

	render(props) {
		const span = <span className="project-list__bar"></span>;
		const title = <span className="project-list__title">QWERTY</span>;

		const projectListClassname = cx('project-list__wrap', 'middle', {
			'phase--one': this.state.phase > 0,
			'phase--two': this.state.phase > 1,
			'phase--three': this.state.phase > 2
		});

		return <a className={projectListClassname} style={{transitionDelay: `${props.index * 250}ms`}} ref={el => this.node = el}>
			{span}
			{title}
			{span}
		</a>;
	}
}

class Home extends Component{
	constructor(props) {
		super(props);

		this.state = {
			show: false
		};
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

function About() {
  return <h1>About</h1>
}

function Search() {
  return <h1>Search</h1>
}

export default class App extends Component {
  constructor(props) {
    super(props);

    const data = props.data ? props.data : {};

    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return <Router>
			<Home path="/folio/" />
			<About path="/folio/about" />
			<Search path="/folio/search/:query?/:advanced?" />
		</Router>
  }
}
