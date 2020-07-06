import React, {memo} from 'react';

export default memo(function Home() {
  return <>
    <h1>S&P Global</h1>
    <h2>Overview /</h2>
    <p>
      Firstborn was tasked to modernise S&amp;P Global’s fragmented ecosystem into a fully connected digital customer
      experience, across all their products and divisions.
    </p>
    <h2>My role /</h2>
    <p>
      Firstborn was in charge of designing, prototyping and developing the UI – while the backend and the integration
      was to be done by a third party.
    </p>
    <p>
      As the front-end lead I was tasked to build a patternlab based high fidelity prototype.
    </p>
    <h2>Tech notes /</h2>
    <p>
      The high fidelity prototype was built atop Patternlab, SCSS, jQuery, and Foundation's components.
    </p>
    <p>
      SSR was out of the question given the doubts over which platform and CMS the final product would be built on.
    </p>
    <picture>
      <source srcSet="/images/spglobal/desktop.png 1x" media="(min-width: 768px)"/>
      <source srcSet="/images/spglobal/tablet.png 1x, /images/spglobal/desktop.png 2x" media="(min-width: 425px)"/>
      <source srcSet="/images/spglobal/small.png 1x, /images/spglobal/small-retina.png 2x" media="(min-width: 0px)"/>
      <img src="/images/spglobal/preview.png" alt="Supercell"/>
    </picture>
  </>
});
