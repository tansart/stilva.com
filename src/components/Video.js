import React, {useEffect, useRef, useState} from 'react';
import {css} from 'linaria';

const placeholder = css`
  display: block;
  height: 0;
  max-width: 624px;
  position: relative;
  width: 100%;
`;

const video = css`
  display: block;
  margin: 0 auto;
  max-width: 624px;
  position: relative;
  width: 100%;
`;

export default function Video({src, enabled, ratio, ...props}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) {
      return noop;
    }

    let options = {
      rootMargin: '0px',
      threshold: .65
    }

    let callback = (entries, observer) => {
      entries.forEach(entry => {
        setIsPlaying(entry.isIntersecting);
      });
    };

    const target = ref.current;
    const observer = new IntersectionObserver(callback, options);
    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled)
      return noop;

    if (isPlaying) {
      (ref.current.play() || Promise.resolve()).catch(error => {
        console.error('An error occured while trying to play a video');
      });
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  if (!enabled) {
    return <div className={placeholder} style={{
      marginTop: `${ratio * 100}%`,
    }}/>
  }

  return <video className={video} loop={true} ref={ref} {...props} >
    <source src={src} type="video/mp4"/>
  </video>
}

function noop() {
}
