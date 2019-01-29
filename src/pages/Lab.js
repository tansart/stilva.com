import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import useOnScroll from '../hooks/useOnScroll';

import clientComponents from '../utils/clientComponents';
import data from '../lab';

import BackButton from '../components/BackButton';

export default memo(function Lab(props) {
	const scrollY = useOnScroll(props.transitionState, props.locationKey);

	return <div
			className={cx('client', 'lab')}
			style={{transform: `translate3d(0,-${scrollY}px,0)`}}
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
