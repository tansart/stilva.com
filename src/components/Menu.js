import {h, Component} from 'preact'; // eslint-disable-line no-unused-vars
import cx from 'classnames';

const MENU = [
	{pattern: /^\/$/i, url: '/'},
	{pattern: /^\/lab(\/.+)?/i, url: '/lab'},
	{pattern: /^\/projects(\/.+)?/i, url: '/projects'},
	{pattern: /^\/about/i, url: '/about'},
];

export default class Menu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			url: '',
			mounted: false,
			width: window.innerWidth
		};
	}

	componentDidMount() {
		document.addEventListener('resize', e => {
			this.setState({width: window.innerWidth});
		});

		requestAnimationFrame(_ => {
			this.setState({
				mounted: true
			});
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.url !== nextProps.url
				|| this.state.width !== nextState.width
				|| this.state.mounted !== nextState.mounted;
	}

	componentWillReceiveProps(nextProps) {
		this.setState({prevUrl: this.props.url});
	}

	render({url}, {prevUrl, mounted}) {
		const mobileClassName = cx('menu__mobile', {
			animate: mounted
		});

		const firstKey = this.context.projectList.keys().next().value;

		const divider = <li className="menu__divider"></li>;

		const newIndex = getIndex(url);
		const prevIndex = getIndex(prevUrl);
		const dir = newIndex < prevIndex;

		return <div className="menu__wrapper">
			<ul className="menu" style={{opacity: 1.}}>
				<li className={getClassName(url, dir, isPrev(prevIndex, newIndex, 0), MENU[0])}><a href={MENU[0].url}>home</a></li>
				{divider}
				<li className={getClassName(url, dir, isPrev(prevIndex, newIndex, 1), MENU[1])}><a href={MENU[1].url}>lab</a></li>
				{divider}
				<li className={getClassName(url, dir, isPrev(prevIndex, newIndex, 2), MENU[2])}><a href={`${MENU[2].url}/${firstKey}`}>projects</a></li>
				{divider}
				<li className={getClassName(url, dir, isPrev(prevIndex, newIndex, 3), MENU[3])}><a href={MENU[3].url}>about</a></li>
			</ul>

			<svg viewBox="0 0 30 30"
					 xmlns="http://www.w3.org/2000/svg"
					 width="30px"
					 height="30px"
					 shape-rendering="crispEdges"
					 className={mobileClassName}
			>
				<line x1="0" y1="0" x2="30" y2="0" stroke="black" stroke-width="2" className="menu__line-top"/>
				<line x1="0" y1="0" x2="30" y2="0" stroke="black" stroke-width="2" className="menu__line-bottom"/>
			</svg>
		</div>
	};
}

function isPrev(prevIndex, newIndex, targetIndex) {
	return newIndex !== prevIndex && prevIndex == targetIndex;
}

function getClassName(url, dir, wasPrev, {pattern}) {
	return cx('menu__item', {
		active: !!pattern.exec(url),
		'animate-out': wasPrev,
		reverse: dir
	});
}

function getIndex(url) {
	for (let i = 0; i < MENU.length; i++)
		if (!!MENU[i].pattern.exec(url)) {
			return i;
		}

	return -1;
}
