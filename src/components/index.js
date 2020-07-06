import React from 'react';
import {css} from 'linaria';

import Code from './Code';
import Video from './Video';

const styleGuide = {
  awards: css`
    display: block;
    margin: 0 auto 14px;
    position: relative;
    width: 100%;
    
    &:before {
      background: black;
      content: '';
      display: inline-block;
      height: 1px;
      position: relative;
      max-width: 45px;
      vertical-align: middle;
      width: 5vw;
    }
    
    .list {
      list-style-type: none;
      margin: 0;
      padding: 0 0 0 1rem;
    }
  `,
  picture: css`
    display: block;
    margin: 0 auto;
    position: relative;
    width: 100%;

      img {
        display: block;
        height: auto;
        position: relative;
        width: 100%;
      }
  `
};

export {
  Code,
  styleGuide,
  Video
}
