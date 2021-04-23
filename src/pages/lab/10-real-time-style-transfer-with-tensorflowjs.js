import React, {memo, useEffect} from 'react';

import { genFacemesh, genStyletransfer, StyleTransfer } from './10-real-time-style-transfer-with-tensorflowjs/tf.facemesh';
import { pGetImage, toDataImage } from './10-real-time-style-transfer-with-tensorflowjs/utils';

export default memo(function () {
  const video = document.createElement('video');
  let generator = genFacemesh(video);

  useEffect(() => {
    pGetImage('/assets/adain/images/test.jpg').then(() => {
      console.log("TOTO");
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function(stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function(err) {
        console.log("An error occurred: " + err);
      });
  }, []);

  return <>
    <h1>Real-time style transfer on Android with mediapipe</h1>
  </>
});
