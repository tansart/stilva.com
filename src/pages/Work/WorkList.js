import React, {memo} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import work from '../../work';
import CategoryLink from "../../components/CategoryLink";

import useOnScroll from "../../hooks/useOnScroll";
import useTransitionDirection from "../../hooks/useTransitionDirection";
import BackButton from "../../components/BackButton";

export default memo(function WorkList({dir, transitionstate}) {
  const list = [];
  const offset = useOnScroll(transitionstate);
  const direction = useTransitionDirection(transitionstate);

  for(const k of work.keys()) {
    list.push(<CategoryLink key={`work_title_${k}`} link={`/work/${k}`} label={work.get(k).label} />);
  }

  return  <div className={cx('work', 'page', `page--${transitionstate}`, direction)}>
    <BackButton path={'/'} />
    <div className="content" style={{ top: `-${offset}px`}}>
      <div key="work-list">
        {list}
      </div>
    </div>
  </div>
});

