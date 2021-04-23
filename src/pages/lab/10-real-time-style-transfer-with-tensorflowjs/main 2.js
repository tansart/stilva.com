import * as tf from '@tensorflow/tfjs-core';
import {loadGraphModel} from '@tensorflow/tfjs-converter';

require('babel-polyfill');
const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection');

// If you are using the WebGL backend:
require('@tensorflow/tfjs-backend-webgl');

var video = document.querySelector("video");
video.style.visibility = 'hidden';

let capture;
const mCanvas = document.querySelector("canvas");
const mContext = mCanvas.getContext('2d');

const s255 = tf.scalar(255);
const alpha = tf.mul(tf.scalar(.5), tf.ones([1, 1, 1, 512]));

async function* main() {
    // Load the MediaPipe Facemesh package.
    const model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
      {
        maxFaces: 1
      }
    );

    const model_vgg = await loadGraphModel('/web_models/adain_vgg/model.json');
    let imageData = await toDataImage('/style_03.png');
    imageData = tf.expandDims(tf.browser.fromPixels(imageData), 0);
    imageData = tf.div(imageData, s255);
    const styleTensor = model_vgg.execute(imageData);

    const model_decoder = await loadGraphModel('/web_models/adain_decoder/model.json');
    const model_encoder = await loadGraphModel('/web_models/adain_encoder/model.json');

    while(true) {
        const predictions = await model.estimateFaces({
            input: video
        });

        if(predictions.length > 0) {
            const [ptx, pty] = predictions[0].boundingBox.topLeft;
            const [brx, bry] = predictions[0].boundingBox.bottomRight;
            const [cx, cy] = [
                Math.floor(ptx + (brx - ptx) / 2),
                Math.floor(pty + (bry - pty) / 2)
            ];
            const half = 224 /2;
            const [dataAll, dataCrop, x, y] = capture(cx - half, cy - half, 224, 224);
            let inputImageData = tf.expandDims(tf.browser.fromPixels(dataCrop), 0);
            inputImageData = tf.div(inputImageData, s255);
            const frameTensor = model_encoder.execute(inputImageData);

            let output = model_decoder.execute({
                'input_9:0': styleTensor,
                'input_10:0': frameTensor,
                'input_11:0': alpha
            });
            output = tf.squeeze(output, 0);
            output = tf.clipByValue(output, 0, 255);
            output = tf.cast(output, 'int32');

            // const canvas = document.createElement('canvas');
            // canvas.width = 224;
            // canvas.height = 224;
            // document.body.appendChild(canvas);

            const outputImageData = await tf.browser.toPixels(output);

            mContext.putImageData(dataAll, 0, 0);
            mContext.putImageData(new ImageData(outputImageData, 224, 224), x, y);
        }
        
        yield predictions;
    }
  }

  const dataImageCanvas = document.createElement('canvas');
  const dataImageCtx = dataImageCanvas.getContext('2d');
  async function toDataImage(src) {
    return new Promise(async resolve => {
        const img = await pGetImage(src);
        dataImageCtx.drawImage(img, 0, 0);
        resolve(dataImageCtx.getImageData(0, 0, 224, 224));
    });
  }

  function pGetImage(src) {
      return new Promise(resolve => {
        const image = new Image;
        image.src = src;
        image.onload = () => {
            resolve(image);
        }
      });
  }

  video.addEventListener('loadeddata', () => {
        console.log('loadeddata');

        capture = function makeCapture() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            // canvas.getContext('2d').drawImage(video, x, y, 224, 224, 0, 0, 224, 224);
            return (x, y) => {
                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
                return [
                    ctx.getImageData(0, 0, video.videoWidth, video.videoHeight),
                    ctx.getImageData(x, y, 224, 224),
                    x, y
                ]
            };
        }();

        mCanvas.width = video.videoWidth;
        mCanvas.height = video.videoHeight;

        mCanvas.style = `width: ${video.videoWidth}px; height: ${video.videoHeight}px`;
    (async () => {
        let generator = main();
        for await (let value of generator) {
          console.log(value)
        }
      })();
  });

  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
    })
    .catch(function(err) {
        console.log("An error occurred: " + err);
    });