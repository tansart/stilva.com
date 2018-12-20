import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import clientComponents from '../utils/clientComponents';
import clients from '../clients';

export default (function Project(props) {
	const data = clients.get(props.clientId);

	const scrollY = props.transitionState === 'exiting' ? props.scrollY : 0;
	return <div
			className={cx('client', 'page', `page--${props.transitionState}`)}
			style={{top: `-${scrollY}px`}}
	>
		<div className="content">
			<h1 className="client-name">{data.label}</h1>
			{data.content.map((data, i) => {
				const props = {key: `content_${i}`, ...data};
				return createElement(clientComponents[data.type], props);
			})}
		</div>
	</div>
});
