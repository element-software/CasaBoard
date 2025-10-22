import { CTA } from "./cta";
import { Features } from "./features";
import { Hero } from "./hero";
import { HowItWorks } from "./how-it-works";

export function HomePageContent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-32">
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
    </div>
  );
}
