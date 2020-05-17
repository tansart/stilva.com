import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import GLSL from '@stilva/glsl/src';
import {Animated, useSpring, interpolate} from '@stilva/spring/src';

const MaisonNeue = (function() {
  let _resolve, _reject;
  const _promise = new Promise((resolve, reject) => {
    _reject = reject;
    _resolve = resolve;
  });

  if(typeof window === 'undefined') {
    _reject();
  } else {
    if(document.querySelector(`[href$="maisonneuebook.css"]`)) {
      _resolve();
    } else {
      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      link.href = '/images/lab/maisonneuebook.css';
      link.addEventListener('load', _resolve);
      document.body.appendChild(link);
    }
  }

  return _promise;
})();

function Canvas({children, isActive}) {
  const node = useRef();
  const childrenWrapper = useRef();
  const [swapToGL, setSwapToGL] = useState(isActive);

  useLayoutEffect(() => {
    if(!isActive) {
      return () => {};
    }

    const glsl = new GLSL(node.current);
    glsl.addVariable('u_delta', [0, 2, 4]);
    const image = new Image();
    image.src = `data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=`;

    const uImage = glsl.addTexture('u_image', image);

    MaisonNeue.then(() => {
      let mStyle = '';
      for(let css of document.styleSheets) {
        mStyle += '<style>';
        for (let rule of css.rules) {
          if (!rule.href) {
            mStyle += rule.cssText;
          }
        }
        mStyle += '</style>';
      }

      // URL to blob????!??!?!
      const reader = new FileReader();

      (new Promise(r => {
        reader.addEventListener('load', e => {
          r(e.target.result);
        });
      }))
        .then(b => {
          const img = new Image();
          return new Promise(r => {
            img.addEventListener('load', e => {
              r(img);
              setSwapToGL(true);
            });
            img.src = b;
          });
        })
        .then(uImage);

      (new Promise(r => {
        let urls = [];
        const wrapper = document.createElement('div');
        wrapper.className = "gl glsl__content";
        wrapper.innerHTML = childrenWrapper.current.innerHTML;
        const mHtml = wrapper.outerHTML.replace(/<img([^>]+)>/, (tags, attributes) => {
          attributes.replace(/src="([^\"]+)"/,  (match, src) => {
            urls.push(src);
            return match;
          });
          return `<img ${attributes} />`;
        });

        Promise
          .all(urls.map(getDataUri))
          .then(urls => {
            r(urls.reduce( (acc, {src, uri}) => {
              return acc.replace(new RegExp(`src="${src}"`), `src="${uri}"`);
            },  mHtml));
          })
      }))
        .then(div => {
          const mHtml = `<svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
<foreignObject x="0" y="0" width="800" height="500">
  <div xmlns="http://www.w3.org/1999/xhtml">
    ${mStyle}
    ${div}
  </div>
</foreignObject>
</svg>`;
          reader.readAsDataURL(new Blob([mHtml], {type: `image/svg+xml`}));
        });
    });

    glsl.fragment`//2D (returns 0 - 1)
float random2d(vec2 n) { 
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float randomRange (in vec2 seed, in float min, in float max) {
  return min + random2d(seed) * (max - min);
}

// return 1 if v inside 1d range
float insideRange(float v, float bottom, float top) {
   return step(bottom, v) - step(top, v);
}

//inputs
float AMT = 0.5; //0 - 1 glitch amount
float SPEED = 0.2; //0 - 1 speed

void main()
{
  float time = floor(u_time * SPEED * 20.0);
  vec2 uv = gl_FragCoord.xy/u_resolution.xy;
  uv = vec2(uv.x, 1. - uv.y);
  
  vec4 img = texture2D(u_image, uv);
  vec4 outCol = vec4(vec3(dot( img.rgb, vec3(.2126, .7152, .0722) )), img.a);
  
  float i = 1.;
  float sliceY = random2d(vec2(time , 2345.0 + float(i)));
  float sliceH = random2d(vec2(2345.0 + float(i) , time));
  float hOffset = randomRange(vec2(time , 9625.0 + float(i)), -.1, .1);
  bool has = false;
  vec2 uvOff = uv;
  uvOff.x += hOffset;
  if (insideRange(uv.y, sliceY, fract(sliceY+sliceH)) == 1.0 ){
    outCol = texture2D(u_image, uvOff);
      
    if (insideRange(uv.x, sliceH, fract(sliceY+sliceH)) == 1.0 ) {
      has = true;
    }
  }
  
  //do slight offset on one entire channel
  float maxColOffset = .001;
  float rnd = random2d(vec2(time , 9545.0));
  vec2 colOffset = vec2(randomRange(vec2(time , 9545.0),-.1,.1), randomRange(vec2(time , 7205.0),-.1, .1));
  colOffset = vec2(hOffset * -1.);
  
  if(has) {
    vec4 t = texture2D(u_image, uv + colOffset);
    if(rnd < 0.33 && t.a > 0.){
      outCol.r = t.r;
    } else if (rnd < 0.66){
      outCol.b = t.b;
    }
  }

  // gl_FragColor = texture2D(u_background, uv);
  gl_FragColor = outCol;
}`;

    glsl.render();

    return () => {
      glsl.kill();
    }
  }, [isActive]);

  return <>
    <canvas
      className="canvas"
      height="500"
      width="800"
      ref={node}
      style={{
        display: 'inline-block',
        position: 'absolute'
      }}
    />
    <div
      className={["glsl__content", swapToGL ? '': 'gl'].join(' ')}
      ref={childrenWrapper}
    >
      {children}
    </div>
  </>
}

function ProjectContent({}) {
  const isAnimatingInRef = useRef(null);
  isAnimatingInRef.current = isAnimatingIn;
  const [animated, setAnimated] = useState(false);
  const [opacityProps, setOpacityProps] = useSpring({o: 0}, {
    easing: BezierEasing(1,.0,1,.21),
    duration: 150
  });
  const [canvasProps, setCanvasProps] = useSpring({t: .7}, {
    easing: BezierEasing(.71,.72,.5,1),
    duration: 500
  });
  const [canvasImgProps, setcanvasImgProps] = useSpring({t: .5}, {
    easing: BezierEasing(.71,.72,.5,1),
    duration: 750,
    onEnd: () => {
      if(!isAnimatingInRef.current) {
        setAnimated(true);
      }
    }
  });

  return <Canvas isActive={animated}>
    <Animated.span
      style={{
        transform: interpolate(canvasProps, ({t}) => {
          return `translate3d(0, ${100 - t.lastPosition * 100}%, 0)`;
        }),
        opacity: interpolate(opacityProps, ({o}) => {
          return o.lastPosition;
        }),
      }}
    >
      At vero eos et accusus et iusto odio dignissimos
    </Animated.span>
    <Animated.img
      src="/images/lab/folio.png"
      style={{
        transform: interpolate(canvasImgProps, ({t}) => {
          return `translate3d(-50%, ${100 - t.lastPosition * 100}%, 0)`;
        }),
      }}
    />
  </Canvas>
}

function Project({close, height, initRect, width}) {
  const {height: tHeight, index, width: tWidth, x: tX, y: tY} = initRect;
  const [isAnimatingIn, setIsAnimatingIn] = useState(true);
  const isAnimatingInRef = useRef(null);
  isAnimatingInRef.current = isAnimatingIn;

  const [transformProps, setTransformProps] = useSpring({ t: 0 }, {
    easing: BezierEasing(.47,.04,.94,.57),
    duration: 450,
    onEnd: () => {
      setTimeout(() => {
        if(!isAnimatingInRef.current) {
          // setCanvasProps({t: 1});
          // setcanvasImgProps({t: 1});
        }
      }, 250);
    }
  });

  useEffect(() => {
    if(index > -1) {
      setTimeout(() => {
        setIsAnimatingIn(false);
        // setOpacityProps({o : 1});
        setTransformProps({t: 1});
      }, 500);
    }
  }, [index]);

  if(index === -1) {
    return null;
  }

  const rX = tWidth/width;
  const rY = tHeight/height;

  return <Animated.div
    className="section__project"
    style={{
      '--translateXY': interpolate(transformProps, ({t}) => {
        const p = t.lastPosition;
        return `${(1 - p) * tX}px, ${(1 - p) * tY}px`;
      }),
      '--scale': interpolate(transformProps, ({t}) => {
        const p = t.lastPosition;
        return `${rX + (1 - rX) * p}, ${rY + (1 - rY) * p}`;
      }),
      height: `${height}px`,
      width: `${width}px`
    }}
  >
    <div className="button__close">
      <button onClick={close}>x</button>
    </div>
    {/*<ProjectContent
    />*/}
  </Animated.div>
}

function Section({isVisible}) {
  const [animTitleProps, setAnimTitleProps] = useSpring({ x: 0 });
  const [animCatProps, setAnimCatProps] = useSpring({ x: 0 });

  useEffect(() => {
    setAnimTitleProps({x: isVisible ? 1: 0});
    setAnimCatProps({x: isVisible ? 1: 0})
  }, [isVisible]);

  return <>
    <Animated.span
      className="section__text"
      style={{
        transform: interpolate(animTitleProps, ({x}) => `scaleX(${x.lastPosition})`),
        transformOrigin: '0 0',
        width: '75%'
      }}
    />
    <Animated.span
      className="section__text"
      style={{
        margin: '5px 0 0 0',
        transform: interpolate(animCatProps, ({x}) => `scaleX(${x.lastPosition})`),
        transformOrigin: '0 0',
        width: '55%'
      }}
    />
  </>
}

function Column({
  hoveredIndex,
  index,
  onMouseClick,
  onMouseOut,
  onMouseOver,
  selectedIndex
}) {
  const [animComplete, setAnimComplete] = useState({
    hovered: index === hoveredIndex,
    done: false
  });

  const [animatedProps, setAnimatedProps] = useSpring({
    x: 0,
    w: 0
  }, {
    mass: 1,
    tension: 200,
    friction: 26,
    onEnd: () => {
      setAnimComplete(s => ({
        hovered: s.hovered,
        done: !!s.hovered
      }));
    }
  });

  useEffect(() => {
    let x = 0;
    if(index === hoveredIndex) {
      x = 0;
    } else if(hoveredIndex > -1 && hoveredIndex < 3 && hoveredIndex > 0) {
      if(hoveredIndex < index) {
        x = 1;
      } else {
        x = -1;
      }
    }

    setAnimComplete(s => ({
      hovered: index === hoveredIndex,
      done: hoveredIndex === -1 ? false: s.done
    }));

    setAnimatedProps({
      x,
      w: (hoveredIndex === index ? 1: 0)
    });
  }, [index, hoveredIndex]);

  useEffect(() => {
    selectedIndex > -1 && setAnimComplete(s => ({
      hovered: -1,
      done: false
    }));
  }, [selectedIndex])

  const style = useMemo(() => {
    switch(index) {
      case 0:
        return {
          right: `${Math.round(800 * .5)}px`,
          transform: interpolate(animatedProps, ({x, w}) => `translate3d(${(-800 * (.1 + 0.0375) + (800 * .05) * x.lastPosition)}px, 0, 0) scaleX(${.5 + .5 * w.lastPosition})`),
          transformOrigin: '100% 50%'
        };
      case 1:
        return {
          right: `${Math.round(800 * (.5 - .05))}px`,
          transform: interpolate(animatedProps, ({x, w}) => `translate3d(${(-800 * 0.0125 + (800 * .05) * x.lastPosition)}px, 0, 0) scaleX(${.5 + .5 * w.lastPosition})`),
          transformOrigin: '50% 50%'
        }
      case 2:
        return {
          left: `${Math.round(800 * (.5 - .05))}px`,
          transform: interpolate(animatedProps, ({x, w}) => `translate3d(${(800 * 0.0125 + (800 * .05) * x.lastPosition)}px, 0, 0) scaleX(${.5 + .5 * w.lastPosition})`),
          transformOrigin: '50% 50%'
        }
      case 3:
        return {
          left: `${Math.round(800 * .5)}px`,
          transform: interpolate(animatedProps, ({x, w}) => `translate3d(${(800 * (.1 + 0.0375) + (800 * .05) * x.lastPosition)}px, 0, 0) scaleX(${.5 + .5 * w.lastPosition})`),
          transformOrigin: '0% 50%'
        }
    }
  }, [animatedProps]);

  return <Animated.div
    className="column"
    onClick={e => {
      const {
        x,
        y,
        height,
        width
      } = e.currentTarget.getBoundingClientRect();

      const parentRect = e.currentTarget.parentElement.getBoundingClientRect();

      onMouseClick({
        height,
        index,
        x: x - parentRect.x,
        y: y - parentRect.y,
        width
      });
    }}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    style={style}
  >
    <Section
      isVisible={animComplete.done}
    />
  </Animated.div>
}

const indexes = Array.from(Array(4), (_, i) => i);
function Wrapper({}) {
  const [selected, setSelected] = useState({index: -1});
  const [hovered, setHovered] = useState(-1);

  return <div className="wrapper">
    <Project
      initRect={selected}
      close={() => setSelected({index: -1})}
      height={500}
      width={800}
    />
    {indexes.map((index) => <Column
      hoveredIndex={hovered}
      index={index}
      key={`column_${index}`}
      onMouseClick={setSelected}
      onMouseOut={() => selected.index < 0 && setHovered(-1)}
      onMouseOver={() => selected.index < 0 && setHovered(index)}
      selectedIndex={selected.index}
    />)}
  </div>
}

export default {
  link: 'glsl-ui-animation',
  title: `GLSL UI animation`,
  date: `May 2020`,
  categories: 'web',
  content: [
    {
      type: 'FunctionalComponent',
      css: `
.wrapper {
  align-items: center;
  background: #1D1D1D;
  display: flex;
  height: ${Math.round(900/1440 * 800)}px;
  justify-content: center;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  width: 800px;
}

.wrapper canvas {
  max-height: 100%;
  max-width: 100%;
}

.column {
  background: #FFFAF5;
  cursor: pointer;
  display: block;
  flex: 0 0 auto;
  height: 40%;
  margin: 0;
  position: absolute;
  width: 20%;
}

.section__project {
  --translateXY: 0;
  --scale: 0;
  background: #FFFAF5;
  left: 0;
  position: absolute;
  top: 0;
  transform: translate3d(var(--translateXY), 0) scale(var(--scale));
  transform-origin: 0% 0%;
  white-space: nowrap;
  z-index: 1;
}

.section__project canvas {
  pointer-events: none;
}

.section__project .glsl__content {
  z-index: 1;
}

.section__text {
  background: black;
  display: block;
  height: 15px;
  left: 15px;
  pointer-events: none;
  position: relative;
  top: 15px
}

.button__close {
  align-items: center;
  background: #1d1d1d;
  display: flex;
  height: 10%;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.button__close button {
  background: transparent;
}

.glsl__content img {
  top: 15%;
  display: block;
  left: 50%;
  opacity: 0;
  position: absolute;
  pointer-events: none;
  transform: translate3d(-50%, 0, 0);
}

.gl.glsl__content img {
  opacity: 1;
}

.glsl__content span {
  color: transparent;
  display: block;
  font-family: MaisonNeue-Book;
  font-size: 94px;
  font-style: normal;
  font-weight: normal;
  line-height: 1.25;
  max-width: 100%;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  top: 40px;
  white-space: normal;
}

.gl.glsl__content span {
  color: black;
}
`,
      component: function () {
        return <Wrapper />
      }
    },
    {
      type: 'Markdown',
      content: `The module above is a **prototype** for one of my side project that I've been tinkering with. To build it, I've used both \`@stilva/spring\` and \`@stilva/glsls\`, and I thought I'd write a post about some of my findings:

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

function getDataUri(src) {
  return new Promise(r => {
    const img = new Image();
    img.addEventListener('load', e => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      r({
        src,
        uri: canvas.toDataURL('image/png')
      });
    });
    img.src = src;
  })
}

// https://www.particleincell.com/2013/cubic-line-intersection/
function computeIntersections(p1x, p1y, p2x, p2y, x) {
  if(x === 0) return 0;
  if(x === 1) return 1;

  var bx = bezierCoeffs(p1x ,p2x);
  var by = bezierCoeffs(p1y ,p2y);

  return cubicRoots(bx[1]/bx[0], bx[2]/bx[0], -x/bx[0]).map(t => by[0]*t*t*t+by[1]*t*t+by[2]*t);
}

function bezierCoeffs(P1,P2) {
  return [
    3*P1 + -3*P2 + 1,
    -6*P1 + 3*P2,
    3*P1
  ];
}

function cubicRoots(a,b,c) {
  let A = a;
  const B = b;
  const C = c;

  const Q = (3*B - Math.pow(A, 2))/9;
  const R = (9*A*B - 27*C - 2*Math.pow(A, 3))/54;
  const D = Math.pow(Q, 3) + Math.pow(R, 2);    // polynomial discriminant

  A = A/3;

  // complex or duplicate roots
  if (D >= 0) {
    const S = Math.cbrt(R + Math.sqrt(D));
    const T = Math.cbrt(R - Math.sqrt(D));

    if(Math.abs(Math.sqrt(3)*(S - T)/2) !== 0) {
      return [-A + (S + T)];
    } else {
      return customFilter([
        -A + (S + T),
        -A - (S + T)/2,
        -A - (S + T)/2
      ]);
    }
  } else {
    // distinct real roots
    var th = Math.acos(R/Math.sqrt(-Math.pow(Q, 3)));

    return customFilter([
      2 * Math.sqrt(-Q) * Math.cos(th/3) - A,
      2 * Math.sqrt(-Q) * Math.cos((th + 2 * Math.PI)/3) - A,
      2 * Math.sqrt(-Q) * Math.cos((th + 4 * Math.PI)/3) - A
    ]);
  }
}

function customFilter(input) {
  return input
    .filter(t => (t>0 && t<1))
    .sort();
}

var BezierEasing = function _BezierEasing() {
  var NEWTON_ITERATIONS = 4;
  var NEWTON_MIN_SLOPE = 0.001;
  var SUBDIVISION_PRECISION = 0.0000001;
  var SUBDIVISION_MAX_ITERATIONS = 10;

  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  var float32ArraySupported = typeof Float32Array === 'function';

  function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
  function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
  function C (aA1)      { return 3.0 * aA1; }
  function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }
  function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

  function binarySubdivide (aX, aA, aB, mX1, mX2) {
    var currentX, currentT, i = 0;
    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0.0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return currentT;
  }

  function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
      var currentSlope = getSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0.0) {
        return aGuessT;
      }
      var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }

  function LinearEasing (x) {
    return x;
  }

  return function bezier (mX1, mY1, mX2, mY2) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
      throw new Error('bezier x values must be in [0, 1] range');
    }

    if (mX1 === mY1 && mX2 === mY2) {
      return LinearEasing;
    }

    // Precompute samples table
    var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
    for (var i = 0; i < kSplineTableSize; ++i) {
      sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }

    function getTForX (aX) {
      var intervalStart = 0.0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }
      --currentSample;

      // Interpolate to provide an initial guess for t
      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;

      var initialSlope = getSlope(guessForT, mX1, mX2);
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }
    }

    return function BezierEasing (x) {
      // Because JavaScript number are imprecise, we should guarantee the extremes are right.
      if (x === 0 || x === 1) {
        return x;
      }
      return calcBezier(getTForX(x), mY1, mY2);
    };
  };
}();
