import { LinkService } from "@repo/lib";

export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

export const getPublicLinks = (): NavLink[] => [
  { href: LinkService.crossAppHref("public", "/about"), label: "About", external: true },
  { href: LinkService.crossAppHref("public", "/docs"), label: "Docs", external: true },
  { href: LinkService.crossAppHref("public", "/contact"), label: "Contact", external: true },
];

export const getPrivateLinks = (): NavLink[] => [
  { href: "/setup", label: "Setup" },
];


