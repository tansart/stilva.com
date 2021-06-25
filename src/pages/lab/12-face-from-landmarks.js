import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {css, cx} from 'linaria';
import loadable from "@loadable/component";

const Webcam = loadable(() => import('./12-face-from-landmarks/Webcam'));

export default memo(function () {
  return <>
    <h1>Face from landmarks</h1>
    <Webcam />
  </>
});
