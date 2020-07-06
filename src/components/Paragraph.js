import React from 'react';
import {css} from 'linaria';

const p = css`
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  color: black;
  //letter-spacing: -0.03vw;
  line-height: 1.5;
  margin: .5em 0 1em;
  //word-spacing: 0.05vw;
  
  a {
    border-bottom: 1px solid black;
    color: black;
    display: inline;
    margin: 0;
    position: relative;
    text-decoration: none;
  }
`;

export default function ({children}) {
  return <p className={p}>{children}</p>;
}
