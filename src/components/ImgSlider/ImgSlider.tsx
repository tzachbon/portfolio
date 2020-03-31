import Slider from '@material-ui/core/Slider';
import ClassNames from 'classnames';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { WithClassName } from '../../utils/types';
import './ImgSlider.scss';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

interface Props extends WithClassName {
  slideLength: number;
  currentStep: number;
  sliderValueChanged: (value: number | number[]) => any;
  ref?: React.Ref<typeof Slider>;
}

const ImgSlider: React.FC<Props> = React.forwardRef(
  ({ className, slideLength, currentStep, sliderValueChanged }, ref) => {
    className = ClassNames(className, 'ImgSlider');

    const state = useLocalStore(() => ({
      valueChanged$: new Subject<number>()
    }));

    useEffect(() => {
      const sub$ = state.valueChanged$
        .pipe(distinctUntilChanged())
        .subscribe(value => sliderValueChanged(value));

      return () => sub$.unsubscribe();
    }, []);

    return (
      <div className={className}>
        <Slider
          ref={ref}
          value={currentStep + 1}
          step={1}
          marks
          onChange={(e, value) => state.valueChanged$.next(value as number)}
          min={0}
          max={slideLength}
        />
      </div>
    );
  }
);

export default observer(ImgSlider);
