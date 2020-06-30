import React, {memo} from 'react';

export default memo(function Home() {
  return <>
    <h1 className="work-name">Supercell</h1>
    <div className="blob">
      <h2 className="blob__title">Overview /</h2>
      <p>
        Since late 2015 firstborn has been handling a lot of Supercell's non-game web presence, with project such as
        Clash of clans' website, clash royale's blog site, supercell's merchandise e-commerce store etc. Starting with
        Supercell's Boombeach game, we got the chance to be in charge of building their in-game news platform (hereon
        "inboxes").
      </p>
      <p>
        In late 2018, we've built an e-sport fantasy deck submission platform which amassed 6M+ submissions form gamers
        around the world.
      </p>
    </div>
    <div className="blob">
      <h2 className="blob__title">My role /</h2>
      <p>
        Almost from day one, I've been involved with a lot of the projects with Supercell, as a front-end lead.
      </p>
      <p>
        I've successfully lead the front-end development for the internationalisation of the Clash Royale blog, followed
        by the Clash of Clans website, our first in-game news platform, the shopify based e-commerce website along
        multiple developer tools.
      </p>
      <p>
        I was also in charge of building the backend (AWS lambda) for a campaign to generate custom videos for millions
        of users. In 2018, I built the front-end for an e-sport fantasy deck submission, which gathered 6M+ votes within
        2 weeks.
      </p>
    </div>
    <div className="blob">
      <h2 className="blob__title">Tech notes /</h2>

      <p>
        I've chosen preact over react in many of the projects, due to its smaller foot-print. For the same reasons I've
        picked Rollup as our go-to bundler for the inboxes. All front-end unit tests were written with jest.
      </p>

      <p>
        For the e-commerce website, I've written a lot of custom tools for better DX with shopify – a per-developer
        theme deployment system, CI server theme push with history, better browser reload with Shopify etc.
      </p>
    </div>
    <picture className="picture">
      <source srcSet="/images/supercell/desktop.png 1x" media="(min-width: 768px)"/>
      <source srcSet="/images/supercell/tablet.png 1x, /images/supercell/desktop.png 2x" media="(min-width: 425px)"/>
      <source srcSet="/images/supercell/small.png 1x, /images/supercell/small-retina.png 2x" media="(min-width: 0px)"/>
      <img src="/images/supercell/preview.png" alt="Supercell"/>
    </picture>
  </>
});
