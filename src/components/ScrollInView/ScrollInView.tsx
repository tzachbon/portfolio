import ClassNames from 'classnames';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import GetChords from '../../utils/chords';

interface Props {
  className?: string;
}

const ScrollInView: React.FC<Props> = ({ className, children }) => {
  const state = useLocalStore(() => ({
    reqAnim: null,
    lastInviewTopCalc: 0,
    inViewElements: [],
    inViewTopPosArray: []
  }));

  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    let InViewWrapper = ref.current;
    if (InViewWrapper) {
      state.inViewElements = (InViewWrapper.querySelectorAll(
        '.animateInView'
      ) || []) as any[];
      inViewReCalc();
    }

    //window resize
    let resizeTimer;
    window.addEventListener(
      'resize',
      () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          onResize();
        }, 250);
      },
      false
    );

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(state.reqAnim);
    };
  }, [ref]);

  const handleScroll = () => {
    if (!state.inViewElements || state.inViewElements.length === 0) return;

    let scrollTop =
      window.pageYOffset || document.documentElement.scrollTop || 0;
    for (let i = 0; i < state.inViewElements.length; i++) {
      if (scrollTop > state.inViewTopPosArray[i] + 100) {
        state.inViewElements[i].classList.add('active');
      }
    }
  };

  //inView position top handler
  const inView = () => {
    let arr = [];
    for (let i = 0; i < state.inViewElements.length; i++) {
      arr.push(GetChords.getCoords(state.inViewElements[i]));
    }
    state.inViewTopPosArray = arr;
  };

  const inViewReCalc = (now = Date.now()) => {
    if (state.inViewElements || state.inViewElements.length > 0) {
      let activeElm = [];
      for (let i = 0; i < state.inViewElements.length; i++) {
        if (state.inViewElements[i].classList.contains('active')) {
          activeElm.push(i);
        }
      }
      if (activeElm.length >= state.inViewElements.length) return;
    } else {
      return;
    }

    // each 2 seconds call the inView() function
    if (!state.lastInviewTopCalc || now - state.lastInviewTopCalc >= 2 * 1000) {
      //console.log('inview calc!!!', state.inViewElements);
      state.lastInviewTopCalc = now;
      inView();
    }
    state.reqAnim = requestAnimationFrame(inViewReCalc);
  };

  //window resize
  const onResize = () => {
    inView();
  };

  className = ClassNames('ScrollInView', className);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default observer(ScrollInView);
