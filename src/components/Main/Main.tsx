/* eslint-disable jsx-a11y/alt-text */
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useStores } from '../../store/context';
import { SECTION_ROUTES } from './../../store/store';
import Animation from '../../utils/3d/3d';
import { DESKTOP } from '../../utils/mobile';
import Button from '../Button/Button';
import './Main.scss';
import ClassNames from 'classnames';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { startCase } from 'lodash';

interface Props extends RouteComponentProps {}

const Main: React.FC<Props> = ({ history, location }) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const state = useLocalStore(() => ({
    isZoomed: false,
    opacity: 1,
    isZoomEnded: false,
    loaded: 0,
    isNavitionInProgress: false,
    loadingSection: '',
    buttons: {
      top: ['aboutMe', 'myWork'],
      bottom: ['workFlow', 'contactMe']
    },
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

  useEffect(() => {
    store.animation.enablePlanetRotation = location.pathname === '/';
  }, [location]);

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

  const navigateBySection = (sectionName: keyof typeof SECTION_ROUTES) => {
    return () => {
      state.loadingSection = sectionName;
      state.isNavitionInProgress = true;
      store.animation.zoomInOnSection(sectionName).then(() => {
        const route = SECTION_ROUTES[sectionName];
        if (route) {
          history.push(route);
          state.isNavitionInProgress = false;
          state.loadingSection = '';
        }
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
          {Object.entries(state.buttons).map(([containerName, buttons], i) => (
            <div
              key={`containerName_${containerName}__${i}`}
              className={containerName}
            >
              {buttons.map((buttonName: keyof typeof SECTION_ROUTES, i) => (
                <Button
                  key={`button__${buttonName}__${i}`}
                  white
                  onClick={navigateBySection(buttonName)}
                  className={ClassNames(SECTION_ROUTES[buttonName], {
                    disable: state.isNavitionInProgress
                  })}
                >
                  <div className='button-content'>
                    {state.loadingSection === buttonName && <LoadingSpinner />}
                    <span className='label'>{startCase(buttonName)}</span>
                  </div>
                </Button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default observer(Main);
