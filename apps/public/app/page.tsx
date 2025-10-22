import { Metadata } from "next";
import { HomePageContent } from "./home/HomePageContent";
import { generateHomepageMetadata } from "./api/og/homepage/metadata";

export async function generateMetadata(): Promise<Metadata> {

  return await generateHomepageMetadata();
}

export default function HomePage() {
  return (
    <HomePageContent />
  );
}