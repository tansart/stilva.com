import React, {memo} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import useOnScroll from '../../hooks/useOnScroll';

import BackButton from '../../components/BackButton';

import LabList from './LabList';
import LabEntry from './LabEntry';

export default memo(function Lab({transitionState, labId}) {
  const scrollY = useOnScroll(transitionState, labId);

  return <div className={cx('page--right', `page--${transitionState}`)}>
    <div
      key={labId}
      className={cx('client', 'lab')}
      style={{transform: `translate3d(0,-${scrollY}px,0)`}}
    >
      <BackButton path={labId ? `/lab/`: '/'} />
      {labId ? <LabEntry labId={labId} />: <LabList />}
    </div>
  </div>
});

export {
  LabList,
  LabEntry
}
