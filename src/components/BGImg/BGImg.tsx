import ClassNames from "classnames";
import { observer, useLocalStore } from "mobx-react";
import React, { useEffect } from "react";
import './BGImg.scss';

interface Props {
  src: string;
  cover?: boolean;
  alt?: string;
  className?;
  isImmediate?: boolean;
}

const BGImg: React.FC<Props> = ({
  className,
  src,
  alt,
  cover,
  isImmediate
}) => {
    
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
    image.addEventListener("load", () => {
      if (!state.isUnmounted) {
        state.isLoaded = true;
      }
    });
  };

  let { isLoaded } = state;

  className = ClassNames("BGImg", className, {
    "BGImg-cover": cover,
    "BGImg-loaded": isImmediate || isLoaded
  });
  let imageStyle = {
    backgroundImage: `url(${src})`
  };

  return (
    <div className={className}>
      <div className="BGImg-image" style={imageStyle} />
    </div>
  );
};

export default observer(BGImg);
