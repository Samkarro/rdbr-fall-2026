"use client";
import { useState } from "react";
import "./styles/header.styles.css";
import GlobalSearch from "./search";

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
        <button className="custom-button-large clickable red-button">
          Sign Up
        </button>
        {/* TODO: Review hover color change - seems too dark at the moment */}
        <button className="custom-button-large clickable white-button">
          Log In
        </button>
      </div>
    );
  }

  return (
    <header>
      <div className="header-components-container">
        <div className="header-components-logos-container">
          <span className="kinoxii-logo">
            KINO <span style={{ color: "var(--color-red)" }}>XIII</span>
          </span>
          <p className="overline">SESSIONS</p>
        </div>
        <div className="header-components-actions-container">
          <GlobalSearch></GlobalSearch>
          <div className="header-components-auth-buttons">
            {/* TODO: properly handle null value - to avoid flashing before promise resolves */}
            {!isLoggedIn ? LoggedOutButtons() : LoggedInButtons()}
          </div>
        </div>
      </div>
    </header>
  );
}
