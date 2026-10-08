"use client";
import { User } from "@/lib/api/types/user.types";
import { getInitials } from "./header";
import { Dispatch, SetStateAction } from "react";
import "./styles/header.styles.css";
import "./styles/profile-dropdown.styles.css";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth.api";

export default function ProfileDropdown({
  user,
  setProfileDropdownOpen,
}: {
  user: User;
  setProfileDropdownOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { avatar, username, profileComplete, email } = user;
  const router = useRouter();

  function handleLogout() {
    logout();
    router.refresh();
  }

  const handleLink = (path: string) => {
    setProfileDropdownOpen;
    router.push(path);
  };

  return (
    <div className="profile-dropdown-container">
      <div className="top-section">
        <div className="profile-dropdown-account-info-container">
          <div className="header-components-avatar dropdown-version">
            {avatar ? (
              <img className="header-components-avatar-image" src={avatar} />
            ) : (
              <div className="header-components-avatar-initials">
                {getInitials(username)}
              </div>
            )}
            <span
              className={`header-components-status ${profileComplete ? "complete" : "incomplete"}`}
              title={
                profileComplete ? "Profile complete" : "Profile incomplete"
              }
            />
          </div>
          <div className="profile-dropdown-account-info-text">
            <p className="profile-dropdown-username label-m">{username}</p>
            <p className="profile-dropdown-email body-s">{email}</p>
          </div>
        </div>
        <div
          className={`profile-completion-notice ${profileComplete ? "complete" : "incomplete"}`}
        >
          <p className="label-m">
            Profile {profileComplete ? "Complete" : "incomplete"}
          </p>
          {profileComplete && <img src="/green-check.svg" />}
          {!profileComplete && (
            <p className="profile-completion-notice-body body-s">
              Please complete your profile to enable booking
            </p>
          )}
        </div>
        <div className="profile-buttons-container">
          <button
            className="profile-button clickable label-m"
            onClick={() => handleLink("/profile")}
          >
            <img className="my-profile-icon" src="/profile-icon.svg" />
            My Profile
          </button>
          <button
            className="profile-button clickable label-m"
            onClick={() => handleLink("/profile?page=my-tickets")}
          >
            <img src="/ticket.svg" />
            My Tickets
          </button>
        </div>
      </div>
      <div className="hr-bg">
        <hr />
      </div>

      <div className="logout-button-container">
        <button
          className="profile-button clickable logout-button label-m"
          onClick={() => handleLogout()}
        >
          <img src="/logout-icon.svg" />
          Log out
        </button>
      </div>
    </div>
  );
}
