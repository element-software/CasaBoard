import type { ImgHTMLAttributes, ReactNode } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
  children?: ReactNode;
};

/** Vite shim for next/image — plain img. */
export default function Image({
  src,
  alt,
  width,
  height,
  fill: _fill,
  priority: _priority,
  unoptimized: _unoptimized,
  ...rest
}: Props) {
  return <img src={src} alt={alt} width={width} height={height} {...rest} />;
}
