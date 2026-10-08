import {
  getComingSoon,
  getFeaturedTitles,
  getNowPlaying,
} from "@/lib/api/catalog.api";
import ComingSoon from "@/lib/components/homepage/coming-soon";
import HeroSection from "@/lib/components/homepage/hero";
import NowPlaying from "@/lib/components/homepage/now-playing";
import RecentlyViewed from "@/lib/components/homepage/recently-viewed";
import { getRecent, RecentMovie } from "@/lib/recently-viewed";

export default async function Home() {
  const featuredTitles = await getFeaturedTitles();
  const nowPlayingFilms = await getNowPlaying(6);
  const comingSoonFilms = await getComingSoon(4);

  return (
    <div>
      <main>
        <HeroSection movies={featuredTitles} />

        <RecentlyViewed />

        <NowPlaying movies={nowPlayingFilms} />
        <hr />
        <ComingSoon movies={comingSoonFilms} />
      </main>
    </div>
  );
}
