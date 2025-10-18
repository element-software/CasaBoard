import { LinkService } from "@repo/lib";
import Icon from "@mdi/react";
import { mdiBookOpen, mdiEmail, mdiInformation, mdiLogin } from "@mdi/js";
export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
  icon?: React.ReactNode;
}

export const getPublicLinks = (): NavLink[] => [
  {
    href: LinkService.crossAppHref("public", "/about"),
    label: "About",
    external: true,
    icon: <Icon path={mdiInformation} className="w-4 h-4" />,
  },
  {
    href: LinkService.crossAppHref("public", "/docs"),
    label: "Docs",
    external: true,
    icon: <Icon path={mdiBookOpen} className="w-4 h-4" />,
  },
  {
    href: LinkService.crossAppHref("public", "/contact"),
    label: "Contact",
    external: true,
    icon: <Icon path={mdiEmail} className="w-4 h-4" />,
  },
  {
    href: LinkService.crossAppHref("app", "/"),
    label: "Login",
    icon: <Icon path={mdiLogin} className="w-4 h-4" />,
  },
];

export const getPrivateLinks = (): NavLink[] => [
  { href: LinkService.crossAppHref("app", "/setup"), label: "Setup" },
  { href: LinkService.crossAppHref("app", "/auth/profile"), label: "Profile" },
  {
    href: LinkService.crossAppHref("app", "/auth/profile/billing"),
    label: "Billing",
  },
];
