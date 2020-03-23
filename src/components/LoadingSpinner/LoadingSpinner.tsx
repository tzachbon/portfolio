import React, { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { Fab, CircularProgress } from '@material-ui/core';
import ClassNames from 'classnames';
import './LoadingSpinner.scss';
interface Props {
  time?: number;
  className?: string;
}

const LoadingSpinner: React.FC<Props> = ({ time, className }) => {
  const state = useLocalStore(() => ({
    percentage: 0,
    time: time || 2000
  }));
  className = ClassNames(className, 'LoadingSpinner');

  useEffect(() => {
    const interval = setInterval(() => {
      state.percentage++;

      if (state.percentage === 100) {
        clearInterval(interval);
      }
    }, state.time / 100);

    return;
  }, []);

  return state.percentage < 100 ? (
    <div className={className}>
      <Fab aria-label='save' size='small' color='primary'>
        <span className='percentage'>{state.percentage}</span>
      </Fab>
      <CircularProgress
        variant='determinate'
        value={state.percentage}
        size={50}
      />
    </div>
  ) : null;
};

export default observer(LoadingSpinner);
