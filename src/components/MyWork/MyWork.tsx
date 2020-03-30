import ClassNames from 'classnames';
import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { Subject } from 'rxjs';
import { useStores } from '../../store/context';
import { WithClassName } from '../../utils/types';
import BGImg from '../BGImg/BGImg';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import ProjectSlide from '../ProjectSlide/ProjectSlide';
import SlideShow, { Slide } from '../SlideShow/SlideShow';
import ImgSlider from './../ImgSlider/ImgSlider';
import './MyWork.scss';
interface Props extends WithClassName {}

interface State {
  currentSlide: Slide | null;
  show: boolean;
  currentSlideIndex: number;
}

const MyWork: React.FC<Props> = ({ className }) => {
  const { slider } = useStores();

  className = ClassNames(className, 'MyWork', 'main-page', 'main-screen');
  const state = useLocalStore<State>(() => ({
    currentSlide: null,
    sliderValue$: new Subject<number>(),
    get currentSlideIndex() {
      return slider.slides.findIndex(
        ({ name }) => (this as State)?.currentSlide?.name === name
      );
    },
    show: true
  }));

  const onSlideChange = (slide: Slide) => {
    state.show = false;

    setTimeout(() => {
      state.currentSlide = slide;
      state.show = !!slide;
    }, 500);
  };

  const sliderValueChanged = (value: number | number[]) => {
    console.log(value);

    const { swiper } = slider;

    swiper?.slideTo(value);
  };

  return (
    <div className={className}>
      <BGImg cover src='assets/images/my-work.jpg' />
      <Button white to='/' className='go-back'>
        <Icon type='arrow-right' />
        <span>Go Back</span>
      </Button>
      <header>
        <h1>My Work</h1>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          Reprehenderit quisquam dolores fuga unde dolorum odio consectetur aut.
          Similique dolorum aliquam doloremque deleniti eius vel natus facilis
          nulla, temporibus, dolorem quas!
        </p>
      </header>
      <ImgSlider
        slideLength={slider.slides.length}
        currentStep={state.currentSlideIndex}
        sliderValueChanged={sliderValueChanged}
      />
      <section className='main-content'>
        <ProjectSlide show={state.show} slide={state.currentSlide} />
        <SlideShow onSlideChange={onSlideChange} />
      </section>
    </div>
  );
};

export default observer(MyWork);
