export default new Map([
  ['paperlesspost', {
    label: 'Paperless Post'
  }],
  ['supercell', {
    label: 'Supercell',
    content: [
      {
        type: 'Paragraph',
        title: 'Overview',
        content: [
          `Since late 2015 firstborn has been handling a lot of Supercell's non-game web presence, with project such as
				Clash of clans' website, clash royale's blog site, supercell's merchandise e-commerce store etc. Starting with Supercell's Boombeach game, 
				we got the chance to be in charge of building their in-game news platform (hereon "inboxes").`,
          `In late 2018, we've built an e-sport fantasy deck submission platform which amassed 6M+ submissions form gamers around the world.`
        ]
      },
      {
        type: 'Paragraph',
        title: 'My role',
        content: [
          `Almost from day one, I've been involved with a lot of the projects with Supercell, as a front-end lead.`,
          `I've successfully lead the front-end development for the internationalisation of the Clash Royale blog, followed by the Clash of Clans website, our first in-game news platform, the shopify based e-commerce website along multiple developer tools.`,
          `I was also in charge of building the backend (AWS lambda) for a campaign to generate custom videos for millions of users. In 2018, I built the front-end for an e-sport fantasy deck submission, which gathered 6M+ votes within 2 weeks.`
        ]
      },
      {
        type: 'Paragraph',
        title: 'Tech notes',
        content: [
          `I've chosen preact over react in many of the projects, due to its smaller foot-print. For the same reasons I've picked Rollup as our go-to bundler for the inboxes. All front-end unit tests were written with jest.`,
          `For the e-commerce website, I've written a lot of custom tools for better DX with shopify – a per-developer theme deployment system, CI server theme push with history, better browser reload with Shopify etc.`
        ]
      },
      {
        type: 'Picture',
        title: 'Supercell',
        urls: [
          ['768', ['/images/supercell/desktop.png']],
          ['425', ['/images/supercell/tablet.png', '/images/supercell/desktop.png']],
          ['0', ['/images/supercell/small.png', '/images/supercell/small-retina.png']],
          ['preview', '/images/supercell/preview.png'],
        ]
      }
    ]
  }],
  ['spglobal', {
    label: 'S&P Global',
    content: [
      {
        type: 'Paragraph',
        title: 'Overview',
        content: [
          `Firstborn was tasked to modernise S&P Global’s fragmented ecosystem into a fully connected digital customer experience, across all their products and divisions.`
        ]
      },
      {
        type: 'Paragraph',
        title: 'My role',
        content: [
          `Firstborn was in charge of designing, prototyping and developing the UI – while the backend and the integration was to be done by a third party.`,
          `As the front-end lead I was tasked to build a patternlab based high fidelity prototype.`
        ]
      },
      {
        type: 'Paragraph',
        title: 'Tech notes',
        content: [
          `The high fidelity prototype was built atop Patternlab, SCSS, jQuery, and Foundation's components.`,
          `SSR was out of the question given the doubts over which platform and CMS the final product would be built on.`
        ]
      },
      {
        type: 'Picture',
        title: 'S&P Global',
        urls: [
          ['768', ['/images/spglobal/desktop.png']],
          ['425', ['/images/spglobal/tablet.png', '/images/spglobal/desktop.png']],
          ['0', ['/images/spglobal/small.png', '/images/spglobal/small-retina.png']],
          ['preview', '/images/spglobal/preview.png'],
        ]
      }
    ]
  }],
  ['mtndew', {
    label: 'Mountain Dew',
    content: [
      {
        type: 'Paragraph',
        title: 'Overview',
        content: [
          `Firstborn has long been in charge of Mountain Dew's web campaigns – from small scale to superbowl campaign scale websites.`
        ]
      },
      {
        type: 'Paragraph',
        title: 'My role',
        content: [
          `While at firstborn, I've lead multiple Mountain Dew projects, such as kickstart 2016 (Puppy Monkey Baby), the Dew label VR project, two "Q4" projects, etc.`
        ]
      },
      {
        type: 'Paragraph',
        title: 'Tech notes',
        content: [
          `Kickstart 2016 – react was used for this single page app, while the pipeline for pre-generating the few thousands of gifs from the static images from the content sudio was built with node.js, imagemagick and gifsicle.`,
          `Dew label VR project – The VR video player for Samsung Galaxy was built in Java with Samsung's SDK`,
          `Q4 projects – the 2015 version used react.js, rxjs, and clmtracker, while the 2016 version was based on react.js and rxjs`
        ]
      },
      {
        type: 'Video',
        src: '/videos/mtndew.mp4'
      },
    ]
  }],
  ['chevron', {
    label: 'Chevron',
    content: [
      {
        type: 'Paragraph',
        title: 'Chevron',
        date: '2017',
        content: [
          `Chevron tasked firstborn to build an educational VR experience to show the St Malo deepwater oil project .`,
          `I built a socket server that synchronised 50 Samsung VR headsets – initially built with firebase, then okHttp3 to connect to an express.js based node.js server. The VR was built atop Mountain Dew's VR project, which was built on top of Samsung VR SDK`
        ]
      },
      {
        type: 'Picture',
        title: 'Chevron',
        urls: [
          ['768', ['/images/chevron/desktop.png']],
          ['425', ['/images/chevron/tablet.png', '/images/chevron/desktop.png']],
          ['0', ['/images/chevron/small.png', '/images/chevron/small-retina.png']],
          ['preview', '/images/chevron/preview.png'],
        ]
      },
    ]
  }],
  ['aww', {
    label: 'AWW',
    content: [
      {
        type: 'Paragraph',
        title: 'AWW online',
        date: '2014',
        content: [
          `In an effort to strengthen their online presence, Bauer Media had decided to move their wide range of Australian magazines online.`,
          `I was part of a larger team that worked on the platform (react.js, with SSR and .NET as the backend tech) – while focusing on Australian Women's Weekly`
        ]
      },
      {
        type: 'Picture',
        title: 'Australian Women Weekly',
        urls: [
          ['768', ['/images/aww/desktop.png']],
          ['425', ['/images/aww/tablet.png', '/images/aww/desktop.png']],
          ['0', ['/images/aww/small.png', '/images/aww/small-retina.png']],
          ['preview', '/images/aww/preview.png'],
        ]
      },
    ]
  }],
  ['jwi', {
    label: 'JWI Louvers',
    content: [
      {
        type: 'Paragraph',
        title: 'JWI Louvres',
        date: '2011',
        awards: [
          `Awwwards`,
          `ADGA`
        ],
        content: [
          `While switching between AS3 (a few Adobe Air projects) and the HTML/CSS/JS stack projects at Canvas Group, I got the change to work on Fox Johnston's new Wordpress based website.`,
          `I tried to push what was possible with CSS at that time, and I had decided to use some "cutting edge" CSS features, while making sure everything was progressively enhanced to support IE8.`,
          `The tech stack was very similar to FoxJohnston's: jQuery, Objs, modernizr etc. I may have switched from LESS to SCSS around that time.`
        ]
      },
      {
        type: 'Picture',
        title: 'JWI Louvres',
        urls: [
          ['768', ['/images/jwi/desktop.png']],
          ['425', ['/images/jwi/tablet.png', '/images/jwi/desktop.png']],
          ['0', ['/images/jwi/small.png', '/images/jwi/small-retina.png']],
          ['preview', '/images/jwi/preview.png'],
        ]
      },
    ]
  }],
  ['foxjohnston', {
    label: 'Fox Johnston',
    content: [
      {
        type: 'Paragraph',
        title: 'Fox Johnston',
        date: '2011',
        awards: [
          `Awwwards`,
          `ADGA`
        ],
        content: [
          `Coming off of Flash, this was one of my first few HTML/CSS/Javascript project while at Canvas Group in Sydney. The CMS was wordpress with podsCMS, along a custom plugin to output everything as JSON.`,
          `Cufón was used for the webfonts, Objs was used to reflect the MVC architecture from my Flash projects, LESS for the stylesheets etc. The usual libraries such as jQuery, modernizr, and a tweening engine were also used.`
        ]
      },
      {
        type: 'Picture',
        title: 'Fox Johnston',
        urls: [
          ['768', ['/images/foxjohnston/desktop.png']],
          ['425', ['/images/foxjohnston/tablet.png', '/images/foxjohnston/desktop.png']],
          ['0', ['/images/foxjohnston/small.png', '/images/foxjohnston/small-retina.png']],
          ['preview', '/images/foxjohnston/preview.png'],
        ]
      }
    ]
  }]
]);
