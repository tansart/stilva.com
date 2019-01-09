import React, {memo} from 'react';
import Prism from 'prismjs';

export default memo(function Code(props) {
	var __html = Prism.highlight(props.content, Prism.languages.javascript, 'javascript');
	return <code dangerouslySetInnerHTML={{__html}} />;
})
