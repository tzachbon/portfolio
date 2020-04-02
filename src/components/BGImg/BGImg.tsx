import ClassNames from 'classnames';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import './BGImg.scss';
import { WithClassName } from '../../utils/types';

interface Props extends WithClassName {
  src: string;
  cover?: boolean;
  isImmediate?: boolean;
  parentRef?: React.MutableRefObject<HTMLDivElement>;
  ref?: React.Ref<HTMLDivElement>;
  onImageLoaded?: () => any;
}

const BGImg: React.FC<Props> = React.forwardRef(
  ({ className, parentRef, src, cover, isImmediate, onImageLoaded }, ref) => {
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
      image.addEventListener('load', onLoad);
    };

    const onLoad = () => {
      if (!state.isUnmounted) {
        state.isLoaded = true;
        if (onImageLoaded) {
          setTimeout(() => {
            onImageLoaded();
          }, 5000);
        }
      }
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
