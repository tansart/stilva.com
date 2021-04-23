import React, {memo} from 'react';
import {Video} from '../../components';

export default memo(function Home({transitionstate}) {
  const isVideoEnabled = transitionstate === 'entered';

  return <>
    <h1>Paperless Post</h1>
    <h2>Overview /</h2>
    <p>
      After 13 years working in agencies I decided to move to a product company to work on larger scale applications,
      where I could build UIs and refine the work (code, visual, and user experience as a whole) based on user
      studies, A/B tests and data.
    </p>
    <h2>My role /</h2>
    <p>
      At Paperless Post, I work as a senior software engineer (since April 2019) as part of the WEB team. I've
      worked on multiple UI projects, including but not limited to building and revamping UIs and adding some subtle animations for a more delightful user experience.
    </p>
    <p>
      Moreover I've done a lot of work on improving bundle size (next.js/webpack config tweaks), improving
      and creating internal tools (internal interim A/B testing framework, improving an old school rails sass build
      system process by 60 fold), and more.
    </p>
    <h2>Shallow dive /</h2>
    <p>
      I thought I would highlight some of the UI work I've done in the last few months. I'll go over the checkout UIs
      I've built, followed by some UI revamps I've worked on in the manage section, and lastly some more UI work I've
      done in the RSVP flow.
    </p>
    <p>
      Below is a prototype of the UI work I've built on some of our checkout UI. Based on the <a
      href="https://medium.com/google-design/the-evolution-of-material-designs-text-fields-603688b3fe03"
      target="_blank">previous iteration</a> of <a href="https://material.io/" target="_blank">Material design</a> and
      built with <a href="https://github.com/stripe/react-stripe-elements" target="_blank">react stripe elements</a>.
      Given the solid foundations of Material design, the difficulties lied with getting the Stripe and non-Stripe
      elements to interact and animate seamlessly – Stripe uses iframes in order to keep all the sensitive customer
      information in their "context", so it was an interesting challenge.<br/>
    </p>
    <Video src="/videos/cards.mp4" enabled={isVideoEnabled} ratio={532 / 900}/>
    <p>
      The manage section, is where you can see all your past/current/future events at a glance. The initial UI needed
      some updating – it did not show enough event related data, did not offer the user enough control, and was
      adaptive instead of being responsive.<br/>
      On top of the new features, one of my top priority was to add some subtle but enticing animations.
    </p>
    <Video src="/videos/simple.1.mp4" enabled={isVideoEnabled} ratio={780 / 900}/>
    <p>
      Based on the exploration above, I had also tried adding some scaling to the card. Unfortunately, this animation
      had some visual defects – fonts antialiasing, overall busyness with the various colours, and different text
      layouts.
    </p>
    <Video src="/videos/simple.2.mp4" enabled={isVideoEnabled} ratio={780 / 900}/>
    <p>
      I made some further tweaks to the my original prototype, by trying to incorporate some of the scaling to the
      thumbnail alone.
    </p>
    <Video src="/videos/simple.3.mp4" enabled={isVideoEnabled} ratio={780 / 900}/>
    <p>
      Ultimately though, the final animation was based on the first iteration, but without the text animating in.
      This made both the HTML simpler, and worked better with majority of the data that can be see on production.
      (the animations were further simplified on production around March 2021)
    </p>
    <Video src="/videos/simple.4.mp4" enabled={isVideoEnabled} ratio={780 / 900}/>
    <p>
      Lately, I've been working on a revisited RSVP flow, which is being released as an A/B test.
      As part of this work, I've teamed up with our product designer to update some of our older and static UIs – one
      of which is our toggle / tab UI.
      The following is our current iteration that is on production.<br/>
      This was the version that felt most consistent as part of the larger UI, and anecdotally worked the best across
      mobile and desktop.
    </p>
    <Video src="/videos/yes.no.mp4" enabled={isVideoEnabled} ratio={270 / 894}/>
  </>
});
