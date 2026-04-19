import type { Metadata } from "next";

const siteUrl = "https://casaboard.dev";

export type PublicOgRouteKey =
  | "home"
  | "about"
  | "contact"
  | "cookies"
  | "docs"
  | "pricing"
  | "privacy"
  | "security"
  | "terms";

type RouteOgDefinition = {
  path: string;
  metadata: {
    title: string;
    description: string;
  };
  og: {
    title: string;
    description: string;
    alt: string;
  };
};

export const publicOgRoutes: Record<PublicOgRouteKey, RouteOgDefinition> = {
  home: {
    path: "/",
    metadata: {
      title: "CasaBoard — Smart Home Dashboard",
      description:
        "Privacy-first Home Assistant dashboards — local credentials by default, optional cloud sync on paid plans.",
    },
    og: {
      title: "CasaBoard",
      description:
        "Privacy-first Home Assistant dashboards — local credentials by default, optional cloud sync on paid plans.",
      alt: "CasaBoard — Smart Home Dashboard",
    },
  },
  about: {
    path: "/about",
    metadata: {
      title: "About — CasaBoard",
      description:
        "A modern dashboard builder for Home Assistant — drag-and-drop editor, responsive layouts, privacy-first by default.",
    },
    og: {
      title: "About CasaBoard",
      description: "Modern dashboards for Home Assistant — beautiful, responsive, privacy-first.",
      alt: "About CasaBoard — smart home dashboards",
    },
  },
  contact: {
    path: "/contact",
    metadata: {
      title: "Contact — CasaBoard",
      description:
        "Questions, feedback, or just want to say hello? Reach the CasaBoard team — we read every message.",
    },
    og: {
      title: "Contact",
      description: "Questions or feedback? We'd love to hear from you.",
      alt: "Contact CasaBoard",
    },
  },
  cookies: {
    path: "/cookies",
    metadata: {
      title: "Cookie Policy — CasaBoard",
      description:
        "How CasaBoard uses cookies — essential sign-in cookies, optional analytics, and how you control them.",
    },
    og: {
      title: "Cookie Policy",
      description: "Essential cookies and opt-in analytics — you stay in control.",
      alt: "CasaBoard cookie policy",
    },
  },
  docs: {
    path: "/docs",
    metadata: {
      title: "Documentation — CasaBoard",
      description:
        "Guides for CasaBoard — dashboards, Home Assistant connections, editor tips, and troubleshooting.",
    },
    og: {
      title: "Documentation",
      description: "Everything you need to get started with CasaBoard.",
      alt: "CasaBoard documentation",
    },
  },
  pricing: {
    path: "/pricing",
    metadata: {
      title: "Pricing — CasaBoard",
      description:
        "Simple pricing for CasaBoard — free tier and paid plans. Upgrade or cancel anytime.",
    },
    og: {
      title: "Pricing",
      description: "Simple, honest plans — upgrade or cancel anytime.",
      alt: "CasaBoard pricing",
    },
  },
  privacy: {
    path: "/privacy",
    metadata: {
      title: "Privacy Policy — CasaBoard",
      description:
        "What CasaBoard collects, how we use it, and how we keep your Home Assistant credentials local by default.",
    },
    og: {
      title: "Privacy Policy",
      description: "Minimal data, opt-in analytics — your HA credentials never touch our servers.",
      alt: "CasaBoard privacy policy",
    },
  },
  security: {
    path: "/security",
    metadata: {
      title: "Security — CasaBoard",
      description:
        "How CasaBoard protects your account and data — local credentials, optional cloud sync, and clear boundaries.",
    },
    og: {
      title: "Security",
      description: "Privacy-first by design — local credentials, clear data boundaries.",
      alt: "CasaBoard security and privacy",
    },
  },
  terms: {
    path: "/terms",
    metadata: {
      title: "Terms of Service — CasaBoard",
      description:
        "CasaBoard terms of service — development period, plans, data, and what to expect at launch.",
    },
    og: {
      title: "Terms of Service",
      description: "What to expect while CasaBoard is in active development.",
      alt: "CasaBoard terms of service",
    },
  },
};

export function metadataForRoute(key: PublicOgRouteKey): Metadata {
  const def = publicOgRoutes[key];
  const url = new URL(def.path, siteUrl).toString();
  return {
    title: def.metadata.title,
    description: def.metadata.description,
    openGraph: {
      title: def.metadata.title,
      description: def.metadata.description,
      url,
      type: "website",
      siteName: "CasaBoard",
    },
    twitter: {
      card: "summary_large_image",
      title: def.metadata.title,
      description: def.metadata.description,
    },
  };
}
