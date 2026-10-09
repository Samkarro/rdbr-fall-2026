"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import "./styles/auth-modal.styles.css";
import AuthForm, { AuthType } from "./auth-form";

// Extracted the values here to prevent duplication, I'm tired
const COPY = {
  signup: {
    title: "Sign up",
    subtitle: "Welcome to Kino XII",
    prompt: "Already have an account?",
    switchLabel: "Log in",
    other: "login",
  },
  login: {
    title: "Log in",
    subtitle: "Welcome back to Kino XII",
    prompt: "Don't have an account?",
    switchLabel: "Sign up",
    other: "signup",
  },
} as const;

export default function AuthModal({
  type,
  closeAuthModal,
}: {
  type: AuthType;
  closeAuthModal: () => void;
}) {
  const [authType, setAuthType] = useState<AuthType>(type);
  const { title, subtitle, prompt, switchLabel, other } = COPY[authType];

  return createPortal(
    <div
      className="auth-modal-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && closeAuthModal()}
    >
      <div className="auth-modal" role="dialog">
        <div className={`auth-modal-${authType}-container`}>
          <div className="auth-modal-heading-container">
            <div className="auth-modal-heading">
              <h2>{title}</h2>
              <p className="body-s">{subtitle}</p>
            </div>

            <img
              className="clickable"
              src="/x.svg"
              alt=""
              onClick={() => closeAuthModal()}
            />
          </div>

          <AuthForm
            key={authType}
            authType={authType}
            onSuccess={closeAuthModal}
          />

          <div className="auth-modal-cta-container">
            <span className="auth-modal-cta-text body-m">
              {prompt}{" "}
              <span
                className="auth-modal-switch clickable"
                onClick={() => setAuthType(other)}
              >
                {switchLabel}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
