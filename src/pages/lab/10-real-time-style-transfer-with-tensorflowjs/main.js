import './main.scss';

import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs-core';
import {loadGraphModel} from '@tensorflow/tfjs-converter';

import GLSL from '@stilva/glsl/src/index';
import { genFacemesh, genStyletransfer, StyleTransfer } from './tf.facemesh';
import { pGetImage, toDataImage } from './utils';

var video = document.querySelector("video");
video.style.visibility = 'hidden';
video.style.position = 'absolute';

const mHiddenCanvas = document.createElement("canvas");
const mHiddenContext = mHiddenCanvas.getContext('2d');

const styleTransfer = new StyleTransfer();
styleTransfer.init().then(async () => {
    let imageData = await toDataImage('/style_03.png');
    await styleTransfer.vgg(imageData);
});

document.querySelector('#alpha').addEventListener('input', e => {
    styleTransfer.setAlpha(e.target.value);
})

document.querySelector('.styles').addEventListener('click', async (e) => {
    if(e.target.nodeName.toLowerCase() === 'picture' && !e.target.classList.contains('add')) {
        document.querySelector('.selected').classList.remove('selected');
        e.target.classList.add('selected');
        let imageData = await toDataImage(e.target.querySelector('img').src);
        await styleTransfer.vgg(imageData);
    }
});

const dropArea = document.querySelector('.add');
dropArea.addEventListener('dragover', e => e.preventDefault(), false);
dropArea.addEventListener('drop', handlerFunction, false);

function handlerFunction(e) {
    e.preventDefault();

    let dt = e.dataTransfer;
    let reader = new FileReader();

    reader.readAsDataURL(dt.files[0]);
    reader.onloadend = function() {
      const picture = document.createElement('picture');
      let img = new Image();
      img.src = reader.result;
      picture.appendChild(img);
      document.querySelector('.styles').insertBefore(picture, document.querySelector('.add'));
      picture.click();
    }
}

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
    })
    .catch(function(err) {
        console.log("An error occurred: " + err);
    });

const points = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
const pointsLeft = [199, 200, 18, 17, 13, 14, 164, 2, 94, 4, 5, 197, 168, 151, 108, 69, 105, 53, 46, 124, 35, 111, 117, 50, 205, 207, 214, 210, 211, 32, 208, 175];
const pointsRight = [151, 337, 299, 334, 283, 276, 353, 265, 340, 346, 280, 425, 427, 434, 430, 431, 262, 428, 175, 199, 200, 18, 17, 13, 14, 164, 2, 94, 4, 5, 197, 168];

video.addEventListener('loadeddata', async () => {
    mHiddenCanvas.width = video.videoWidth;
    mHiddenCanvas.height = video.videoHeight;
    mHiddenCanvas.style.visibility = 'hidden';
    // document.body.appendChild(mHiddenCanvas);

    const glsl = new GLSL([video.videoWidth, video.videoHeight]);

    let image = pGetImage(`data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=`);

    const updateImage = glsl.addTexture('u_image', image);
    const updateFace = glsl.addTexture('u_face', image);

    const uFaceLoc1 = Array(72).fill(0);
    const uFaceLeftLoc1 = Array(64).fill(0);
    const uFaceRightLoc1 = Array(64).fill(0);
    const updateFaceLoc1 = glsl.addVariable('u_face1_loc', uFaceLoc1, 'vec2');
    const updateFaceLeftLoc1 = glsl.addVariable('u_face1_left_loc', uFaceLeftLoc1, 'vec2');
    const updateFaceRightLoc1 = glsl.addVariable('u_face1_right_loc', uFaceRightLoc1, 'vec2');

    glsl.fragment`bool get_intersection(float x, float y, float xi, float yi, float xj, float yj) {
        return ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    }

    void main() {
        vec2 uv = gl_FragCoord.xy/u_resolution.xy;
        
        vec4 img = texture(u_image, vec2(uv.x, 1. - uv.y));
        vec4 face = texture(u_face, vec2(uv.x, 1. - uv.y));

        fragColor = img;

        bool inside = false;

        int n = 36;
        int j = n - 1;
        for(int i = 0; i < n; i++) {
            if (get_intersection(uv.x, uv.y, u_face1_loc[i].x, u_face1_loc[i].y, u_face1_loc[j].x, u_face1_loc[j].y))
                inside = !inside;
            j = i;
        }

        if(inside)
            fragColor = mix(img, face, 1.);

        inside = false;
        n = 32;
        j = n - 1;
        for(int i = 0; i < n; i++) {
            if (get_intersection(uv.x, uv.y, u_face1_left_loc[i].x, u_face1_left_loc[i].y, u_face1_left_loc[j].x, u_face1_left_loc[j].y))
                inside = !inside;
            j = i;
        }

        if(inside)
            fragColor = mix(img, face, 1.);

        inside = false;
        n = 32;
        j = n - 1;
        for(int i = 0; i < n; i++) {
            if (get_intersection(uv.x, uv.y, u_face1_right_loc[i].x, u_face1_right_loc[i].y, u_face1_right_loc[j].x, u_face1_right_loc[j].y))
                inside = !inside;
            j = i;
        }

        if(inside)
            fragColor = mix(img, face, 1.);
    }`;

    glsl.render();
    document.querySelector('.canvas').appendChild(glsl.canvas);

    let imageData = await toDataImage('/style_03.png');
    await styleTransfer.vgg(imageData);

    let generator = genFacemesh(video);
    for await (let value of generator) {
      mHiddenContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const mDataURL = mHiddenCanvas.toDataURL();

      if(value.length) {
        for(let i = 0; i < points.length; i++) {
            uFaceLoc1[2 * i] = value[0].scaledMesh[points[i]][0]/video.videoWidth;
            uFaceLoc1[2 * i + 1] = 1. - value[0].scaledMesh[points[i]][1]/video.videoHeight;
        }
        for(let i = 0; i < pointsLeft.length; i++) {
            uFaceLeftLoc1[2 * i] = value[0].scaledMesh[pointsLeft[i]][0]/video.videoWidth;
            uFaceLeftLoc1[2 * i + 1] = 1. - value[0].scaledMesh[pointsLeft[i]][1]/video.videoHeight;
        }
        for(let i = 0; i < pointsRight.length; i++) {
            uFaceRightLoc1[2 * i] = value[0].scaledMesh[pointsRight[i]][0]/video.videoWidth;
            uFaceRightLoc1[2 * i + 1] = 1. - value[0].scaledMesh[pointsRight[i]][1]/video.videoHeight;
        }

        const half = 224 /2;
        const [ptx, pty] = value[0].boundingBox.topLeft;
        const [brx, bry] = value[0].boundingBox.bottomRight;

        const [cx, cy] = [
            Math.floor(ptx + (brx - ptx) / 2) - half,
            Math.floor(pty + (bry - pty) / 2) - half
        ];

        imageData = mHiddenContext.getImageData(cx, cy, 224, 224);
        const content_encoded = await styleTransfer.encode(imageData);
        const outputImageData = await styleTransfer.decode(content_encoded);

        mHiddenContext.putImageData(new ImageData(outputImageData, 224, 224), cx, cy);

        updateFaceLoc1(uFaceLoc1);
        updateFaceLeftLoc1(uFaceLeftLoc1);
        updateFaceRightLoc1(uFaceRightLoc1);

        const img = await pGetImage(mDataURL);
        updateImage(img);
        }
        
        updateFace(mHiddenContext.getImageData(0, 0, video.videoWidth, video.videoHeight));
    }
});

class Capture {
    constructor() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
    }

    full() {
        return this._ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    }

    crop(x, y) {
        return this._ctx.getImageData(x, y, 224, 224)
    }
}