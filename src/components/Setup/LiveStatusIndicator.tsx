"use client";
import { useState, useEffect } from 'react';
import Icon from '@mdi/react';
import { mdiCheckCircle, mdiSync, mdiAlert } from '@mdi/js';
import classNames from 'classnames';

interface LiveStatusIndicatorProps {
  isUpdating?: boolean;
  lastUpdateTime?: Date;
  className?: string;
}

export const LiveStatusIndicator = ({ 
  isUpdating = false, 
  lastUpdateTime,
  className 
}: LiveStatusIndicatorProps) => {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isUpdating && lastUpdateTime) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isUpdating, lastUpdateTime]);

  const getStatusInfo = () => {
    if (isUpdating) {
      return {
        icon: mdiSync,
        text: 'Applying changes...',
        color: 'text-theme-accent',
        bgColor: 'bg-theme-accent/10',
        iconClass: 'animate-spin'
      };
    }
    
    if (showSuccess) {
      return {
        icon: mdiCheckCircle,
        text: 'Changes applied successfully',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        iconClass: ''
      };
    }

    if (lastUpdateTime) {
      const timeDiff = Date.now() - lastUpdateTime.getTime();
      const minutes = Math.floor(timeDiff / 60000);
      return {
        icon: mdiCheckCircle,
        text: minutes === 0 ? 'Just updated' : `Updated ${minutes}m ago`,
        color: 'text-theme-text-secondary',
        bgColor: 'bg-theme-surface',
        iconClass: ''
      };
    }

    return {
      icon: mdiAlert,
      text: 'No changes applied yet',
      color: 'text-theme-text-secondary',
      bgColor: 'bg-theme-surface',
      iconClass: ''
    };
  };

  const status = getStatusInfo();

  return (
    <div className={classNames(
      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200',
      status.bgColor,
      status.color,
      className
    )}>
      <Icon 
        path={status.icon} 
        className={classNames('h-4 w-4', status.iconClass)} 
      />
      <span>{status.text}</span>
    </div>
  );
};
