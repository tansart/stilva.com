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

const diffWrapperCSS = css`
  & > div:first-of-type {
    opacity: 0;
    position: absolute;
    z-index: 1;
  }
  
  &:hover {
    & > div:first-of-type {
      opacity: 1;
    }
    
    & > div:last-of-type {
      opacity: 0;
    }
  }
`;

const imageWrapperCSS = css`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  width: 100%;
  
  img {
    display: block;
    width: 100%;
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
      Thankfully, tfjs seems to work well with the webgl backend 🎉.
    </p>
    <p>
      Notebook is here: <a href="https://github.com/stilva/adain-notebook/blob/main/AdaIN.ipynb" target="_blank">stilva/adain-notebook</a>
    </p>
    <h2>Demo /</h2>
    <div className={webcamWrapperCSS}>
      {loadWebcam ? <Webcam useIN={true} />: <AnimatedLink label="load & start" link="#" overrideCSS={buttonCSS} onClick={(e) => {
        e.preventDefault();
        setLoadWebcam(true)
      }} />}
    </div>
    <h2>Comparison /</h2>
    <div className={diffWrapperCSS}>
      <p>
        Below is a set of faces with style transfer applied to it <strong>with</strong> Instance normalization. Hover to see <strong>without</strong> Instance Normalization
      </p>
      <div className={imageWrapperCSS}>
        <img src="/assets/12-adaIN/without_IN.jpeg" alt=""/>
      </div>
      <div className={imageWrapperCSS}>
        <img src="/assets/12-adaIN/with_IN.jpeg" alt=""/>
      </div>
    </div>
  </>
});
