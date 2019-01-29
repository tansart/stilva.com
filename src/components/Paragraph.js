import React from 'react';

import Awards from './Awards';

export default function (props) {
	const builtIn = props.date ? <span className="built-in"> {props.date}</span> : null;
	const title = (props.title || builtIn) ? <h2 className="blob__title">{props.title} /{builtIn}</h2> : null;
	return <div className="blob">
		{title}
		{props.content.map((t, i) => <p key={`${props.title}_${i}`}>{t}</p>)}
		<Awards awards={props.awards}/>
	</div>
}
