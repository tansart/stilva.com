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
    maxWidth: `580px`,
    width: '50vw'
  };

  return <div className={cx('lab', 'page', `page--${transitionstate}`, direction)}>
    <BackButton path={'/'}/>
    <div className="content" style={{top: `-${offset}px`}}>
      <h1 className="client-name">Paperless Post</h1>
      <div className="blob">
        <h2 className="blob__title">Overview /</h2>
        <p>
          After 13 years working in agencies I had decided to move to a product company to work on larger scale applications,
          where I could build UIs and refine the work (both code and visual) based on user studies or A/B tests.
        </p>
      </div>
      <div className="blob">
        <h2 className="blob__title">My role /</h2>
        <p>
          At Paperless Post, I work as a senior software engineer in the <b>pages</b> team. I've worked on multiple UI projects, including but not limited to unifying components across teams, build the payment UIs, revamped some UI and added animations for a more delightful user experience.
        </p>
      </div>

      <video className="video" controls={false} autoPlay={true} loop={true}>
        <source src="/videos/paperless.01.mp4" type="video/mp4"/>
      </video>

      <video className="video" controls={false} autoPlay={true} loop={true} style={videoStyles}>
        <source src="/videos/paperless.02.mp4" type="video/mp4"/>
      </video>

      <video className="video" controls={false} autoPlay={true} loop={true} style={videoStyles}>
        <source src="/videos/paperless.03.mp4" type="video/mp4"/>
      </video>
    </div>
  </div>
});
