import React, {memo} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import useOnScroll from '../../hooks/useOnScroll';

import BackButton from '../../components/BackButton';

import LabList from './LabList';
import LabEntry from './LabEntry';

export default memo(function Lab({transitionState, subCategory}) {
  const scrollY = useOnScroll(transitionState, subCategory);

  return <div className={cx('page--right', `page--${transitionState}`)}>
    <div
      key={subCategory}
      className={cx('client', 'lab')}
      style={{transform: `translate3d(0,-${scrollY}px,0)`}}
    >
      <BackButton path={subCategory ? `/lab/`: '/'} />
      {subCategory ? <LabEntry labId={subCategory} />: <LabList />}
    </div>
  </div>
});

export {
  LabList,
  LabEntry
}
