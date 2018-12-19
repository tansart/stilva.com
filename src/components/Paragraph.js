import React from 'react';

import BuiltIn from './BuiltIn';
import Awards from './Awards';

export default function(props) {
	return <div className="blob">
		<h2 className="blob__title">{props.title} /</h2>
		<BuiltIn date={props.date} />
		<Awards awards={props.awards} />
		{props.content.map((t, i) => <p key={`${props.title}_${i}`}>{t}</p>)}
	</div>
}
