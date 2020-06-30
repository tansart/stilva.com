import React, {memo} from 'react';

export default memo(function Home() {
  return <>
    <h1 className="work-name">Australian Women's Weekly</h1>
    <div className="blob">
      <h2 className="blob__title">Overview /</h2>
      <p>
        In an effort to strengthen their online presence, Bauer Media had decided to move their wide range of Australian
        magazines online.
      </p>
      <p>
        I was part of a larger team that worked on the platform (react.js, with SSR and .NET as the backend tech) –
        while focusing on Australian Women's Weekly
      </p>
    </div>
    <picture className="picture">
      <source srcSet="/images/aww/desktop.png 1x" media="(min-width: 768px)"/>
      <source srcSet="/images/aww/tablet.png 1x, /images/aww/desktop.png 2x" media="(min-width: 425px)"/>
      <source srcSet="/images/aww/small.png 1x, /images/aww/small-retina.png 2x" media="(min-width: 0px)"/>
      <img src="/images/aww/preview.png" alt="Supercell"/>
    </picture>
  </>
});
