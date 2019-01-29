import React, {memo, useEffect} from 'react';

import Greetings from '../components/Greetings';
import AnimatedLink from '../components/AnimatedLink';

import useOnScroll from '../hooks/useOnScroll';

import clients from '../clients';

export default memo(function Home(props) {
	const scrollY = useOnScroll(props.transitionState, props.locationKey);

	useEffect(_ => {
		const html = document.querySelector('html');
		html.style.background = '#000';

		return function clean() {
			html.style.background = '';
		}
	}, []);

	return <div className="home" style={{transform: `translate3d(0,-${scrollY}px,0)`}}>
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
				Check out my <AnimatedLink link="lab" label="Lab" key="lab"/>.
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
