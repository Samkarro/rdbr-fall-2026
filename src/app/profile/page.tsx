import { getMe } from "@/lib/api/user.api";
import { redirect } from "next/navigation";
import "./styles/profile.styles.css";
import ProfileNav from "./(components)/profile-nav";
import PersonalInformationForm from "./(components)/profile-form";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const user = await getMe();
  if (user === null) {
    redirect("/?auth=true");
  }

  return (
    <section id="my-profile">
      <h1>My profile</h1>
      <ProfileNav />
      <hr />
      {page === "my-tickets" ? (
        // Placeholder for MyTickets TODO: implement
        <div></div>
      ) : (
        <PersonalInformationForm />
      )}
    </section>
  );
}
