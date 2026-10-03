import { getFeaturedTitles } from "@/lib/api/catalog.api";
import HeroSection from "@/lib/components/hero";

export default async function Home() {
  const featuredTitles = await getFeaturedTitles();

  return (
    <div>
      <main>
        <HeroSection movies={featuredTitles} />
      </main>
    </div>
  );
}
