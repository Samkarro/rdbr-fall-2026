import { User } from "@/lib/api/types/user.types";
import { getInitials } from "./header";
import { Dispatch, SetStateAction } from "react";
import "./styles/header.styles.css";
import "./styles/profile-dropdown.styles.css";

export default function ProfileDropdown({
  user,
  setProfileDropdownOpen,
}: {
  user: User;
  setProfileDropdownOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { avatar, username, profileComplete, email } = user;

  return (
    <div className="profile-dropdown-container">
      <div className="top-section">
        <div className="profile-dropdown-account-info-container">
          <div className="header-components-avatar">
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
        <div className={`profile-completion-notice`}>
          <p className="label-m">
            Profile {profileComplete ? "complete" : "incomplete"}
            {profileComplete && <img src="/green-check.svg" />}
          </p>
          {!profileComplete && (
            <p className="body-s">
              Please complete your profile to enable booking
            </p>
          )}
        </div>
        <div className="profile-buttons-container">
          <button className="profile-button">My Profile</button>
          <button className="profile-button">My Tickets</button>
        </div>
      </div>
      <div className="logout-button-container">
        <button className="profile-button logout-button">Log out</button>
      </div>
    </div>
  );
}
