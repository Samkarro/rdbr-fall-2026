import { getMe } from "@/lib/api/user.api";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getMe();
  if (user === null) {
    redirect("/?auth=true");
  }

  return (
    <section id="my-profile">
      <h1>My profile</h1>
    </section>
  );
}
