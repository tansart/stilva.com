import React, {memo, useEffect, useRef, useState} from 'react';
import cx from "classnames";

import useOnScroll from "../hooks/useOnScroll";
import useTransitionDirection from "../hooks/useTransitionDirection";

import BackButton from "../components/BackButton";

export default memo(function Home({transitionstate}) {
  const offset = useOnScroll(transitionstate);
  const direction = useTransitionDirection(transitionstate);

  const isVideoEnabled = transitionstate === 'entered';

  return <div className={cx('lab', 'page', `page--${transitionstate}`, direction)}>
    <BackButton path={'/'}/>
    <div className="content" style={{top: `-${offset}px`}}>
      <h1 className="client-name">Paperless Post</h1>
      <div className="blob">
        <h2 className="blob__title">Overview /</h2>
        <p>
          After 13 years working in agencies I decided to move to a product company to work on larger scale applications,
          where I could build UIs and refine the work (code, visual, and user experience as a whole) based on user studies, A/B tests and data.
        </p>
      </div>
      <div className="blob">
        <h2 className="blob__title">My role /</h2>
        <p>
          At Paperless Post, I work as a senior software engineer – since April 2019 – as part of the Pages team. I've worked on multiple UI projects, including but not limited to unifying components across teams, building the payment UIs, revamped some UI and added animations for a more delightful user experience.
        </p>
        <p>
          Moreover I've done a lot of work on improving bundle size (a lot of next.js/webpack config tweaks), improving and creating internal tools (internal temporar A/B testing framework, improving an old school rails sass build system process by 60+ folds), and much more.
        </p>
      </div>
      <div className="blob">
        <h2 className="blob__title">Shallow dive /</h2>

        <p>
          I thought I would highlight some of the UI work I've done in the last few months. I'll go over the checkout UIs I've built, followed by some major UI revamps I've done in the manage section, and lastly some more UI work I've done in the RSVP flow.
        </p>

        <p>
          Below is a prototype of the UI work I've done on some of our checkout UI. Based on the <a href="https://medium.com/google-design/the-evolution-of-material-designs-text-fields-603688b3fe03" target="_blank" >previous iteration</a> of <a href="https://material.io/" target="_blank" >Material design</a> and built with <a href="https://github.com/stripe/react-stripe-elements" target="_blank" >react stripe elements</a>.
          Given the solid foundations of Material design, the difficulties lied with getting the Stripe and non-Stripe elements to interact and animate similarly – Stripe uses iframes in order to keep all the Credit Card information in their "context", so it was difficult to get everything animating the same.<br />
          We are planning to update the textfield components to follow the latest Material design guidelines, and to then unify some of the other input fields to use the same components.
        </p>

        <Video src="/videos/cards.mp4" enabled={isVideoEnabled} ratio={532/900} />

        <p>
          The manage section, is where you can see all your past/current/future events at a glance. The initial UI needed some updating – it did not show enough event related data, did not offer the user enough control, and was adaptive instead of being responsive.<br />
          On top of the new features, one of my top priority was to add some subtle but enticing animations.
        </p>

        <Video src="/videos/simple.1.mp4" enabled={isVideoEnabled} ratio={780/900} />

        <p>
          Based on the exploration above, I had also tried adding some scaling to the card. Unfortunately, this animation had some visual defects – fonts antialiasing, overall business with the various colours, and different text layouts.
        </p>

        <Video src="/videos/simple.2.mp4" enabled={isVideoEnabled} ratio={780/900} />

        <p>
          I made some further tweaks to the my original prototype, by trying to incorporate some of the scaling to the thumbnail alone.
        </p>

        <Video src="/videos/simple.3.mp4" enabled={isVideoEnabled} ratio={780/900} />

        <p>
          Ultimately though, the final animation was based on the first iteration, but without the text animating in.
          This made both the HTML simpler, and worked better with majority of the data that can be see on production.
        </p>

        <Video src="/videos/simple.4.mp4" enabled={isVideoEnabled} ratio={780/900} />

        <p>
          Lately, I've been working on a revisited RSVP flow, which is being released as an A/B test.
          As part of this work, I've teamed up with our product designer to update some of our older and static UIs – one of which is our toggle / tab UI.
          The following is our current iteration that is on production.<br/>
          This was the version that felt most consistent as part of the larger UI, and anecdotally worked the best across mobile and desktop.
        </p>

        <Video src="/videos/yes.no.mp4" enabled={isVideoEnabled} ratio={270/894} />
      </div>
    </div>
  </div>
});

function Video({src, enabled, ratio, ...props}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if(!enabled) {
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
    if(!enabled)
      return noop;

    if(isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  if(!enabled) {
    return <div style={{
      display: 'block',
      height: 0,
      marginTop: `${ratio * 100}%`,
      position: 'relative',
      width: '100%'
    }} />
  }

  return <video className="video" loop={true} ref={ref} {...props} >
    <source src={src} type="video/mp4"/>
  </video>
}

function noop() {}
