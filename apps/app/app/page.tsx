import { redirect } from "next/navigation";

export default async function HomePage() {
  console.log("HomePage:: redirecting to /setup")
  return redirect("/setup")
}
