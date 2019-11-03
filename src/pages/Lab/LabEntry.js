import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import data from '../../lab';
import clientComponents from '../../utils/clientComponents';
import useOnScroll from "../../hooks/useOnScroll";
import useTransitionDirection from "../../hooks/useTransitionDirection";
import BackButton from "../../components/BackButton";

export default memo(function Lab({query: {labId}, transitionstate}) {
  const offset = useOnScroll(transitionstate);
  const direction = useTransitionDirection('lab-entry', transitionstate);

  return <div className={cx('lab', 'page', `page--${transitionstate}`, direction)}>
    <BackButton path={'/lab'} />
    <div className="content" style={{ top: `-${offset}px`}}>
      <h1 className="client-name">{data[labId].title}</h1>
      {data[labId].content.map((data, i) => {
        const props = {key: `content_${i}`, index: `${labId}_${i}`, ...data};
        return createElement(clientComponents[data.type], props);
      })}
    </div>
  </div>
});
