import { getMe } from "@/lib/api/user.api";
import { redirect } from "next/navigation";
import "./styles/profile.styles.css";
import ProfileNav from "./(components)/profile-nav";

export default async function ProfilePage() {
  const user = await getMe();
  if (user === null) {
    redirect("/?auth=true");
  }

  return (
    <section id="my-profile">
      <h1>My profile</h1>
      <ProfileNav />
      <hr />
    </section>
  );
}
