import React from 'react';
import { observer } from 'mobx-react';
import ClassNames from 'classnames';
import BGImg from '../BGImg/BGImg';
import './AboutMe.scss';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import Wireframe from '../Wireframe/Wireframe';
import { DateDiff } from '../../utils/date';
import MySkills from './MySkills/MySkills';

interface Props {
  className;
}

const AboutMe: React.FC<Props> = ({ className }) => {
  className = ClassNames(className, 'AboutMe', 'form-page', 'main-screen');
  const { diffYears } = DateDiff(new Date(), new Date('01-11-2016'));

  return (
    <div className={className}>
      <BGImg cover className='half-bg' src='assets/images/about-me.jpg' />
      <Wireframe fadeIn />
      <Button white to='/' className='go-back'>
        <Icon type='arrow-right' />
        <span>Go Back</span>
      </Button>
      <section className='column'>
        <h1>About Me</h1>
        <section className='half-section'>
          <article>
            <h2 className='title-line'>
              <span>Who am I?</span>
            </h2>
            <p>
              My Name Is Tzach Bonfil And I Am A Full-Stack Developer For
              {` ${diffYears.toFixed(1)} `}
              Years, Im Working With The Top Tear Technologies You Can See In The Development Community
            </p>
          </article>

          <article>
            <h2 className='title-line'>
              <span>What I do?</span>
            </h2>
            <p>
              Today I Am The Head Of A Frontend Team At The Startup Called
              Intelligo, And I Also Handle The API. Over The Years I Have Also
              Worked With Servers Of All Kinds, And I Was Responsible For The
              Important And Secure Connection Between Server And App. For Me The
              Most Important Thing Is An App Who Scalable, Efficient And
              Quality.
            </p>
          </article>

          <article>
            <h2 className='title-line'>
              <span>My Skills?</span>
            </h2>
            <MySkills />
          </article>
        </section>
      </section>
    </div>
  );
};

export default observer(AboutMe);
