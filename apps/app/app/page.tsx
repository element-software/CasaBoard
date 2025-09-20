import { Header } from "@repo/ui/components/Header/Header";
import Home from "./components/home";
import { Footer } from "@repo/ui/components/Footer";

export default async function HomePage() {
  return (
    <>
      <Header public={true} />
      <Home />
      <Footer />
    </>
  );
}
