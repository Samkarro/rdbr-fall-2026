"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authenticate } from "../../../api/auth.api";
import Field from "../input-field";

export type AuthType = "login" | "signup";

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
  const router = useRouter();
  const [valid, setValid] = useState<string[]>([]);

  // Validating obvious mistakes in fields here.
  function validate(name: string, value: string) {
    if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      return "Enter a valid email address";
    }

    if (name === "password" && value.length < 3) {
      return "Password must be at least 3 characters";
    }
    return "";
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<
      string,
      string
    >;

    const clientErrors: Record<string, string> = {};
    for (const [name, value] of Object.entries(data)) {
      const message = validate(name, value);
      if (message) clientErrors[name] = message;
    }
    if (isSignup && data.password !== data.password_confirmation) {
      clientErrors.password_confirmation = "Passwords do not match";
    }
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      setValid([]);
      return;
    }

    setErrors({});
    setValid([]);
    setPending(true);
    const result = await authenticate(authType, data);
    if (result.ok) {
      setValid(Object.keys(data));
      await new Promise((resolve) => setTimeout(resolve, 800));
      onSuccess();
      router.refresh();
      return;
    }
    setPending(false);

    if (result.ok) {
      onSuccess();
      router.refresh();
      return;
    }

    if (!isSignup && result.status === 401) {
      setErrors({ email: "", password: "invalid credentials" });
      return;
    }

    const body = result.body;
    const fieldErrors = Object.fromEntries(
      Object.entries(body?.errors ?? {}).map(([k, v]) => [
        k,
        (v as string[])[0],
      ]),
    );
    const hasFieldErrors = Object.keys(fieldErrors).length > 0;

    setErrors(
      hasFieldErrors
        ? fieldErrors
        : { form: body?.message ?? "Something went wrong" },
    );

    if (hasFieldErrors) {
      setValid(Object.keys(data).filter((name) => !(name in fieldErrors)));
    }
  }

  return (
    <form
      className="auth-modal-form"
      onSubmit={handleSubmit}
      onChange={(e) => {
        const { name } = e.target;
        if (name in errors) setErrors(({ [name]: _, ...rest }) => rest);
        setValid((prev) =>
          prev.includes(name) ? prev.filter((n) => n !== name) : prev,
        );

        const values = [...new FormData(e.currentTarget).values()];
        setFilled(values.every((v) => String(v).trim() !== ""));
      }}
      onBlur={(e) => {
        const { name, value } = e.target;
        if (!value) return;
        const message = validate(name, value);
        if (message) setErrors((prev) => ({ ...prev, [name]: message }));
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
            valid={valid.includes("username")}
          />
        )}
        <Field
          name="email"
          label="Email"
          autoComplete="email"
          error={errors.email}
          placeholder="example@gmail.com"
          valid={valid.includes("email")}
        />
        <div className="auth-modal-password-fields-container">
          <Field
            name="password"
            label="Password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder="••••••••"
            error={errors.password}
            valid={valid.includes("password")}
          />
          {isSignup && (
            <Field
              name="password_confirmation"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              error={errors.password_confirmation}
              valid={valid.includes("password_confirmation")}
            />
          )}
        </div>
        {errors.form && !isSignup && (
          <p className="auth-input-error body-s" role="alert">
            {errors.form}
          </p>
        )}
        <button
          type="submit"
          className={`clickable custom-button-large red-button ${pending || !filled || Object.keys(errors).length > 0 ? "disabled" : ""}`}
          disabled={pending || !filled || Object.keys(errors).length > 0}
        >
          {isSignup ? "Sign up" : "Log in"}
        </button>
      </div>
    </form>
  );
}
