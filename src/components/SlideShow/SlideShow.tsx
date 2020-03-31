import ClassNames from 'classnames';
import { observer, useLocalStore } from 'mobx-react';
import React, { useLayoutEffect, useRef } from 'react';
import Swiper from 'react-id-swiper';
import { Subscription } from 'rxjs';
import { useStores } from '../../store/context';
import './SlideShow.scss';
import { DESKTOP } from '../../utils/mobile';
export interface Slide {
  name: string;
  images: string[];
  desc: string;
  link: string;
}

interface Props {
  className?: string;
  onSlideChange: (slide: Slide) => any;
}

const SlideShow: React.FC<Props> = ({ className, onSlideChange }) => {
  const containerRef = useRef<HTMLDivElement>();

  const { slider } = useStores();

  const state: { oldActiveNode: Element; activeId: string } = useLocalStore(
    () => ({
      oldActiveNode: null,
      get activeId() {
        return this.oldActiveNode?.name;
      }
    })
  );
  className = ClassNames(className, 'SlideShow');

  const setActiveRef = () => {
    const oldRef = document.querySelector('.swiper-slide-active');
    const { swiper } = slider;

    if (oldRef !== state.oldActiveNode && oldRef) {
      state.oldActiveNode = oldRef;
      const currentSlide = slider.slides.find(
        ({ name }) => name === state.oldActiveNode.id
      );

      if (DESKTOP) {
        swiper.setTranslate(swiper.getTranslate() - 80);
      }

      onSlideChange(currentSlide);
    }
  };

  useLayoutEffect(() => {
    setActiveRef();
    const wrapper = document.querySelector('.swiper-wrapper');
    if (wrapper) {
      wrapper.childNodes.forEach(node => {
        const observer = new MutationObserver(setActiveRef);
        observer.observe(node, {
          attributes: true,
          attributeFilter: ['class'],
          childList: false,
          characterData: false
        });
      });
    }

    const subscriptions = new Subscription();

    const slideActions$ = slider.slideAction.subscribe(action => {
      if (DESKTOP) {
        handleSlideActionChange(action);
      } else {
        const slideShowRef = document.querySelector('.SlideShow');
        if (slideShowRef) {
          slideShowRef.scrollIntoView({ behavior: 'smooth' });
        }
        setTimeout(() => {
          handleSlideActionChange(action);
        }, 1000);
      }
    });

    subscriptions.add(slideActions$);

    return () => {
      subscriptions.unsubscribe();
    };
  }, []);

  const handleSlideActionChange = (action: 'next' | 'previous') => {
    const { swiper } = slider;

    switch (action) {
      case 'next':
        swiper?.slideNext();
        break;
      case 'previous':
        swiper?.slidePrev();
        break;
    }
  };

  const params = {
    effect: 'cube',
    grabCursor: true,
    loop: true,
    speed: 400,
    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94
    },
    coverflowEffect: {
      rotate: 30,
      slideShadows: false
    },
    pagination: {
      el: '.swiper-pagination'
    }
  };

  return (
    <div ref={containerRef} className={className}>
      <Swiper {...params}>
        {slider.slides.map(({ name, images }) => (
          <div
            key={`${name}__${images[0]}`}
            id={name}
            style={{
              backgroundImage: `url(${images[0]})`
            }}
          ></div>
        ))}
      </Swiper>
    </div>
  );
};

export default observer(SlideShow);
