import React from 'react';
import { observer } from 'mobx-react';
import ClassNames from 'classnames';
import BGImg from '../BGImg/BGImg';
import './AboutMe.scss';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';

interface Props {
  className;
}

const AboutMe: React.FC<Props> = ({ className }) => {
  className = ClassNames(className, 'about-me', 'form-page', 'main-screen');

  return (
    <div className={className}>
      <BGImg cover className='half-bg' src='assets/images/about-me.jpg' />
      <Button white to='/' className='go-back'>
        <Icon type='arrow-right' />
        <span>Go Back</span>
      </Button>
      <section className='column'>
        <h1>About Me</h1>
      </section>
    </div>
  );
};

export default observer(AboutMe);
