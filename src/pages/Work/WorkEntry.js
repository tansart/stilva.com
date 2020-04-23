import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import parsingComponents from '../../utils/parsingComponents';
import work from '../../work';

import useOnScroll from "../../hooks/useOnScroll";
import useTransitionDirection from "../../hooks/useTransitionDirection";
import BackButton from "../../components/BackButton";

export default memo(function Work({dir, state, transitionstate, query : {workId}}) {
  const data = work.get(workId);
  const offset = useOnScroll(transitionstate);
  const direction = useTransitionDirection(transitionstate);

  return  <div className={cx('work', 'page', `page--${transitionstate}`, direction)}>
    <BackButton path={'/work'} />
    <div className="content" style={{ top: `-${offset}px`}}>
      <h1 className="work-name">{data.label}</h1>
      {data.content.map((data, i) => {
        const props = {key: `content_${i}`, index: `${workId}_${i}`, ...data};
        return createElement(parsingComponents[data.type], props);
      })}
    </div>
  </div>
});
