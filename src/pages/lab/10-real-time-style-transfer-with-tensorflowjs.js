import React, {memo, useState, Suspense} from 'react';
import loadable from "@loadable/component";
import {css} from 'linaria';
import AnimatedLink from "../../components/AnimatedLink";

const Webcam = loadable(() => import('./10-real-time-style-transfer-with-tensorflowjs/Webcam'));

const webcamWrapperCSS = css`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  max-width: 640px;
  min-height: 400px;
  position: relative;
`;

const buttonCSS = css`
  display: block;
  margin-bottom: 1rem;
  position: relative;

  span.text {
    color: black;
    font-size: 18px;
  }
  
  span.underline {
    background: black;
  }
`;

export default memo(function () {
  const [loadWebcam, setLoadWebcam] = useState(false);

  return <>
    <h1>Real-time style transfer with tensorflow.js</h1>
    <h2>Overview /</h2>
    <p>
      Last year I worked on a small arbitrary style transfer machine learning model that could run in real-time on my Pixel 2.
      I trained it in Tensorflow, built with MediaPipe.
    </p>
    <p>
      Below is the same model, saved as <code>SavedModel</code>, then converted with <code>tfjs-converter</code>:
    </p>
    <p>
      <i>Note:</i> please be aware that this will load 5 ML models, which is about 35MB of data – face detection model,
      face landmark model, vgg encoder, encoder, and the AdaIN decoder.
    </p>
    <p>
      <i>Note:</i> Looks like this isn't working on iOS. Might work with the tfjs wasm backend but that's for another time. Maybe.
    </p>
    <h2>Demo /</h2>
    <div className={webcamWrapperCSS}>
      {loadWebcam ? <Webcam />: <AnimatedLink label="load & start" link="#" overrideCSS={buttonCSS} onClick={(e) => {
        e.preventDefault();
        setLoadWebcam(true)
      }} />}
    </div>
    <h2>Technical notes /</h2>
    <p>
      The network architecture was built based on <a
      href="https://arxiv.org/pdf/1703.06868.pdf" target="_blank">Arbitrary Style Transfer in Real-time with Adaptive
      Instance Normalization</a>. Both encoder and decoders were optimised to run on my Pixel 2 Android phone.
      The encoder for the content and the encoder for the style are different.
    </p>
    <p>
      The COCO 2014 training dataset was used as the content, and the wikiart dataset for the styles.
    </p>
    <p>
      TFLite and memory on my Pixel were the two biggest bottlenecks to get this to work with a decent enough result, at a
      high enough frame rate. Porting the models to work in Chrome was straightforward.
    </p>
  </>
});
