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

        </p>
      </div>
      <div className="blob">
        <h2 className="blob__title">My role /</h2>
        <p>

        </p>
      </div>
      <div className="blob">
        <h2 className="blob__title">Tech notes /</h2>
        <p>

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
