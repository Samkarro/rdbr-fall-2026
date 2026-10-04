"use client";

import { useState } from "react";
import "./styles/auth-modal.styles.css";

export default function AuthModal({
  type,
  closeAuthModal,
}: {
  type: "login" | "signup";
  closeAuthModal: () => void;
}) {
  const [authType, setAuthType] = useState<"login" | "signup">(type);

  return (
    <div className="auth-modal-overlay" onClick={() => closeAuthModal()}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {authType === "signup" ? (
          <div className="auth-modal-signup-container">
            <span className="body-m">
              Already have an account?{" "}
              <span
                className="auth-modal-switch"
                onClick={() => setAuthType("login")}
              >
                Log in
              </span>
            </span>
          </div>
        ) : (
          <div className="auth-modal-login-container">
            <span className="body-m">
              Don't have an account?{" "}
              <span
                className="auth-modal-switch"
                onClick={() => setAuthType("signup")}
              >
                Sign up
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
