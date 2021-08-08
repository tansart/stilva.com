import React, {memo, useEffect, useRef, useState} from 'react';
import {css, cx} from 'linaria';
import GLSL from "@stilva/glsl";

import {facemeshFactory, StyleTransferHelper} from './tf.facemesh';

const wrapperCSS = css`
  display: flex;
  flex-direction: column;
  margin-top: 14px;
  position: relative;
  
  &:before,
  &:after {
    bottom: 0;
    content: '';
    height: 100px;
    pointer-events: none;
    position: absolute;
    width: 62px;
    z-index: 2;
  }
  
  &:before {
    display: var(--left-visibility);
    background: linear-gradient(90deg, #f1f1f1, #f1f1f100);
    left: 0;
  }
  
  &:after {
    display: var(--right-visibility);
    background: linear-gradient(270deg, #f1f1f1, #f1f1f100);
    right: 0;
  }
  
  canvas,
  [type="range"] {
    margin: 0 auto;
    max-width: calc(100vw - 40px);
  }
`;

const stylesListCSS = css`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin: 20px auto 0;
  max-width: calc(100vw - 40px);
  min-height: 100px;
  overflow-x: scroll;
  padding: 0 10px;
  position: relative;
  width: 640px;
  
  &::-webkit-scrollbar {
    background-color: #f1f1f1;
    height: 1px;
    width: 1em;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #f1f1f1;
  }
  
  picture {
    cursor: pointer;
    flex: 1 0 48px;
    margin-right: 34px;
    position: relative;
    transition: transform 350ms ease-out;
    z-index: 1;
  }
`;

const hiddenFileInputCSS = css`
  pointer-events: none;
  position: absolute;
  visibility: hidden;
`;

const imageCSS = css``;

const pictureCSS = css`
  &:after {
    background: black;
    border-radius: 50%;
    content: '';
    height: 100%;
    left: 0;
    overflow: hidden;
    position: absolute;
    transition: transform 350ms ease-out;
    transform: scale(.95);
    top: 0;
    width: 100%;
    z-index: -1;
  }
  
  &:last-of-type {
    margin-right: 0;
  }
  
  & > .${imageCSS} {
    border: 1px solid black;
    border-radius: 50%;
    height: 64px;
    object-fit: cover;
    position: relative;
    pointer-events: none;
    width: 64px;
    z-index: 1;
  }
`;

const selectedCSS = css`
  transform: scale(1.2);
  
  &:after {
    transform: scale(1.1);
  }
`;

const inputRangeCSS = css`
  background: #f1f1f1;
  height: 25px;
  margin: 10px 0;
  width: 640px;
  -webkit-appearance: none;
  
  &:focus {
    outline: none;
    
    &::-webkit-slider-runnable-track {
      background: black;
    }
  }
  
  &::-webkit-slider-runnable-track {
    background:black;
    border: 0 solid black;
    border-radius: 1px;
    box-shadow: 0 0 0 black;
    cursor: pointer;
    height: 1px;
    width: 100%;
  }
  
  &::-webkit-slider-thumb {
    box-shadow: 0 0 0 black;
    border: 1px solid white;
    height: 14px;
    width: 14px;
    border-radius: 25px;
    background: black;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -6px;
  }
`;

const IMAGES = [
  'style_01',
  'style_02',
  'style_03',
  'style_04',
  'style_05',
  'style_06',
  'style_07'
]

export default memo(function ({useIN=false}) {
  const node = useRef();
  const helperRef = useRef();
  const wrapperRef = useRef();
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(2);
  const video = document.createElement('video');

  useEffect(() => {
    let generator;

    const styleTransferHelper = new StyleTransferHelper(useIN);
    helperRef.current = styleTransferHelper;
    const glsl = new GLSL(node.current, {webglVersion: 'webgl'});

    video.addEventListener('loadeddata', async () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      generator = await facemeshFactory(video);
      await styleTransferHelper.init(video.videoWidth, video.videoHeight);
      await styleTransferHelper.setStyle('/assets/10-adain/images/style_03.png');

      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      const updateBackground = glsl.addTexture('u_background', canvas);
      const updateFaces = glsl.addTexture('u_faces', canvas);
      const updateMask = glsl.addTexture('u_mask', canvas);

      glsl.fragment`void main() {
        vec2 uv = gl_FragCoord.xy/u_resolution.xy;
        uv = vec2(uv.x, 1. - uv.y);
        vec4 bg = texture2D(u_background, uv);
        vec4 faces = texture2D(u_faces, uv);
        gl_FragColor = mix(bg, faces, step(2., texture2D(u_mask, uv).a + faces.a));
      }`;

      glsl.render();

      for await (let generated of generator.generator()) {
        styleTransferHelper.clear();
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

        for(let mesh of generated) {
          await styleTransferHelper.crop(canvas, mesh);
          await styleTransferHelper.applyStyletransfer();
          await styleTransferHelper.draw(mesh);
        }
        const images = await styleTransferHelper.getImages();
        updateBackground(canvas);
        updateMask(images[0]);
        updateFaces(images[1]);
      }
    });

    navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });

    return () => {
      glsl?.kill();
      generator?.kill();
      styleTransferHelper?.destroy();
      video.srcObject.getTracks().forEach(track => track.stop());
    };
  }, []);

  const onImageClickFactory = i => (e) => {
    setSelected(i);
    helperRef.current.setStyle(e.target.querySelector('img').src);
  };

  const handlerFunction = (e) => {
    e.preventDefault();

    let reader = new FileReader();

    try {
      reader.readAsDataURL(e.dataTransfer?.files?.[0] || e.target.files?.[0]);
    } catch(e) {
      console.log('Error loading file::', e.message);
    }
    reader.onloadend = function() {
      setImages(images => {
        const newImages = [...images, reader.result];
        setSelected(IMAGES.length + newImages.length - 1);
        return newImages;
      });
    }
  }

  useEffect(() => {
    if(images.length) {
      const imgEl = document.querySelector(`.${pictureCSS}:nth-of-type(${selected + 1}) img`);
      helperRef.current.setStyle(imgEl.src);
    }
  }, [images, selected]);

  return <div className={wrapperCSS} ref={wrapperRef}>
    <canvas ref={node} width={640} height={400} />
    <input className={hiddenFileInputCSS} type="file" id="input" multiple onChange={handlerFunction} />
    <input className={inputRangeCSS} type="range" onInput={e => helperRef.current.setAlpha(e.target.value)} min="0" max="10" defaultValue="5" step="1"/>
    <div className={stylesListCSS} onDragOver={e => e.preventDefault()} onDrop={handlerFunction}>
      <IntersectionObs onVisibilityChange={(entries) => onVisibilityChange(entries?.[0], wrapperRef.current, 'left-visibility')} />
      {IMAGES.map((name, i) => <Picture name={`style_${i}`} onClick={onImageClickFactory(i)} selectedStyle={i === selected ? selectedCSS: null} src={`/assets/10-adain/images/${name}.png`} />)}
      {images.map((src, i) => <Picture name={`user_style_${i}`} onClick={onImageClickFactory(IMAGES.length + i)} selectedStyle={IMAGES.length + i === selected ? selectedCSS: null} src={src} />)}
      {<Picture name={'add'} onClick={() => document.getElementById('input')?.click()} selectedStyle={null} src={`/assets/10-adain/images/plus.png`} />}
      <IntersectionObs onVisibilityChange={(entries) => onVisibilityChange(entries?.[0], wrapperRef.current, 'right-visibility')} />
    </div>
  </div>
});

function onVisibilityChange(entry, ref, cssVar) {
  ref?.style?.setProperty?.(`--${cssVar}`, entry?.isIntersecting ? 'none': 'block');
}

const intersectionObsCSS = css`
  background: transparent;
  flex: 0 0 1px;
  height: 100px;
  position: relative;
  pointer-events: none;
  width: 1px;
`;

function IntersectionObs({id, onVisibilityChange}) {
  const ref = useRef();

  useEffect(() => {
    let observer;

    let options = {
      root: null,
      rootMargin: "0px",
      threshold: [0, 1]
    };

    if(typeof IntersectionObserver === 'undefined') {
      // iOS 11 :(
      return () => {};
    }

    observer = new IntersectionObserver(onVisibilityChange, options);
    observer.observe(ref.current);

    return () => {
      observer.unobserve?.(ref.current);
    }
  }, []);
  return <div className={intersectionObsCSS} ref={ref} />
}

function Picture({name, onClick, selectedStyle, src}) {
  return <picture className={cx(pictureCSS, selectedStyle)} key={name} onClick={onClick}>
    <img className={imageCSS} src={src}/>
  </picture>
}
