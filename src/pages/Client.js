import React, {Component, createElement} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import clientComponents from '../utils/clientComponents';
import clients from '../clients';

export default class Project extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const data = clients.get(this.props.clientId);

		return <div className={cx('client', 'page', `page--${this.props.transitionState}`)}>
			<div className="content">
				<h1 className="client-name">{data.label}</h1>
				{data.content.map((data, i) => {
					const props = {key: `content_${i}`, ...data};
					return createElement(clientComponents[data.type], props);
				})}
			</div>
		</div>
	}
}
