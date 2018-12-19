import React, {Component} from 'react';
import cx from 'classnames';

import Greetings from '../components/Greetings';
import AnimatedLink from '../components/AnimatedLink';

import clients from '../clients';

export default class Home extends Component {

	constructor(props) {
		super(props);
	}

	getClientList(clients) {
		return Array.from(clients)
				.reduce((acc, [key, data], i, original) => {

					acc.push(<AnimatedLink link={`client/${key}`} label={data.label} key={`client_list_${key}`} />);

					if(i + 1 < original.length) {
						acc.push(i + 2 === original.length ? ', and ': ', ');
					}

					return acc;
				}, [])
	}

	render() {
		return <div className={cx('home', 'page', `page--${this.props.transitionState}`)}>
			<div className="content">
				<p>
					<Greetings /><br/>
					I'm <AnimatedLink link="https://github.com/stilva" label="Thomas" target="_blank" />,
					a principal developer currently working at <AnimatedLink link="https://bit.ly/2Mm1IYx" label="Firstborn" rel="nofollow" target="_blank" />,
					New York.
				</p>
				<p>
					My day job involves creating pixel perfect, and delightful UIs for clients,
					such as {this.getClientList(clients)}.
				</p>
				<p>
					At home, I spend my time actively exploring Machine Learning (tensorflow/Python), with my pug Nugget on my laps.
				</p>
				<p>
					Always down to chat over a drink.
				</p>
			</div>
		</div>
	}
}
