import React from 'react';

export default function(props) {
	return <div className="blob">
		<h2 className="blob__title">{props.title} /</h2>
		{props.content.map((t, i) => <p key={`${props.title}_${i}`}>{t}</p>)}
	</div>
}
