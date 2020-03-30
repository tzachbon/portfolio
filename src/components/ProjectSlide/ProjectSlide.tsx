import { Fade } from '@material-ui/core';
import ClassNames from 'classnames';
import { startCase } from 'lodash';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import Viewer from 'react-viewer';
import { useStores } from '../../store/context';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import { Slide } from '../SlideShow/SlideShow';
import './ProjectSlide.scss';

interface Props {
  className?: string;
  slide: Slide | null;
  show?: boolean;
}

const ProjectSlide: React.FC<Props> = ({ className, slide, show }) => {
  const { slider } = useStores();

  const state = useLocalStore(() => ({
    modalOpen: false,
    activeIndex: 0,
    isFirst: false,
    isLast: false
  }));

  useEffect(() => {
    state.isFirst = slider.slides[0] === slide;
    state.isLast = slider.slides[slider.slides.length - 1] === slide;
  }, [slide]);

  className = ClassNames(className, 'slide-data');

  if (typeof show !== 'boolean') show = true;

  const openLink = (link: string) => {
    if (!link) return;

    window.open(link);
  };

  const openImageModal = (activeIndex: number) => {
    state.modalOpen = true;
    state.activeIndex = activeIndex;
  };

  return (
    <Fade in={show}>
      <div className={className}>
        {!!slide ? (
          <>
            <article>
              <h1 className='title-line'>
                <span>{startCase(slide.name)}</span>
              </h1>

              <p>{slide.desc}</p>
              {slide.link && (
                <Button onClick={() => openLink(slide.link)}>
                  <Icon type='arrow-right' />
                  <span>See Project</span>
                </Button>
              )}
            </article>
            <div className='project-images'>
              {slide.images.map((img, i) => (
                <div
                  key={`${img}___${i}`}
                  onClick={e => openImageModal(i)}
                  className='img'
                  style={{ backgroundImage: `url(${img})` }}
                />
              ))}
            </div>
            <div className='buttons-container'>
              <Button white onClick={slider.goPrevious}>
                <Icon type='arrow-left' />
                <span>Previous</span>
              </Button>
              <Button white onClick={slider.goNext}>
                <span>Next</span>
                <Icon type='arrow-right' />
              </Button>
            </div>
            <Viewer
              visible={state.modalOpen}
              onClose={() => (state.modalOpen = false)}
              activeIndex={state.activeIndex}
              drag={false}
              zoomable={false}
              scalable={false}
              rotatable={false}
              images={slide.images.slice().map(src => ({ src }))}
            />
          </>
        ) : (
          <div></div>
        )}
      </div>
    </Fade>
  );
};

export default observer(ProjectSlide);
