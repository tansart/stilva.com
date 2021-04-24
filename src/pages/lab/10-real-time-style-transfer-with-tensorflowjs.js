import React, {memo, useState, Suspense} from 'react';
import loadable from "@loadable/component";
import {css} from 'linaria';

const Webcam = loadable(() => import('./10-real-time-style-transfer-with-tensorflowjs/Webcam'));

const webcamWrapperCSS = css`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  max-width: 640px;
  position: relative;
  
  &:before {
    content: '';
    display: block;
    height: 0;
    position: relative;
    padding-top: calc(400 / 640 * 100%);
    width: 100%;
  }
  
  & > * {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
`;

export default memo(function () {
  const [loadWebcam, setLoadWebcam] = useState(false);
  return <>
    <h1>Real-time style transfer with tensorflow.js</h1>
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
    <div className={webcamWrapperCSS}>
      {loadWebcam ? <Webcam />: <button onClick={() => setLoadWebcam(true)}>
        Start the webcam
      </button>}
    </div>
  </>
});
