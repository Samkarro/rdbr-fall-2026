"use client";
import { Dispatch, SetStateAction, useState } from "react";
import "./styles/header.styles.css";
import GlobalSearch from "./search";
import AuthModal from "./auth/auth-modal";
import { useRouter } from "next/navigation";
import { User } from "@/lib/api/types/user.types";
import ProfileDropdown from "./profile-dropdown";

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function LoggedOutButtons({
  setAuthModalOpen,
}: {
  setAuthModalOpen: Dispatch<SetStateAction<"login" | "signup" | null>>;
}) {
  return (
    <div className="header-components-logged-out">
      <button
        className="custom-button-large clickable red-button"
        onClick={() => setAuthModalOpen("signup")}
      >
        Sign Up
      </button>
      <button
        className="custom-button-large clickable white-button"
        onClick={() => setAuthModalOpen("login")}
      >
        Log In
      </button>
    </div>
  );
}

function LoggedInButtons({ user }: { user: User }) {
  const { username, avatar, profileComplete } = user;
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <div
      className="header-components-logged-in clickable"
      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
    >
      <div className="header-components-user">
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
            title={profileComplete ? "Profile complete" : "Profile incomplete"}
          />
        </div>
        <p className="header-components-username">{username}</p>
      </div>
      {profileDropdownOpen && (
        <ProfileDropdown
          user={user}
          setProfileDropdownOpen={setProfileDropdownOpen}
        />
      )}
    </div>
  );
}

// Main component
export default function KinoHeader({ user }: { user: User | null }) {
  const [authModalOpen, setAuthModalOpen] = useState<"login" | "signup" | null>(
    null,
  );
  const router = useRouter();

  return (
    <header>
      <div className="header-components-container">
        <nav className="header-components-logos-container ">
          <button
            className="kinoxii-logo clickable"
            onClick={() => router.push("/")}
          >
            KINO <span style={{ color: "var(--color-red)" }}>XII</span>
          </button>
          <button
            className="nav-button overline clickable"
            onClick={() => router.push("/sessions")}
          >
            SESSIONS
          </button>
        </nav>
        <div className="header-components-actions-container">
          <GlobalSearch></GlobalSearch>
          <div className="header-components-auth-buttons">
            {user === null ? (
              <LoggedOutButtons setAuthModalOpen={setAuthModalOpen} />
            ) : (
              <LoggedInButtons user={user} />
            )}
          </div>
        </div>
      </div>
      {authModalOpen && (
        <AuthModal
          type={authModalOpen}
          closeAuthModal={() => setAuthModalOpen(null)}
        />
      )}
    </header>
  );
}
