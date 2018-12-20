import React from 'react';

import BuiltIn from './BuiltIn';
import Awards from './Awards';

export default function(props) {
	return <video controls className="video">
		<source src={props.source} type="video/mp4" />
	</video>
}
