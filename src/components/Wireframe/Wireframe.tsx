import ClassNames from 'classnames';
import React, { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { useSpring, animated } from 'react-spring';
import './Wireframe.scss';
import { fromEvent } from 'rxjs';

interface Props {
  className?: string;
  fadeIn?: boolean;
}

const calc = (x: number, y: number) => [
  x - window.innerWidth / 2,
  y - window.innerHeight / 2
];
const trans = (x, y) => `translate3d(${x / 75}px,${y / 75}px,0)`;

const Wireframe: React.FC<Props> = ({ className, fadeIn }) => {
  const [{ xy }, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 50, tension: 250, friction: 100 }
  }));

  useEffect(() => {
    const sub$ = fromEvent(
      window,
      'mousemove'
    ).subscribe(({ clientX, clientY }: MouseEvent) =>
      set({ xy: calc(clientX, clientY) })
    );

    return () => sub$.unsubscribe();
  }, []);

  className = ClassNames(className, 'wireframe', { fadeIn });

  return (
    <div className={className}>
      <animated.div
        className='wireframe__lines'
        style={{ transform: xy.interpolate(trans as any) }}
      >
        <img src='assets/images/wireframe.png' />
      </animated.div>
    </div>
  );
};

export default observer(Wireframe);
