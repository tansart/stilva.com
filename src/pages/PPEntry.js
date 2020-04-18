import React, {memo} from 'react';
import cx from "classnames";

import useOnScroll from "../hooks/useOnScroll";
import useTransitionDirection from "../hooks/useTransitionDirection";

import BackButton from "../components/BackButton";

export default memo(function Home({transitionstate}) {
  const offset = useOnScroll(transitionstate);
  const direction = useTransitionDirection(transitionstate);

  const videoStyles = {
    margin: `0 auto`,
    maxWidth: `100%`,
    width: '100%'
  };

  return <div className={cx('lab', 'page', `page--${transitionstate}`, direction)}>
    <BackButton path={'/'}/>
    <div className="content" style={{top: `-${offset}px`}}>
      <h1 className="client-name">Paperless Post</h1>
      <div className="blob">
        <h2 className="blob__title">Overview /</h2>
        <p>
          After 13 years working in agencies I had decided to move to a product company to work on larger scale applications,
          where I could build UIs and refine the work (both code, visual, and user experience) based on user studies, A/B tests and data.
        </p>
      </div>
      <div className="blob">
        <h2 className="blob__title">My role /</h2>
        <p>
          At Paperless Post, I work as a senior software engineer as part of the Pages team. I've worked on multiple UI projects, including but not limited to unifying components across teams, building the payment UIs, revamped some UI and added animations for a more delightful user experience.
        </p>
        <p>
          Moreover I've done a lot of work on improving bundle size (a lot of webpack tweaks), improving and creating internal tools (internal temporar A/B testing framework, improving an old school rails sass build system process by 60+ folds and much more).
        </p>
      </div>
      <div className="blob">
        <h2 className="blob__title">Shallow dive /</h2>

        <p>
          Below is a prototype of the UI work I've done on some of our checkout UI. Based on the <a href="https://medium.com/google-design/the-evolution-of-material-designs-text-fields-603688b3fe03">previous iteration</a> of <a href="https://material.io/">Material design</a> and built with <a href="https://github.com/stripe/react-stripe-elements">react stripe elements</a>.
          Given the solid foundations of Material design, the difficulties lied with getting the Stripe and non-Stripe elements to interact and animate similarly – Stripe uses iframes in order to keep all the Credit Card information in their context, so it was difficult to get everything animating the same.
        </p>

        <video className="video" controls={false} autoPlay={true} loop={true}>
          <source src="/videos/cards.mp4" type="video/mp4"/>
        </video>

        <p>
          A big undertake was to move some of our microservices into a new GraphQL based middle layer. A lot of the work I have done were around unifying some of the APIs, along updating and adding some much needed animations. Below are a few of the explorations I have done:
        </p>

        <p>
          Upon first seeing the design, the first exploration was with some masking – this was following some of the other animations I had done earlier.
        </p>

        <video className="video" controls={false} autoPlay={true} loop={true}>
          <source src="/videos/simple.1.mp4" type="video/mp4"/>
        </video>

        <p>
          Based on the exploration above, I had also tried adding some scaling. Unfortunately, this animation had some visual defects – fonts antialiasing, overall business with the various colours, and different text layouts.
        </p>

        <video className="video" controls={false} autoPlay={true} loop={true}>
          <source src="/videos/simple.2.mp4" type="video/mp4"/>
        </video>

        <p>
          I made some further tweaks to the original, by trying to incorporate some of the scaling by to a smaller portion.
        </p>

        <video className="video" controls={false} autoPlay={true} loop={true}>
          <source src="/videos/simple.3.mp4" type="video/mp4"/>
        </video>

        <p>
          Ultimately though, the final animation was based on the first iteration, but without the text masking. This made both the HTML simpler, and worked better with majority of the assets that can see on production.
        </p>

        <video className="video" controls={false} autoPlay={true} loop={true}>
          <source src="/videos/simple.4.mp4" type="video/mp4"/>
        </video>

        <p>
          Lately, I've been working on a revisited RSVP flow which is being released as an A/B test. As part of this work, I've teamed up with our product designer to update some of our older and static UIs – one of which is our toggle / tab UI. The following is our current iteration that is on production.<br/>
          This was the version that felt most consistent as part of the larger UI, and anecdotally worked the best across mobile and desktop.
        </p>

        <video className="video" controls={false} autoPlay={true} loop={true}>
          <source src="/videos/yes.no.mp4" type="video/mp4"/>
        </video>
      </div>
    </div>
  </div>
});
