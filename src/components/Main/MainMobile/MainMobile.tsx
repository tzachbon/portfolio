import React from 'react';
import ClassNames from 'classnames';
import { WithClassName } from '../../../utils/types';
import { observer } from 'mobx-react';

interface Props extends WithClassName {}

const MainMobile: React.FC<Props> = ({ className }) => {
  className = ClassNames('main', 'main-mobile', className);

  return (
    <div className={className}>
      <video
        className='video-background'
        loop
        muted
        autoPlay
        src='assets/videos/planet.mp4'
      ></video>
    </div>
  );
};

export default observer(MainMobile);
