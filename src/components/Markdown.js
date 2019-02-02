import React from 'react';
import Markdown from '@stilva/markdown';

export default function ({content: data, index}) {
  return <Markdown className="markdown" data={data} cacheid={isDev() ? '' : `markdown_${index}`}/>;
}

function isDev() {
  typeof __DEV__ === 'boolean' ? __DEV__ : false;
}
