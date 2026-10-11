import {
  getComingSoon,
  getFeaturedTitles,
  getNowPlaying,
} from "@/lib/api/catalog.api";
import { getMe } from "@/lib/api/user.api";
import ComingSoon from "@/lib/components/homepage/coming-soon";
import HeroSection from "@/lib/components/homepage/hero";
import NowPlaying from "@/lib/components/homepage/now-playing";
import RecentlyViewed from "@/lib/components/homepage/recently-viewed";
import { cookies } from "next/headers";

export default async function Home() {
  const token = (await cookies()).get("token")?.value;
  const user = await getMe();
  const [featuredTitles, nowPlayingFilms, comingSoonFilms] = await Promise.all([
    getFeaturedTitles(),
    getNowPlaying(6),
    getComingSoon(4, token),
  ]);

  return (
    <div>
      <main>
        <HeroSection movies={featuredTitles} />
        <RecentlyViewed />
        <NowPlaying movies={nowPlayingFilms} />
        <hr />
        <ComingSoon movies={comingSoonFilms} isAuthed={user !== null} />
      </main>
    </div>
  );
}
