/* eslint-disable jsx-a11y/alt-text */
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useStores } from '../../store/context';
import Animation from '../../utils/3d/3d';
import { DESKTOP } from '../../utils/mobile';
import Button from '../Button/Button';
import './Main.scss';
import ClassNames from 'classnames';

interface Props extends RouteComponentProps {}

const SECTION_ROUTES = {
  aboutMe: 'about-me',
  myWork: 'my-work'
};

const Main: React.FC<Props> = ({ history }) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const state = useLocalStore(() => ({
    isZoomed: false,
    opacity: 1,
    isZoomEnded: false,
    loaded: 0,
    isNavitionInProgress: false,
    isLoaded() {
      return this.loaded >= 100;
    }
  }));
  const { store } = useStores();

  useEffect(() => {
    store.animation = new Animation(mainRef.current, !DESKTOP);

    const loading$ = store.animation.loadingStatus.subscribe(
      loaded => (state.loaded = loaded)
    );

    return loading$.unsubscribe;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMainClicked = () => {
    if (!state.isZoomed) {
      onUpdateOpacity();
      state.isZoomed = true;
      store.zoomIn();
    }
  };

  const onUpdateOpacity = () => {
    if (state.opacity > 0) {
      state.opacity -= 0.01;
      requestAnimationFrame(onUpdateOpacity);
    } else {
      state.isZoomEnded = true;
    }
  };

  const navigateBySection = (sectionName: 'aboutMe' | 'myWork') => {
    return () => {
      state.isNavitionInProgress = true;
      store.animation.zoomInOnSection(sectionName).then(() => {
        history.push(SECTION_ROUTES[sectionName]);
        state.isNavitionInProgress = false;
      });
    };
  };

  return (
    <div className='main' onClick={onMainClicked} ref={mainRef}>
      {!state.isLoaded() && (
        <div
          className='loaded'
          style={{
            background: `linear-gradient(0deg, rgba(0,0,0, 1) ${state.loaded}%), rgba(255, 255, 255, 1) ${state.loaded}%`
          }}
        ></div>
      )}
      <header>
        <h1
          style={{
            opacity: state.opacity
          }}
        >
          Portfolio
        </h1>
        <h3
          style={{
            opacity: state.opacity
          }}
        >
          By Tzach Bonfil
        </h3>
      </header>

      {state.isZoomEnded && (
        <div className='button-container'>
          <Button
            white
            onClick={navigateBySection('aboutMe')}
            className={ClassNames('about-me', {
              disable: state.isNavitionInProgress
            })}
          >
            About Me
          </Button>
          <Button
            white
            onClick={navigateBySection('myWork')}
            className={ClassNames('my-work', {
              disable: state.isNavitionInProgress
            })}
          >
            My Work
          </Button>
        </div>
      )}
    </div>
  );
};

export default observer(Main);
