import React from 'react';

export default function (props) {
  return <video controls className="video">
    <source src={props.src} type="video/mp4"/>
  </video>
}
