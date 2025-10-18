export const dynamic = 'force-dynamic'; // disables static prerender for this route

import { Metadata } from "next";
import { HomePageContent } from "./HomePageContent";
import { generateHomepageMetadata } from "./api/og/homepage/metadata";

export async function generateMetadata(): Promise<Metadata> {

  return await generateHomepageMetadata();
}

export default function HomePage() {
  return (
    <HomePageContent />
  );
}