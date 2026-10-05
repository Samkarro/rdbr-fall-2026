"use client";

import { useState } from "react";
import { api, ApiError } from "../api/server.api";

export type AuthType = "login" | "signup";

function Field({
  label,
  name,
  error,
  ...props
}: {
  label: string;
  name: string;
  error?: string;
} & React.ComponentProps<"input">) {
  return (
    <div className="auth-input">
      <label className="label-s" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        className="label-s"
        name={name}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="auth-input-error body-s">{error}</p>}
    </div>
  );
}

export default function AuthForm({
  authType,
  onSuccess,
}: {
  authType: AuthType;
  onSuccess: () => void;
}) {
  const isSignup = authType === "signup";
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filled, setFilled] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const { password_confirmation, ...payload } = Object.fromEntries(
      new FormData(e.currentTarget),
    ) as Record<string, string>;

    if (isSignup && payload.password !== password_confirmation) {
      setErrors({ password_confirmation: "Passwords do not match" });
      return;
    }

    setErrors({});
    setPending(true);
    try {
      await api(isSignup ? "/register" : "/login", {
        method: "POST",
        body: JSON.stringify({ password_confirmation, ...payload }),
      });
      onSuccess();
    } catch (err) {
      const body = err instanceof ApiError ? err.body : null;
      const fieldErrors = Object.fromEntries(
        Object.entries(body?.errors ?? {}).map(([k, v]) => [
          k,
          (v as string[])[0],
        ]),
      );
      setErrors(
        Object.keys(fieldErrors).length
          ? fieldErrors
          : { form: body?.message ?? "Something went wrong" },
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="auth-modal-form"
      onSubmit={handleSubmit}
      onChange={(e) => {
        const { name } = e.target;
        if (errors[name]) setErrors(({ [name]: _, ...rest }) => rest);
        const values = [...new FormData(e.currentTarget).values()];
        setFilled(values.every((v) => String(v).trim() !== ""));
      }}
    >
      <div className="auth-modal-form-text-fields-container">
        {isSignup && (
          <Field
            name="username"
            label="Username"
            autoComplete="username"
            error={errors.username}
            placeholder="User"
          />
        )}
        <Field
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email}
          placeholder="example@gmail.com"
        />
        <div className="auth-modal-password-fields-container">
          <Field
            name="password"
            label="Password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder="••••••••"
            error={errors.password}
          />
          {isSignup && (
            <Field
              name="password_confirmation"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              error={errors.password_confirmation}
            />
          )}

          {errors.form && (
            <p className="auth-input-error body-s" role="alert">
              {errors.form}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`clickable custom-button-large red-button ${pending || !filled ? "disabled" : ""}`}
          disabled={pending || !filled}
        >
          {isSignup ? "Sign up" : "Log in"}
        </button>
      </div>
    </form>
  );
}
