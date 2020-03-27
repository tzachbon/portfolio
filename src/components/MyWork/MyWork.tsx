import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import ClassNames from 'classnames';
import BGImg from '../BGImg/BGImg';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import './MyWork.scss';
import SlideShow, { Slide } from '../SlideShow/SlideShow';

interface Props {
  className?: string;
}

const MyWork: React.FC<Props> = ({ className }) => {

  className = ClassNames(className, 'MyWork', 'main-page', 'main-screen');
  const state = useLocalStore(() => ({

  }))

  const onSlideChange = (slide: Slide) => {
    console.log(slide);
    
  }

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
      <section className='main-content'>
        <SlideShow onSlideChange={onSlideChange} />
        <div className="slide-data">

        </div>
      </section>
    </div>
  );
};

export default observer(MyWork);
