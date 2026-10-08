"use client";
import { useState } from "react";
import "./styles/header.styles.css";
import GlobalSearch from "./search";
import AuthModal from "./auth/auth-modal";
import { useRouter } from "next/navigation";

const placeholderUser = {
  username: "Jane Doe",
  avatar: null,
  profileComplete: false,
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

// Main component
export default function KinoHeader() {
  // TODO: Handle authorization detection
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(false);
  const [authModalOpen, setAuthModalOpen] = useState<"login" | "signup" | null>(
    null,
  );

  const router = useRouter();

  // Buttons sections for authorization states
  function LoggedInButtons() {
    const { username, avatar, profileComplete } = placeholderUser;

    return (
      <div className="header-components-logged-in">
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
              title={
                profileComplete ? "Profile complete" : "Profile incomplete"
              }
            />
          </div>
          <p className="header-components-username">
            {placeholderUser.username}
          </p>
        </div>
      </div>
    );
  }

  function LoggedOutButtons() {
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
            {/* TODO: properly handle null value - to avoid flashing before promise resolves */}
            {!isLoggedIn ? LoggedOutButtons() : LoggedInButtons()}
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
