import React, {memo} from 'react';
import {styleGuide} from "../../components";

export default memo(function Home() {
  return <>
    <h1>Fox Johnston</h1>
    <h2>Overview /</h2>
    <p>
      Coming off of Flash, this was one of my first few HTML/CSS/Javascript project while at Canvas Group in Sydney. The
      CMS was wordpress with podsCMS, along a custom plugin to output everything as JSON.
    </p>
    <p>
      Cufón was used for the webfonts, Objs was used to reflect the MVC architecture from my Flash projects, LESS for
      the stylesheets etc. The usual libraries such as jQuery, modernizr, and a tweening engine were also used.
    </p>
    <div className={styleGuide.awards}>
      <span className="list">
        Awwwards, ADGA
      </span>
    </div>
    <picture>
      <source srcSet="/images/foxjohnston/desktop.png 1x" media="(min-width: 768px)"/>
      <source srcSet="/images/foxjohnston/tablet.png 1x, /images/foxjohnston/desktop.png 2x"
              media="(min-width: 425px)"/>
      <source srcSet="/images/foxjohnston/small.png 1x, /images/foxjohnston/small-retina.png 2x"
              media="(min-width: 0px)"/>
      <img src="/images/foxjohnston/preview.png" alt="Supercell"/>
    </picture>
  </>
});
