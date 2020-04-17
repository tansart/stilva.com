import React, {memo} from 'react'; // eslint-disable-line no-unused-vars
import cx from 'classnames';

import data from '../../lab';
import CategoryLink from "../../components/CategoryLink";
import useOnScroll from "../../hooks/useOnScroll";
import useTransitionDirection from "../../hooks/useTransitionDirection";
import BackButton from "../../components/BackButton";

export default memo(function LabList({transitionstate}) {
  const offset = useOnScroll(transitionstate);
  const direction = useTransitionDirection(transitionstate);

  return <div className={cx('lab', 'page', `page--${transitionstate}`, direction)}>
    <BackButton path={'/'} />
    <div className="content" style={{ top: `-${offset}px`}}>
      {Object.keys(data)
        .map(k =>
          <CategoryLink key={`title_${k}`} link={`/lab/${k}`} label={`${data[k].title}`}/>
        )
      }
    </div>
  </div>
});
