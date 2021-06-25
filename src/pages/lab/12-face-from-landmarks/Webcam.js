import React, {memo, useEffect, useRef, useMemo, useState} from 'react';
import {css, cx} from 'linaria';
import GLSL from "@stilva/glsl";

import { facemeshFactory, mappedColours, mappedIndexes, FACES } from './tf.facemesh';
import {StyleTransferHelper} from "../10-real-time-style-transfer-with-tensorflowjs/tf.facemesh";
import {loadGraphModel} from "@tensorflow/tfjs-converter";
import * as tf from "@tensorflow/tfjs-core";

const a = css`
  position: relative;
`;

const c = css`
  left: 0;
  position: absolute;
  top: 0;
`;

export default memo(function () {
  const node = useRef();
  const canvasRef = useRef();
  const outputRef = useRef();
  const rand = useMemo(() => {
    return tf.randomNormal([1, 126], 0, 1, 'float32');
  }, []);
  const randRef = useRef(rand);
  const [size, setSize] = useState({w: 640, h: 400});

  useEffect(() => {
    let generator;

    const video = document.createElement('video');
    document.body.appendChild(video);

    const glsl = new GLSL(node.current, { webglVersion: 'webgl'});

    video.addEventListener('loadeddata', async () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      setSize({w: video.videoWidth, h: video.videoHeight});

      generator = await facemeshFactory(video);

      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      const updateBackground = glsl.addTexture('u_background', canvas);

      glsl.fragment`void main() {
        vec2 uv = gl_FragCoord.xy/u_resolution.xy;
        uv = vec2(uv.x, 1. - uv.y);
        vec4 bg = texture2D(u_background, uv);
        gl_FragColor = bg;
      }`;

      glsl.render();
      glsl.resize([video.videoWidth, video.videoHeight]);

      // const generator_model = await loadGraphModel('/assets/12-face-from-landmarks/model.json');

      const inputCtx = canvasRef.current.getContext('2d');
      for await (let generated of generator.generator()) {
        try {
          canvasRef.current.width = canvasRef.current.width;

          ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

          inputCtx.fillStyle = 'white';
          inputCtx.fillRect(0, 0, 256, 256);

          if(!generated.length) {
            continue;
          }

          const points = generated[0].scaledMesh;

          const [ptx, pty] = generated[0].boundingBox.topLeft;
          const [brx, bry] = generated[0].boundingBox.bottomRight;

          const [cx, cy] = [
            Math.floor(ptx + (brx - ptx) / 2) - 128,
            Math.floor(pty + (bry - pty) / 2) - 128
          ];

          inputCtx.fillStyle = 'white';
          inputCtx.fillRect(0, 0, 256, 256);

          const contourPath = new Path2D();
          const contourSet = new Set();

          for(let i = 0; i < FACES.length; i+=3) {
            const [a,b,c] = [FACES[i], FACES[i+1], FACES[i+2]];

            const [x1, y1] = [points[a][0], points[a][1]];
            const [x2, y2] = [points[b][0], points[b][1]];
            const [x3, y3] = [points[c][0], points[c][1]];

            const determinant = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1);

            if(determinant < 0) {
              [
                [a > b ? `${a}_${b}`: `${b}_${a}`, a, b],
                [a > c ? `${a}_${c}`: `${c}_${a}`, a, c],
                [c > b ? `${c}_${b}`: `${b}_${c}`, c, b]
              ].forEach(([k, a, b]) => {
                if(!contourSet.has(k)) {
                  contourSet.add(k);
                  contourPath.moveTo(points[a][0] - cx, points[a][1] - cy);
                  contourPath.lineTo(points[b][0] - cx, points[b][1] - cy);
                }
              });

              inputCtx.strokeStyle = "blue";
              inputCtx.fillStyle = "blue";

              const path = new Path2D();
              path.moveTo(points[a][0] - cx, points[a][1] - cy);
              path.lineTo(points[b][0] - cx, points[b][1] - cy);
              path.lineTo(points[c][0] - cx, points[c][1] - cy);

              inputCtx.fill(path);
              // inputCtx.stroke(path);
            }
          }

          inputCtx.stroke(contourPath);

          for (let [k, pts] of Object.entries(mappedIndexes)) {
            inputCtx.strokeStyle = mappedColours[k];
            inputCtx.fillStyle = mappedColours[k];

            inputCtx.beginPath();

            const path = new Path2D();
            for (let i in pts) {
              const [x, y] = [(points[pts[i]][0] - cx),  (points[pts[i]][1] - cy)];

              if(i === 0) {
                path.moveTo(x, y);
              }
              path.lineTo(x, y);
            }

            inputCtx.stroke(path);
            inputCtx.fill(path);
          }

          let imageData = tf.expandDims(tf.browser.fromPixels(canvasRef.current), 0);
          imageData = tf.div(imageData, tf.scalar(255));

          /*let output = generator_model.execute([imageData, randRef.current]);
          output = tf.squeeze(output, 0);

          await tf.browser.toPixels(output, outputRef.current);*/

          updateBackground(canvas);
        } catch(e) {
          console.error(e.message);
        }
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
      video.srcObject.getTracks().forEach(track => track.stop());
    };
  }, []);

  return <div className={a}>
    <canvas className={c} ref={canvasRef} width={256} height={256} />
    <canvas style={{left: '100px'}} className={c} ref={outputRef} width={256} height={256} />
    <canvas ref={node} width={size.w} height={size.h} />
    <button onClick={() => {
      randRef.current = tf.randomNormal([1, 126], 0, 1, 'float32');
    }}>random seed</button>
  </div>;
});
