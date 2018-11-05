import {h, Component} from 'preact'; // eslint-disable-line no-unused-vars

export default class Menu extends Component {
	render(props) {
		return <ul className="menu" style={{opacity:0.}} >
			<li><a href="/">home</a></li>
			<li className="menu__divider"></li>
			<li><a href="/">lab</a></li>
			<li className="menu__divider"></li>
			<li><a href="/about">about</a></li>
		</ul>
	};
}
