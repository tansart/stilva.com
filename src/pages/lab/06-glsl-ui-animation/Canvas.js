import React, {useState, useRef, useLayoutEffect} from "react";
import {css, cx} from 'linaria';
import GLSL from "@stilva/glsl";

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

const glslClass = css`
img {
  top: 30%;
  display: block;
  left: 50%;
  opacity: 0;
  position: absolute;
  pointer-events: none;
  transform: translate3d(-50%, 0, 0);
}

span {
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
  top: 75px;
  white-space: normal;
}
`;

const glslContent = css`
  img {
    opacity: 1;
  }
  
  span {
    color: black;
  }
`;

const canvasClass = css`
  max-height: 100%;
  max-width: 100%;
  pointer-events: none;
`;

export default function Canvas({children}) {
  const node = useRef();
  const childrenWrapper = useRef();

  useLayoutEffect(() => {
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
            });
            img.src = b;
          });
        })
        .then(uImage);

      (new Promise(r => {
        let urls = [];
        const wrapper = document.createElement('div');
        wrapper.className = cx(glslClass, glslContent);
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

    glsl.fragment`out vec4 flagColor;
//2D (returns 0 - 1)
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
  
  vec4 img = texture(u_image, uv);
  vec4 outCol = vec4(vec3(dot( img.rgb, vec3(.2126, .7152, .0722) )), img.a);
  
  float i = 1.;
  float sliceY = random2d(vec2(time , 2345.0 + float(i)));
  float sliceH = random2d(vec2(2345.0 + float(i) , time));
  float hOffset = randomRange(vec2(time , 9625.0 + float(i)), -.1, .1);
  bool has = false;
  vec2 uvOff = uv;
  uvOff.x += hOffset;
  if (insideRange(uv.y, sliceY, fract(sliceY+sliceH)) == 1.0 ){
    outCol = texture(u_image, uvOff);
      
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
    vec4 t = texture(u_image, uv + colOffset);
    if(rnd < 0.33 && t.a > 0.){
      outCol.r = t.r;
    } else if (rnd < 0.66){
      outCol.b = t.b;
    }
  }

  // flagColor = texture(u_background, uv);
  flagColor = outCol;
}`;

    glsl.render();

    return () => {
      glsl.kill();
    }
  }, []);

  return <>
    <canvas
      className={canvasClass}
      height="500"
      width="800"
      ref={node}
      style={{
        display: 'inline-block',
        position: 'absolute'
      }}
    />
    <div
      className={glslClass}
      ref={childrenWrapper}
    >
      {children}
    </div>
  </>
}

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
