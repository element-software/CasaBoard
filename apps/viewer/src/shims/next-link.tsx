import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { navigate, shouldClientNavigate } from "../clientHistory";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
  prefetch?: boolean;
  scroll?: boolean;
  replace?: boolean;
};

/** Vite shim for next/link — soft-navigates same-origin routes. */
export default function Link({
  href,
  children,
  onClick,
  replace,
  ...rest
}: Props) {
  const {
    prefetch: _prefetch,
    scroll: _scroll,
    ...anchorProps
  } = rest;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      shouldClientNavigate(event, event.currentTarget) &&
      href
    ) {
      event.preventDefault();
      navigate(href, { replace });
    }
  };

  return (
    <a href={href} {...anchorProps} onClick={handleClick}>
      {children}
    </a>
  );
}
