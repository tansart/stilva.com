import React, {memo, useRef, useEffect} from 'react';
import {css, cx} from 'linaria';

const code = css`
  background: transparent !important;
  display: block;
  font-size: 12px !important;
  line-height: 1.75 !important;
  white-space: pre-wrap !important;
  
  .token.operator {
    background: transparent;
  }
`;

export default memo(function ({children, lan}) {
  const node = useRef(null);

  useEffect(function () {
    if(!node.current) return;

    import(/* webpackChunkName: "prismjs" */ /* webpackMode: "lazy" */ 'prismjs')
      .then(() => import(/* webpackChunkName: "prismjs-jsx" */ /* webpackMode: "lazy" */ 'prismjs/components/prism-jsx'))
      .then(() => {
        Prism.highlightElement(node.current, false);
      });
  }, [children]);

  return <code className={cx(`language-${lan}`, code)} ref={node}>{children}</code>
});
