import React, {memo, useRef, useEffect} from 'react';

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

  return <code className={`language-${lan}`} ref={node}>{children}</code>
});
