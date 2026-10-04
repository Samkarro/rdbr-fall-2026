import {
  getComingSoon,
  getFeaturedTitles,
  getNowPlaying,
} from "@/lib/api/catalog.api";
import ComingSoon from "@/lib/components/coming-soon";
import HeroSection from "@/lib/components/hero";
import NowPlaying from "@/lib/components/now-playing";

export default async function Home() {
  const featuredTitles = await getFeaturedTitles();
  const nowPlayingFilms = await getNowPlaying(6);
  const comingSoonFilms = await getComingSoon(4);
  return (
    <div>
      <main>
        <HeroSection movies={featuredTitles} />
        <NowPlaying movies={nowPlayingFilms} />
        <hr />
        <ComingSoon movies={comingSoonFilms} />
      </main>
    </div>
  );
}
