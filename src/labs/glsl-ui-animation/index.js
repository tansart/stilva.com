import React, { useEffect, useRef, useState } from 'react';

import css from './css';

export default {
  link: 'glsl-ui-animation',
  title: `GLSL UI animation`,
  date: `May 2020`,
  categories: 'web',
  content: [
    {
      type: 'FunctionalComponent',
      css,
      component: function(props) {
        const [component, setComponent] = useState(null);

        useEffect(() => {
          import(/* webpackChunkName: "lab/glsl-ui-animation" */ /* webpackMode: "lazy" */ './App.js').then((mComponent) => {
            setComponent(mComponent);
          });
        }, []);

        if(!component) {

          return <>
            <div className="preloading" />
            <div className="preloading--white" />
          </>;
        }

        return React.createElement(component.default, props);
      }
    },
    {
      type: 'Markdown',
      content: `The two modules above are **prototypes** for one of my side project that I've been tinkering with. To build them, I've used both \`@stilva/spring\` and \`@stilva/glsls\`, and I thought I'd write a post about some of my findings:

- The changes that came out while using the libraries I've written in the past (dogfooding some of my own APIs)
- About using the DOM as a texture in GLSL (a technique my ex-colleagues at firstborn used back in 2017)`
    },
    {
      type: 'Paragraph',
      title: '@stilva/Spring',
      content: []
    },
    {
      type: 'Markdown',
      content: `One of my goal for this library was to get a lightweight and composable component with spring physics. It's been a great tool so far – most likely because the API is the same as \`react-spring\`.
For the module above, I wanted the transitions from the projects overview (the white-ish grids) to a specific project (the one with the model, text and the glitch effects) with a heavy ease-in: something I haven't been able to do only with spring.
So, I've made a quick patch for the library to support \`duration\` and \`easing\`.

*Note*: \`easing\` expects a function that accepts one argument \`t ∈ {0, 1}\` where \`easing(t) ∈ {0, 1}\`.

\`\`\`jsx
const [animProps, setAnimProps] = useSpring({ x: 0}, {
  duration: 750,
  easing: t => t === 1 ? 1 : 1 - Math.pow(2, - 10 * t) // Expo.easeOut from tween.js
});

\`\`\`

One of my next step is a minor refactoring, to encapsulate some of the logic and hopefully make the frameLoop more efficient.`
    },
    {
      type: 'Paragraph',
      title: '@stilva/glsl',
      content: []
    },
    {
      type: 'Markdown',
      content: `I found a bug, then made a quick fix on this library – you weren't able to update a texture once the fragment shader was compiled. I've fixed this, and added the ability to pass in a blob as a texture (I've yet to determine if this is a good idea). 

This leads me to this new Component I've written:

\`\`\`jsx
function Canvas({children}) {
  const node = useRef();
  const childrenWrapper = useRef();

  useEffect(() => {
    const glsl = new GLSL(node.current);
    const image = new Image();
    image.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    
    const uImage = glsl.addTexture('u_image', image);
    pCreateDOMTextureBlob(uImage, content => {
      return \` &lt;svg width = "800" height = "500" xmlns = "http://www.w3.org/2000/svg" &gt;
        &lt;foreignObject x = "0" y = "0" width = "800" height = "500" &gt;
          &lt;div xmlns = "http://www.w3.org/1999/xhtml" &gt;
          \$\{content\}
          &lt;/div&gt;
        &lt;/foreignObject&gt;
      &lt;/svg&gt;\`
    });
    // ... glsl.fragment\`\` call here
    glsl.render();

    return () => {
      glsl.kill();
    }
  }, []);

  return &lt;&gt;
    &lt;canvas
      className="canvas"
      height="500"
      width="800"
      ref={node}
    /&gt;
      &lt;div
        className="glsl__content"
        ref={childrenWrapper}
      &gt;
        {children}
      &lt;/div&gt;
  &lt;/&gt;
}
\`\`\`

You can then use this \`&lt;Canvas /&gt;\` Component like so:

\`\`\`jsx
&lt;Canvas&gt;
  &lt;span className="styled-dom-text" &gt;
    Lorem Ipsum
  &lt;/span&gt;
  &lt;img src="path/to/image.jpeg" alt="image of something!" /&gt;
&lt;/Canvas&gt;
\`\`\`
`
    },
    {
      type: 'Markdown',
      content: `I've obviously quite drastically simplified the code above, and there are a fair bit of hacking around within \`pCreateDOMTextureBlob\`:

- Images will be ignored, unless you manually convert them to data uris.
- Same thing for web fonts, you need the \`@font-face\` with the dataURI as the url \`src: url(data:application...)\`
- It re-injects most css with \`document.styleSheets\`

As it stands, there's not much use to this component, until it's able to track things (state, css changes) a bit better, with a seamless data-flow between the webgl representation and the actual react component tree.
`
    },
  ]
};
