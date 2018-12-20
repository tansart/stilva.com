import React from 'react';

import Awards from './Awards';

export default function(props) {
	const buildIn = props.date ? <span className="built-in"> {props.date}</span>: null;
	return <div className="blob">
		<h2 className="blob__title">{props.title} /{buildIn}</h2>
		{props.content.map((t, i) => <p key={`${props.title}_${i}`}>{t}</p>)}
		<Awards awards={props.awards} />
	</div>
}
