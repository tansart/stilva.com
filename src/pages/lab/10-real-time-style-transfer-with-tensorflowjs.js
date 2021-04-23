import React, {memo, useEffect, useRef} from 'react';

import { facemeshFactory, StyleTransferHelper } from './10-real-time-style-transfer-with-tensorflowjs/tf.facemesh';
import GLSL from "@stilva/glsl";

export default memo(function () {
  const node = useRef();
  const video = document.createElement('video');

  useEffect(() => {
    let generator;

    const styleTransferHelper = new StyleTransferHelper();
    const glsl = new GLSL(node.current, {webglVersion: 'webgl'});
    glsl.addVariable('u_delta', [0, 2, 4]);

    video.addEventListener('loadeddata', async () => {
      generator = await facemeshFactory(video);
      await styleTransferHelper.init(video.videoWidth, video.videoHeight);
      await styleTransferHelper.setStyle('/assets/adain/images/style_03.png');

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
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

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch(function(err) {
        console.log("An error occurred: " + err);
      });

    return () => {
      glsl.kill();
      generator.kill();
      styleTransferHelper.destroy();
      video.srcObject.getTracks().forEach(track => track.stop());
    };
  }, []);

  return <>
    <h1>Real-time style transfer with tensorflow.js</h1>
    <canvas ref={node} width={640} height={400} />
  </>
});
