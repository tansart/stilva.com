import React, {memo} from 'react';

export default memo(function Home() {
  return <>
    <h1 className="work-name">Mountain Dew</h1>
    <div className="blob">
      <h2 className="blob__title">Overview /</h2>
      <p>
        Firstborn has long been in charge of Mountain Dew's web campaigns – from small scale to superbowl campaign scale
        websites.
      </p>
    </div>
    <div className="blob">
      <h2 className="blob__title">My role /</h2>
      <p>
        While at firstborn, I've lead multiple Mountain Dew projects, such as kickstart 2016 (Puppy Monkey Baby), the
        Dew label VR project, two "Q4" projects, etc.
      </p>
    </div>
    <div className="blob">
      <h2 className="blob__title">Tech notes /</h2>
      <p>
        Kickstart 2016 – react was used for this single page app, while the pipeline for pre-generating the few
        thousands of gifs from the static images from the content sudio was built with node.js, imagemagick and
        gifsicle.
      </p>
      <p>
        Dew label VR project – The VR video player for Samsung Galaxy was built in Java with Samsung's SDK
      </p>
      <p>
        Q4 projects – the 2015 version used react.js, rxjs, and clmtracker, while the 2016 version was based on react.js
        and rxjs
      </p>
    </div>
    <video controls className="video">
      <source src="/videos/mtndew.mp4" type="video/mp4"/>
    </video>
  </>
});
