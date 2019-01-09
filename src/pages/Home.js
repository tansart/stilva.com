import React, {memo} from 'react';
import cx from 'classnames';

import Greetings from '../components/Greetings';
import AnimatedLink from '../components/AnimatedLink';

import clients from '../clients';

export default (function Home(props) {
	const scrollY = props.transitionState === 'exiting' ? props.scrollY : 0;
	return <div className={cx('home', 'page', `page--${props.transitionState}`)} style={{top: `-${scrollY}px`}}>
		<div className="content">
			<p>
				<Greetings/><br/>
				I'm <AnimatedLink link="https://github.com/stilva" label="Thomas" target="_blank"/>,
				a principal developer currently working at <AnimatedLink link="https://bit.ly/2Mm1IYx" label="Firstborn"
																																 rel="nofollow" target="_blank"/>,
				New York.
			</p>
			<p>
				My day job involves creating pixel perfect, and delightful UIs for clients,
				such as {getClientList(clients)}
			</p>
			<p>
				At home, I spend my time actively exploring Machine Learning (tensorflow/Python), with my pug Nugget on my laps.
				Check out my <AnimatedLink link="lab" label="Lab" key="lab" />.
			</p>
			<p>
				Always down for a <AnimatedLink onClick={onContact} label="chat" rel="nofollow"/> over a drink.
			</p>
		</div>
	</div>
});

function onContact(e) {
	e.preventDefault();

	location.href = `mailto:${atob('dGhvbWFzLmFuc2FydEA=')}${atob('c3RpbHZhLmNvbQ==')}`;
}

function getClientList(clients) {
	return Array.from(clients)
			.reduce((acc, [key, data], i, original) => {

				acc.push(<AnimatedLink link={`client/${key}`} label={data.label} key={`client_list_${key}`}/>);

				if (i + 1 < original.length) {
					acc.push(i + 2 === original.length ? ', and ' : ', ');
				}

				return acc;
			}, [])
}
