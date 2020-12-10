import React, {memo, useEffect, useRef} from 'react';

import App from './06-glsl-ui-animation/App';
import {Code} from "../../components";

export default memo(function ({transitionstate}) {
  return <>
    <h1>GLSL UI animation</h1>
    <App transitionstate={transitionstate}/>
    <p><i>Note:</i> You can highlight the text, since the DOM is used as a texture in the shader.</p>
    <p>
      The two modules above are <strong>prototypes</strong> for one of my side project that I've been tinkering with.
      To build them, I've used both <code>@stilva/spring</code> and <code>@stilva/glsls</code>, and I thought I'd
      write a post about some of my findings:
    </p>
    <ul>
      <li>
        The changes that came out while using the libraries I've written in the past (dogfooding some of my own
        APIs)
      </li>
      <li>
        About using the DOM as a texture in GLSL (a technique my ex-colleagues at firstborn used back in 2017)
      </li>
    </ul>
    <h2>@stilva/Spring /</h2>
    <p>One of my goal for this library was to get a lightweight and composable component with spring physics. It's
      been a great tool so far – most likely because the API is the same as <code>react-spring</code>.
      For the module above, I wanted the transitions from the projects overview (the white-ish grids) to a specific
      project (the one with the model, text and the glitch effects) with a heavy ease-in: something I haven't been
      able to do only with spring.
      So, I've made a quick patch for the library to support <code>duration</code> and <code>easing</code>.
    </p>
    <p>
      <i>Note</i>: <code>easing</code> expects a function that accepts one argument <code>t
      ∈ &#123;0, 1&#125;</code> where <code>easing(t) ∈ &#123;0, 1&#125;</code>.
    </p>
    <Code lan="jsx">
      {`
const [animProps, setAnimProps] = useSpring({ x: 0}, {
  duration: 750,
  easing: t => t === 1 ? 1 : 1 - Math.pow(2, - 10 * t) // Expo.easeOut from tween.js
});
        `}
    </Code>
    <p>
      One of my next step is a minor refactoring, to encapsulate some of the logic and hopefully make the frameLoop
      more efficient.
    </p>
    <h2>@stilva/glsl /</h2>
    <p>
      I found a bug, then made a quick fix on this library – you weren't able to update a texture once the fragment
      shader was compiled. I've fixed this, and added the ability to pass in a blob as a texture (I've yet to
      determine if this is a good idea).
    </p>
    <p>
      This leads me to this new Component I've written:
    </p>
    <Code lan="jsx">
      {`
function Canvas({children}) {
  const node = useRef();
  const childrenWrapper = useRef();

  useEffect(() => {
    const glsl = new GLSL(node.current);
    const image = new Image();
    image.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    
    const uImage = glsl.addTexture('u_image', image);
    pCreateDOMTextureBlob(uImage, content => {
      return \` <svg width = "800" height = "500" xmlns = "http://www.w3.org/2000/svg" >
        <foreignObject x = "0" y = "0" width = "800" height = "500" >
          <div xmlns = "http://www.w3.org/1999/xhtml" >
          $\{content}
          </div>
        </foreignObject>
      </svg>\`
    });
    // ... glsl.fragment\`\` call here
    glsl.render();

    return () => {
      glsl.kill();
    }
  }, []);

  return <>
    <canvas
      className="canvas"
      height="500"
      width="800"
      ref={node}
    />
      <div
        className="glsl__content"
        ref={childrenWrapper}
      >
        {children}
      </div>
  </>
}
        `}
    </Code>
    <p>
      You can then use this <code>&lt;Canvas /&gt;</code> Component like so:
    </p>
    <Code lan="jsx">
      {`
<Canvas>
  <span className="styled-dom-text" >
    Lorem Ipsum
  </span>
  <img src="path/to/image.jpeg" alt="image of something!" />
</Canvas>
        `}
    </Code>
    <p>
      I've obviously quite drastically simplified the code above, and there are a fair bit of hacking around
      within <code>pCreateDOMTextureBlob</code>:
    </p>
    <ul>
      <li>Images will be ignored, unless you manually convert them to data uris.</li>
      <li>Same thing for web fonts, you need the <code>@font-face</code> with the dataURI as the url <code>src:
        url(data:application...)</code></li>
      <li>It re-injects most css with <code>document.styleSheets</code></li>
    </ul>
    <p>
      As it stands, there's not much use to this component, until it's able to track things (state, css changes) a bit
      better, with a seamless data-flow between the webgl representation and the actual react component tree.
    </p>
  </>
});
