import React from 'react';
import ClassNames from 'classnames';

import './Icon.scss';
import { observer } from 'mobx-react';

interface Props {
  className?: string;
  type: string;
}

const Icon: React.FC<Props> = ({ className, type }) => {
  className = ClassNames('Icon', className, 'icon-' + type);

  return <span className={className}></span>;
};

export default observer(Icon);
