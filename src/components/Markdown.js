import React, {memo, useRef, useEffect, Fragment} from 'react';
import Markdown from '@stilva/markdown';

export default memo(function ({content: data, index}) {

  const mRef = useRef(null);

  useEffect(function () {
    const node = mRef.current.nextSibling.querySelector('[class*=language]');

    if(!node) return;

    import(/* webpackChunkName: "prismjs" */ /* webpackMode: "lazy" */ 'prismjs').then(({default:prism}) => {
      prism.highlightElement(node, false);
    })
  }, []);

  return <Fragment>
    <span ref={mRef}></span>
    <Markdown
      className="markdown"
      data={data}
      cacheid={isDev() ? null : `markdown_${index}`}
    />
  </Fragment>
})

function isDev() {
  return typeof __DEV__ === 'boolean' ? __DEV__ : false;
}
