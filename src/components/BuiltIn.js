import React from 'react';

export default function({date}) {
	return date ? <span className="built-in">Built in {date}</span>: null;
}
