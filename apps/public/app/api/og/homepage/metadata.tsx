import { Metadata } from "next";

export async function generateHomepageMetadata(): Promise<Metadata> {
  const title = "CasaBoard";
  const description = "Cloud-Hosted Smart Home Dashboard";

  const ogUrlRectangle =
    process.env.NODE_ENV === "production"
      ? "https://casaboard.dev/api/og/homepage?type=rectangle"
      : "http://localhost:3001/api/og/homepage?type=rectangle";

  const ogUrlSquare =
    process.env.NODE_ENV === "production"
      ? "https://casaboard.dev/api/og/homepage?type=square"
      : "http://localhost:3001/api/og/homepage?type=square";

  return {
    title,
    description,
    metadataBase: new URL("https://casaboard.dev"),
    openGraph: {
      type: "website",
      title,
      description,
      siteName: "CasaBoard",
      images: [
        {
          url: ogUrlRectangle,
          width: 1200,
          height: 630,
          alt: title,
        },
        {
          url: ogUrlSquare,
          width: 400,
          height: 400,
          alt: title,
        },
      ],
      url: ``,
      countryName: "United Kingdom",
      phoneNumbers: ["+447394324284"],
    },
    twitter: {
      title,
      description,
      images: [
        {
          url: ogUrlRectangle,
          width: 1200,
          height: 630,
          alt: title,
        },
        {
          url: ogUrlSquare,
          width: 400,
          height: 400,
          alt: title,
        },
      ],
      creator: "@casaboard",
    },
  };
}
