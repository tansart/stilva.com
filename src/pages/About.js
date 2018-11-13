import {h, Component} from 'preact'; // eslint-disable-line no-unused-vars

export default class About extends Component {
	constructor(props) {
		super(props);

		this.onHover = this.onHover.bind(this);

		this.state = {
			mounted: false
		};
	}

	componentDidMount() {
		this.setState({
			mounted: true
		});
	}

	onHover() {}

	render() {
		return <span></span>
	}
}
