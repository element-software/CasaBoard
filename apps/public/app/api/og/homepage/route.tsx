import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { OGHomepageTemplate } from "../templates/homepage";

// Route segment config
export const runtime = "edge";

const logoUrl =
  process.env.NODE_ENV === "production"
    ? "https://casaboard.dev/casaboard-logo.png"
    : "http://localhost:3001/casaboard-logo.png";

// Image generation
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const size = searchParams.get("size") || "rectangle";
  const title = searchParams.get("title") || "CasaBoard";
  const description =
    searchParams.get("description") || "Cloud-hosted Smart Home Dashboard";
  const imageUrl = searchParams.get("imageUrl") || "";
  let logoBuffer: ArrayBuffer;
  
  try {
    const logoData = fetch(logoUrl).then((res) => res.arrayBuffer());
    logoBuffer = await logoData; // Wait for image to load
  } catch (e: any) {
    return new Response("Failed to generate OG Image", { status: 500 });
  } // Wait for image to load

  const dimensions = {
    square: {
      width: 400,
      height: 400,
    },
    rectangle: {
      width: 1200,
      height: 630,
    },
  };

  try {
    return new ImageResponse(
      (
        <OGHomepageTemplate
          size={size as "rectangle" | "square"}
          title={title}
          description={description}
          imageUrl={imageUrl}
          logoBuffer={logoBuffer}
        />
      ),
      {
        headers: {
          "Content-Type": "image/png",
        },
        ...dimensions[size as keyof typeof dimensions],
      }
    );
  } catch (e: any) {
    return new Response("Failed to generate OG Image", { status: 500 });
  }
}
