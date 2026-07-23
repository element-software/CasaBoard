import type { Metadata } from "next";

const siteUrl = "https://casaboard.dev";

export type PublicOgRouteKey =
  | "home"
  | "about"
  | "contact"
  | "cookies"
  | "docs"
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
      title: "CasaBoard — Self-Hosted Home Assistant Dashboards",
      description:
        "Free, open-source, self-hosted dashboard builder for Home Assistant. Runs on your own hardware via Docker.",
    },
    og: {
      title: "CasaBoard",
      description:
        "Free, open-source, self-hosted dashboard builder for Home Assistant. Runs on your own hardware via Docker.",
      alt: "CasaBoard — Self-Hosted Home Assistant Dashboards",
    },
  },
  about: {
    path: "/about",
    metadata: {
      title: "About — CasaBoard",
      description:
        "A self-hosted, open-source dashboard builder for Home Assistant — drag-and-drop editor, your data never leaves your network.",
    },
    og: {
      title: "About CasaBoard",
      description: "Self-hosted dashboards for Home Assistant — beautiful, responsive, open source.",
      alt: "About CasaBoard — smart home dashboards",
    },
  },
  contact: {
    path: "/contact",
    metadata: {
      title: "Contact — CasaBoard",
      description:
        "Questions, feedback, or found a bug? Reach out or open an issue on the CasaBoard GitHub repository.",
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
        "How this documentation site uses cookies. The CasaBoard app itself is self-hosted and sets none.",
    },
    og: {
      title: "Cookie Policy",
      description: "No cookies, no analytics — on this docs site or in the app.",
      alt: "CasaBoard cookie policy",
    },
  },
  docs: {
    path: "/docs",
    metadata: {
      title: "Documentation — CasaBoard",
      description:
        "Guides for CasaBoard — Docker install, the HACS Lovelace panel, connecting Home Assistant, and troubleshooting.",
    },
    og: {
      title: "Documentation",
      description: "Everything you need to self-host CasaBoard.",
      alt: "CasaBoard documentation",
    },
  },
  privacy: {
    path: "/privacy",
    metadata: {
      title: "Privacy Policy — CasaBoard",
      description:
        "CasaBoard is self-hosted software. We don't run a hosted service and collect no data from your installation.",
    },
    og: {
      title: "Privacy Policy",
      description: "Self-hosted software — your data stays on your own infrastructure.",
      alt: "CasaBoard privacy policy",
    },
  },
  security: {
    path: "/security",
    metadata: {
      title: "Security — CasaBoard",
      description:
        "How CasaBoard handles your Home Assistant credentials and dashboard data on your own server.",
    },
    og: {
      title: "Security",
      description: "Self-hosted by design — your credentials and data never leave your server.",
      alt: "CasaBoard security overview",
    },
  },
  terms: {
    path: "/terms",
    metadata: {
      title: "Terms — CasaBoard",
      description:
        "CasaBoard is free, open-source software provided as-is. No account, no subscription, no warranty.",
    },
    og: {
      title: "Terms",
      description: "Free, open-source software, provided as-is.",
      alt: "CasaBoard terms",
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
