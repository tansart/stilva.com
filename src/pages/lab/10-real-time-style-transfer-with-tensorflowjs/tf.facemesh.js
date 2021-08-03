import {pGetImage, toDataImage} from "./utils";

require('babel-polyfill');
import * as tf from '@tensorflow/tfjs-core';
import {loadGraphModel} from '@tensorflow/tfjs-converter';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-backend-webgl';

const points = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
const pointsLeft = [199, 200, 18, 17, 13, 14, 164, 2, 94, 4, 5, 197, 168, 151, 108, 69, 105, 53, 46, 124, 35, 111, 117, 50, 205, 207, 214, 210, 211, 32, 208, 175];
const pointsRight = [151, 337, 299, 334, 283, 276, 353, 265, 340, 346, 280, 425, 427, 434, 430, 431, 262, 428, 175, 199, 200, 18, 17, 13, 14, 164, 2, 94, 4, 5, 197, 168];

export const facemeshFactory = async function facemeshFactory(input) {
  // Load the MediaPipe Facemesh package.
  const model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
    {
      maxFaces: 1,
      scoreThreshold: .75
    }
  );

  let killGenerator = false;

  return {
    kill: () => {
      killGenerator = true;
    },
    generator: async function* genFacemesh() {
      while(!killGenerator) {
        const predictions = await model.estimateFaces({ input });

        yield predictions;
      }
    }
  }
}

const GRAPH_MAPPING = {
  no_instance_norm: {
    vgg: {
      node: 'input_9:0',
      url: '/assets/adain/adain_vgg/model.json'
    },
    decoder: {
      url: '/assets/adain/adain_decoder/model.json'
    },
    encoder: {
      node: 'input_10:0',
      url: '/assets/adain/adain_encoder/model.json'
    },
    alpha: {
      node: 'input_11:0',
    }
  },
  with_instance_norm: {
    vgg: {
      node: 'input_8:0',
      url: '/assets/12-adaIN/adain_vgg/model.json'
    },
    decoder: {
      url: '/assets/12-adaIN/adain_decoder/model.json'
    },
    encoder: {
      node: 'input_9:0',
      url: '/assets/12-adaIN/adain_encoder/model.json'
    },
    alpha: {
      node: 'input_10:0',
    }
  }
}

export class StyleTransfer {
  constructor(use_instance_norm=false) {
    this._use_instance_norm = use_instance_norm;
    this._model_mapping = GRAPH_MAPPING[use_instance_norm ? 'with_instance_norm': 'no_instance_norm'];
    this.s255 = tf.scalar(255);
    this.alpha = tf.mul(tf.scalar(.5), tf.ones([1, 1, 1, 512]));
  }

  setAlpha(n) {
    this.alpha = tf.mul(tf.scalar(n/10), tf.ones([1, 1, 1, 512]));
  }

  async init() {
    this.model_vgg = await loadGraphModel(this._model_mapping.vgg.url);
    this.model_encoder = await loadGraphModel(this._model_mapping.encoder.url);
    this.model_decoder = await loadGraphModel(this._model_mapping.decoder.url);
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
      [this._model_mapping.vgg.node]: this.style,
      [this._model_mapping.encoder.node]: content,
      [this._model_mapping.alpha.node]: this.alpha
    });
    if(this._use_instance_norm) {
      output = tf.mul(output, 255.);
    }
    output = tf.squeeze(output, 0);
    output = tf.clipByValue(output, 0, 255);
    output = tf.cast(output, 'int32');

    return await tf.browser.toPixels(output);
  }
}

export class StyleTransferHelper {
  constructor(use_instance_norm = false) {
    this._st = new StyleTransfer(use_instance_norm);
  }

  setAlpha(n) {
    this._st.setAlpha(n);
  }

  async init(w, h) {
    await this._st.init();

    this._maskCanvas = document.createElement('canvas');
    this._maskCtx = this._maskCanvas.getContext('2d');
    this._maskCanvas.width = w;
    this._maskCanvas.height = h;

    this._faceCanvas = document.createElement('canvas');
    this._faceCtx = this._faceCanvas.getContext('2d');
    this._faceCanvas.width = w;
    this._faceCanvas.height = h;

    this._croppedCanvas = document.createElement('canvas');
    this._croppedContext = this._croppedCanvas.getContext('2d');
    this._croppedCanvas.width = 224;
    this._croppedCanvas.height = 224;
  }

  async setStyle(src) {
    const imageData = await toDataImage(src);
    await this._st.vgg(imageData);
  }

  // crops a centered image of face at 224 x 224
  async crop(img, {boundingBox}) {
    const [ptx, pty] = boundingBox.topLeft;
    const [brx, bry] = boundingBox.bottomRight;

    const [cx, cy] = [
      Math.floor(ptx + (brx - ptx) / 2) - 112,
      Math.floor(pty + (bry - pty) / 2) - 112
    ];

    this._croppedContext.drawImage(img, cx, cy, 224, 224, 0, 0, 224, 224);

    this._cx = cx;
    this._cy = cy;
  }

  clear() {
    this._croppedCanvas.width = this._croppedCanvas.width;
    this._maskCanvas.width = this._maskCanvas.width;
    this._faceCanvas.width = this._faceCanvas.width;

    this._maskCtx.fillStyle = 'rgba(1, 1, 1, 0)';
    this._maskCtx.fillRect(0, 0, this._maskCanvas.width, this._maskCanvas.height);
  }

  async applyStyletransfer() {
    try {
      const encoded = await this._st?.encode(this._croppedContext.getImageData(0, 0, 224, 224));
      const outputImageData = new ImageData(await this._st?.decode(encoded), 224, 224);

      this._faceCtx.fillStyle = 'rgba(1, 1, 1, 0)';
      this._faceCtx.fillRect(0, 0, this._faceCanvas.width, this._faceCanvas.height);
      this._faceCtx.putImageData(outputImageData, this._cx, this._cy);
    } catch(e) {
      console.error(`Error: ${e.message}`);
    }
  }

  async draw({scaledMesh}) {
    const ctx = this._maskCtx;
    ctx.fillStyle = 'rgba(1, 1, 1, 1)';

    let path = new Path2D();
    path.addPath(makeMask(scaledMesh, points));
    ctx.fill(path);

    path = new Path2D();
    path.addPath(makeMask(scaledMesh, pointsLeft));
    path.addPath(makeMask(scaledMesh, pointsRight));
    ctx.fill(path);
  }

  getImages() {
    return Promise.all([
      pGetImage(this._maskCanvas.toDataURL()),
      pGetImage(this._faceCanvas.toDataURL())
    ]);
  }

  destroy() {
    this._st = null;
  }
}

function makeMask(scaledMesh, pts) {
  const path = new Path2D();
  for(let i = 0; i < pts.length; i++) {
    const x = scaledMesh[pts[i]][0];
    const y = scaledMesh[pts[i]][1];
    if(i === 0) {
      path.moveTo(x, y);
    } else {
      path.lineTo(x, y);
    }
  }
  path.closePath();
  return path;
}
