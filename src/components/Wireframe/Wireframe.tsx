import ClassNames from 'classnames';
import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { useSpring, animated } from 'react-spring';
import './Wireframe.scss';

interface Props {
  className?: string;
  fadeIn?: boolean;
}

const calc = (x: number, y: number) => [
  x - window.innerWidth / 2,
  y - window.innerHeight / 2
];
const trans1 = (x, y) => `translate3d(${x / 50}px,${y / 50}px,0)`;

const Wireframe: React.FC<Props> = ({ className, fadeIn }) => {
  //   const state = useLocalStore(() => ({
  //       isLoaded: t
  //   }));

  const [{ xy }, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 50, tension: 250, friction: 100 }
  }));

  className = ClassNames(className, 'wireframe', { fadeIn });

  return (
    <div
      className={className}
      onMouseMove={({ clientX, clientY }) =>
        set({ xy: calc(clientX, clientY) })
      }
    >
      <animated.div
        className='wireframe__lines'
        style={{ transform: xy.interpolate(trans1 as any) }}
      >
        <img src='assets/images/wireframe.png' />
      </animated.div>
    </div>
  );
};

export default observer(Wireframe);
