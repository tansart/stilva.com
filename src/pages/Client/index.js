import React, {memo} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import useOnScroll from '../../hooks/useOnScroll';

import BackButton from '../../components/BackButton';

import ClientList from './ClientIndex';
import ClientEntry from './ClientEntry';

import {TransitionA} from '../../utils/TransitionableRoute';

export default memo(function Client({clientId, transitionState}) {
  const scrollY = useOnScroll(transitionState, clientId);

  return <div className={cx('page--right', `page--${transitionState}`)}>
    <div
      className={cx('client', 'lab')}
      style={{transform: `translate3d(0,-${scrollY}px,0)`}}
    >
      <BackButton path={clientId ? `/client/`: '/'} />

      <TransitionA path={'/client'} timeout={850}>
        <ClientList path={`/`} />
        <ClientEntry path={`/:clientId`} />
      </TransitionA>
    </div>
  </div>
});

export {
  ClientList,
  ClientEntry
};
