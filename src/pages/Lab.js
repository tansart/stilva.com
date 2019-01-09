import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import clientComponents from '../utils/clientComponents';
import data from '../lab';

import BackButton from '../components/BackButton';

export default memo(function Lab(props) {
	const scrollY = props.transitionState === 'exiting' ? props.scrollY : 0;
	return <div
			className={cx('client', 'lab', 'page', `page--${props.transitionState}`)}
			style={{top: `-${scrollY}px`}}
	>
		<BackButton/>

		<div className="content">
			<h1 className="client-name">Lab</h1>
			{data.map((data, i) => {
				const props = {key: `content_${i}`, ...data};
				return createElement(clientComponents[data.type], props);
			})}
		</div>
	</div>
});
