import { Header } from "@repo/ui/components/Header/Header";
import Home from "./components/home";
import { Footer } from "@repo/ui/components/Shared/Footer/index";

export default async function HomePage() {
  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
}
