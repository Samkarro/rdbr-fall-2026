"use client";

import { Dispatch, SetStateAction, useState } from "react";
import "./styles/auth-modal.styles.css";
import { createPortal } from "react-dom";

type AuthInputProps = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<React.ComponentProps<"input">, "value" | "onChange" | "name">;

function AuthInput({ name, label, value, onChange, ...rest }: AuthInputProps) {
  return (
    <label className="auth-input" htmlFor={name}>
      <span className="label-s">{label}</span>
      <input
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </label>
  );
}

export default function AuthModal({
  type,
  closeAuthModal,
}: {
  type: "login" | "signup";
  closeAuthModal: () => void;
}) {
  const [authType, setAuthType] = useState<"login" | "signup">(type);

  // Rendering through a portal to prevent breaking modal overlay
  return createPortal(
    <div
      className="auth-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
      role="dialog"
    >
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {authType === "signup" ? (
          <div className="auth-modal-signup-container">
            <div className="auth-modal-heading-container">
              <div className="auth-modal-heading">
                <h2>Sign up</h2>
                <p className="body-s">Welcome to Kino XII</p>
              </div>
              <img
                className="clickable"
                src="/x.svg"
                alt=""
                onClick={() => closeAuthModal()}
              />
            </div>
            <div className="auth-modal-cta-container">
              <span className="body-m">
                Already have an account?{" "}
                <span
                  className="auth-modal-switch clickable"
                  onClick={() => setAuthType("login")}
                >
                  Log in
                </span>
              </span>
            </div>
          </div>
        ) : (
          <div className="auth-modal-login-container">
            <div className="auth-modal-heading-container">
              <div className="auth-modal-heading">
                <h2>Log in</h2>
                <p className="body-s">Welcome back to Kino XII</p>
              </div>
              <img
                className="clickable"
                src="/x.svg"
                alt=""
                onClick={() => closeAuthModal()}
              />
            </div>
            <div className="auth-modal-cta-container">
              <span className="body-m">
                Don't have an account?{" "}
                <span
                  className="auth-modal-switch clickable"
                  onClick={() => setAuthType("signup")}
                >
                  Sign up
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
