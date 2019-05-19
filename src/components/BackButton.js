import React, {memo, useContext} from 'react';
import {RouterContext} from '../RouterContext';
import {Link} from '../utils/TransitionableRoute';

export default memo(function () {
  const {setRoute} = useContext(RouterContext);

  const onClick = e => {
    e.preventDefault();
    setRoute('/');
  };

  return <a href="/" className="back-button" onClick={onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="back-button__svg" width="50px" height="50px">
      <path className="back-button__square" stroke="#000" d="M.5.5h49v49H.5z"/>
      <path className="back-button__arrow" d="M20.7 27.8v-5.4L18 25.1l2.7 2.7z" fill="#fff"/>
      <path className="back-button__line" d="M20 25.1h13.2" fill="none" stroke="#fff"/>
    </svg>
  </a>
});
