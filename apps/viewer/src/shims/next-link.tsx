import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
  prefetch?: boolean;
  scroll?: boolean;
  replace?: boolean;
};

/** Vite shim for next/link — plain anchor. */
export default function Link({ href, children, ...rest }: Props) {
  const {
    prefetch: _prefetch,
    scroll: _scroll,
    replace: _replace,
    ...anchorProps
  } = rest;
  return (
    <a href={href} {...anchorProps}>
      {children}
    </a>
  );
}
