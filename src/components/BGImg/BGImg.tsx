import ClassNames from 'classnames';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import './BGImg.scss';
import { fromEvent, Subscription } from 'rxjs';

interface Props {
  src: string;
  cover?: boolean;
  className?;
  isImmediate?: boolean;
  parentRef?: React.MutableRefObject<HTMLDivElement>;
  ref?: React.Ref<HTMLDivElement>;
}

const BGImg: React.FC<Props> = React.forwardRef(
  ({ className, parentRef, src, cover, isImmediate }, ref) => {
    const state = useLocalStore(() => ({
      isLoaded: false,
      isUnmounted: false
    }));

    useEffect(() => {
      updateImage(src);

      return () => {
        state.isUnmounted = true;
      };
    }, [src]);

    const updateImage = (src: string) => {
      let image = new Image();
      image.src = src;
      image.addEventListener('load', () => {
        if (!state.isUnmounted) {
          state.isLoaded = true;
        }
      });
    };

    let { isLoaded } = state;

    className = ClassNames('BGImg', className, {
      'BGImg-cover': cover,
      'BGImg-loaded': isImmediate || isLoaded
    });

    return (
      <div ref={ref} className={className}>
        <div
          className='BGImg-image'
          style={{
            backgroundImage: `url(${src})`
          }}
        />
      </div>
    );
  }
);

export default observer(BGImg);
