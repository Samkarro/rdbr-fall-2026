import { getFeaturedTitles } from "@/lib/api/catalog.api";
import HeroSection from "@/lib/components/hero";
import NowPlaying from "@/lib/components/now-playing";

export default async function Home() {
  const featuredTitles = await getFeaturedTitles();

  return (
    <div>
      <main>
        <HeroSection movies={featuredTitles} />
        {/* TODO: Pass now playing titles */}
        <NowPlaying movies={featuredTitles} />
      </main>
    </div>
  );
}
