import React from 'react';
import Icon from '@mdi/react';
import classNames from 'classnames';
import { getEntityIcon } from '@/utils/entityIcons';

interface EntityIconProps {
  entity: any;
  className?: string;
  size?: string;
}

/**
 * Universal entity icon component that renders the correct icon for any entity
 */
export default function EntityIcon({ entity, className, size = 'h-10 w-10' }: EntityIconProps) {
  const iconConfig = getEntityIcon(entity);
  
  return (
    <Icon 
      path={iconConfig.path} 
      className={classNames(size, className || iconConfig.className)}
    />
  );
}
