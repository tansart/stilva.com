import React from 'react';
import Markdown from '@stilva/markdown';

export default function({cacheid, content : data}) {

	return <Markdown className="markdown" {...{data, cacheid}} />;
}
