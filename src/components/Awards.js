import React from 'react';

export default function (props) {
  if (!props.awards) {
    return null;
  }

  return <div className="awards">
		<span className="awards__list">
			{props.awards.join(', ')}
		</span>
  </div>;
}
