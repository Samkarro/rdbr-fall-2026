"use client";
import { useState } from "react";
import "./styles/header.styles.css";

// Buttons sections for authorization states
function LoggedInButtons() {
  return <div className="header-components-logged-in"></div>;
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

// Main component
export default function KinoHeader() {
  // TODO: Handle authorization detection
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  return (
    <header>
      <div className="header-components-container">
        <div className="header-components-logos-container">
          <img src="/kinoxii.svg" />
          <p className="header-text">SESSIONS</p>
        </div>
        <div className="header-components-actions-container">
          {/* TODO: Separate search bar component */}
          <div className="header-components-auth-buttons">
            {/* TODO: properly handle null value - to avoid flashing before promise resolves */}
            {!isLoggedIn ? LoggedOutButtons() : LoggedInButtons()}
          </div>
        </div>
      </div>
    </header>
  );
}
