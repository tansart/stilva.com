require('babel-polyfill');
import * as tf from '@tensorflow/tfjs-core';
import {loadGraphModel} from '@tensorflow/tfjs-converter';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

export const genFacemesh = async function* genFacemesh(input) {
  // Load the MediaPipe Facemesh package.
  const model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
    {
      maxFaces: 1
    }
  );

  while(true) {
    const predictions = await model.estimateFaces({ input });

    yield predictions;
  }
}

export class StyleTransfer {
  constructor() {
    this.s255 = tf.scalar(255);
    this.alpha = tf.mul(tf.scalar(.5), tf.ones([1, 1, 1, 512]));
  }

  setAlpha(n) {
    this.alpha = tf.mul(tf.scalar(n/10), tf.ones([1, 1, 1, 512]));
  }

  async init() {
    this.model_vgg = await loadGraphModel('/web_models/adain_vgg/model.json');
    this.model_decoder = await loadGraphModel('/web_models/adain_decoder/model.json');
    this.model_encoder = await loadGraphModel('/web_models/adain_encoder/model.json');
  }

  async vgg(imageData) {
    imageData = tf.expandDims(tf.browser.fromPixels(imageData), 0);
    imageData = tf.div(imageData, this.s255);
    this.style = this.model_vgg.execute(imageData);
  }

  async encode(imageData) {
    imageData = tf.expandDims(tf.browser.fromPixels(imageData), 0);
    imageData = tf.div(imageData, this.s255);
    return this.model_encoder.execute(imageData);
  } 

  async decode(content) {
    let output = this.model_decoder.execute({
      'input_9:0': this.style,
      'input_10:0': content,
      'input_11:0': this.alpha
    });
    output = tf.squeeze(output, 0);
    output = tf.clipByValue(output, 0, 255);
    output = tf.cast(output, 'int32');

    return await tf.browser.toPixels(output);
  }
}