export interface OGImageProps {
  size?: 'rectangle' | 'square';
  logoBuffer: ArrayBuffer;
  title: string;
  description: string;
  imageUrl?: string;
}