import React, {memo, useState, useContext} from 'react';
import loadable from "@loadable/component";
import {RouterContext} from "@stilva/transitionable-react-router";
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
  const { setRoute } = useContext(RouterContext);
  const [loadWebcam, setLoadWebcam] = useState(false);

  return <>
    <h1>Instance Normalization with tfjs</h1>
    <h2>Overview /</h2>
    <p>
      According to this paper from 2017 (<a href="https://arxiv.org/pdf/1607.08022.pdf">Instance Normalization:
      The Missing Ingredient for Fast Stylization</a>), Instance Normalization helps improve the qualitative output of style transfer.
    </p>
    <p>
      Back when I was working on <a href="#" onClick={() => setRoute('/lab/adain-with-mediapipe')}>AdaIN with mediapipe</a>,
      the Android GPU delegate would constantly fail when the model had an <a href="https://www.tensorflow.org/addons/api_docs/python/tfa/layers/InstanceNormalization" target="_blank">Instance Normalization</a> layer.
    </p>
    <p>
      Thankfully, tfjs seems to work well with the webgl backend 🎉. Will update with some side-by-side tests after some more training.
    </p>
    <p>
      Notebook is here: <a href="https://github.com/stilva/adain-notebook" target="_blank">stilva/adain-notebook</a>
    </p>
    <h2>Demo /</h2>
    <div className={webcamWrapperCSS}>
      {loadWebcam ? <Webcam useIN={true} />: <AnimatedLink label="load & start" link="#" overrideCSS={buttonCSS} onClick={(e) => {
        e.preventDefault();
        setLoadWebcam(true)
      }} />}
    </div>
  </>
});
