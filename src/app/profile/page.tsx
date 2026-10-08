import { getMe } from "@/lib/api/user.api";
import { redirect } from "next/navigation";
import "./styles/profile.styles.css";
import ProfileNav from "./(components)/profile-nav";
import PersonalInformationForm from "./(components)/profile-form";
import { getFilterOptions } from "@/lib/api/catalog.api";

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

  const filterOptions = await getFilterOptions();

  return (
    <section id="my-profile">
      <h1>My profile</h1>
      <ProfileNav />
      <hr />
      {page === "my-tickets" ? (
        // Placeholder for MyTickets TODO: implement
        <div></div>
      ) : (
        <PersonalInformationForm
          // Adding this to remount with correct values after refresh
          key={`${user.mobileNumber}-${user.dateOfBirth}-${user.preferredVenue?.id}-${user.fullName}`}
          defaultValues={{
            email: user.email,
            fullName: user.username,
            mobileNumber: user.mobileNumber ?? "",
            dateOfBirth: user.dateOfBirth ?? "",
            preferredVenueId: user.preferredVenue
              ? String(user.preferredVenue.id)
              : "",
          }}
          venues={filterOptions.venues}
        />
      )}
    </section>
  );
}
