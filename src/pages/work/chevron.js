import React, {memo} from 'react';

export default memo(function Home() {
  return <>
    <h1>Chevron</h1>
    <h2>Overview /</h2>
    <p>
      Chevron tasked firstborn to build an educational VR experience to show the St Malo deepwater oil project .
    </p>
    <p>
      I built a socket server that synchronised 50 Samsung VR headsets – initially built with firebase, then okHttp3
      to connect to an express.js based node.js server. The VR was built atop Mountain Dew's VR project, which was
      built on top of Samsung VR SDK
    </p>
    <picture>
      <source srcSet="/images/chevron/desktop.png 1x" media="(min-width: 768px)"/>
      <source srcSet="/images/chevron/tablet.png 1x, /images/chevron/desktop.png 2x" media="(min-width: 425px)"/>
      <source srcSet="/images/chevron/small.png 1x, /images/chevron/small-retina.png 2x" media="(min-width: 0px)"/>
      <img src="/images/chevron/preview.png" alt="Supercell"/>
    </picture>
  </>
});
