import React from 'react';

export default function(props) {
	if(!props.awards) {
		return null;
	}

	return <div className="awards">
		<h2 className="awards__title">Awards /</h2>
		<ul className="awards__list">
			{props.awards.map((a,i) => <li key={`award_${i}`}>{a}</li>)}
		</ul>
	</div>;
}
