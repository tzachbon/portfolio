import { LinearProgress } from '@material-ui/core';
import ClassNames from 'classnames';
import { startCase } from 'lodash';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import './MySkills.scss';

interface Props {
  className?: string;
}

interface Skill {
  name: string;
  rate: number;
}

const skills: Skill[] = [
  {
    name: 'react',
    rate: 95
  },
  {
    name: 'reactNative',
    rate: 85
  },
  {
    name: 'angular',
    rate: 90
  },
  {
    name: 'nodeJs',
    rate: 80
  },
  {
    name: 'mongodb',
    rate: 70
  },
  {
    name: 'rxjs',
    rate: 90
  },
  {
    name: 'mobx',
    rate: 85
  },
  {
    name: 'redux',
    rate: 75
  }
];

let shouldRanAnimation = true;

const MySkills: React.FC<Props> = ({ className }) => {
  const state = useLocalStore(() => ({
    skills: skills.map(({ name }) => ({ name, rate: 0 }))
  }));
  shouldRanAnimation = true;
  className = ClassNames(className, 'mySkills');

  const updateProgressHelper = (index: number) => {
    if (!shouldRanAnimation) return;
    state.skills = skills.slice().map(({ name }, i) => ({
      name,
      rate: Math.min(index, skills[i].rate)
    }));
  };

  const updateProgress = () => {
    let i = 0;
    const interval = setInterval(() => {
      updateProgressHelper(i);
      i++;

      if (i >= 100) {
        clearInterval(interval);
      }
    }, 50);
  };

  useEffect(() => {
    updateProgress();

    return () => {
      shouldRanAnimation = false;
    };
  }, []);

  return (
    <div className={className}>
      {state.skills.map(({ name, rate }, i) => (
        <div key={`${name}__${i}`} className='progress'>
          <LinearProgress
            className={ClassNames('progress-bar', name)}
            variant='determinate'
            value={rate}
          />
          <h2 className='title'>{`${startCase(name)} - ${skills[i].rate}%`}</h2>
        </div>
      ))}
    </div>
  );
};

export default observer(MySkills);
