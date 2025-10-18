import Square from './square';
import Rectangle from './rectangle';
import { OGImageProps } from '../types';

export const OGHomepageTemplate = ({size, ...props}: OGImageProps) => {
  if (size === 'rectangle') {
    return <Rectangle {...props} />;
  }
  return <Square {...props} />;
} 