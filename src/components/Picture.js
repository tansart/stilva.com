import React from 'react';

export default function(props) {
	return <picture className={"picture"}>
		{props.urls.map(([type, url], index) => {
			return type !== 'preview'
					? <source srcSet={url.map((u,i) => `${u} ${i+1}x`).join(', ')} media={`(min-width: ${type}px)`} key={`img_${index}`} />
					: <img src={url} alt={props.title} key={`img_${index}`} />
		})}
	</picture>
}

function get() {

}
