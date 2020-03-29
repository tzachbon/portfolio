import ClassNames from 'classnames';
import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import BGImg from '../BGImg/BGImg';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import SlideShow, { Slide } from '../SlideShow/SlideShow';
import './MyWork.scss';
import ProjectSlide from './ProjectSlide/ProjectSlide';
import { Subject } from 'rxjs';

interface Props {
  className?: string;
}

interface State {
  currentSlide: Slide | null;
  show: boolean;
}

const MyWork: React.FC<Props> = ({ className }) => {
  className = ClassNames(className, 'MyWork', 'main-page', 'main-screen');
  const state = useLocalStore<State>(() => ({
    currentSlide: null,
    show: true,
  }));

  const onSlideChange = (slide: Slide) => {
    state.show = false;

    setTimeout(() => {
      state.currentSlide = slide;
      state.show = !!slide;
    }, 500);
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
      <div className='subtitles-wrapper'></div>
      <section className='main-content '>
        <ProjectSlide show={state.show} slide={state.currentSlide} />
        <SlideShow onSlideChange={onSlideChange} />
      </section>
    </div>
  );
};

export default observer(MyWork);
