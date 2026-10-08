"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/api/user.api";
import Field, { SelectField } from "@/lib/components/global/input-field";

type Venue = { id: number; name: string };

type Values = {
  email: string;
  username: string;
  mobileNumber: string;
  dateOfBirth: string;
  preferredVenueId: string;
};

function maxDob() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 12);
  return d.toISOString().slice(0, 10);
}

export default function PersonalInformationForm({
  defaultValues,
  venues,
}: {
  defaultValues: Values;
  venues: Venue[];
}) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [valid, setValid] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [dirty, setDirty] = useState(false);

  const readForm = (form: HTMLFormElement) =>
    Object.fromEntries(new FormData(form)) as Record<string, string>;

  function handleChange(e: React.ChangeEvent<HTMLFormElement>) {
    const data = readForm(e.currentTarget);
    setDirty(
      (
        ["username", "mobileNumber", "dateOfBirth", "preferredVenueId"] as const
      ).some((k) => data[k] !== defaultValues[k]),
    );
    const name = e.target.name;
    setErrors(({ [name]: _, form: __, ...rest }) => rest);
    setValid([]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = readForm(e.currentTarget); // disabled email isn't included

    setErrors({});
    setValid([]);
    setPending(true);
    const result = await updateProfile(data);
    setPending(false);

    if (result.ok) {
      setValid(Object.keys(data));
      setDirty(false);
      router.refresh();
      return;
    }

    if (result.status === 401) {
      router.refresh();
      return;
    }

    const fieldErrors = Object.fromEntries(
      Object.entries(result.body?.errors ?? {}).map(([k, v]) => [
        k,
        (v as string[])[0],
      ]),
    );
    const hasFieldErrors = Object.keys(fieldErrors).length > 0;

    setErrors(
      hasFieldErrors
        ? fieldErrors
        : { form: result.body?.message ?? "Something went wrong" },
    );
    if (hasFieldErrors) {
      setValid(Object.keys(data).filter((n) => !(n in fieldErrors)));
    }
  }

  return (
    <form
      className="profile-form"
      onSubmit={handleSubmit}
      onChange={handleChange}
      noValidate
    >
      <Field
        label="Full name"
        name="fullName"
        defaultValue={defaultValues.username}
        error={errors.fullName}
        valid={valid.includes("fullName")}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        defaultValue={defaultValues.email}
        disabled
      />
      <p className="set-at-registration-message">
        Set at registration and cannot be changed
      </p>
      <Field
        label="Mobile number"
        name="mobileNumber"
        type="tel"
        inputMode="numeric"
        placeholder="599 123 456"
        defaultValue={defaultValues.mobileNumber}
        error={errors.mobileNumber}
        valid={valid.includes("mobileNumber")}
      />
      <Field
        label="Date of birth"
        name="dateOfBirth"
        type="date"
        max={maxDob()}
        defaultValue={defaultValues.dateOfBirth}
        error={errors.dateOfBirth}
        valid={valid.includes("dateOfBirth")}
      />
      <SelectField
        label="Preferred venue"
        name="preferredVenueId"
        defaultValue={defaultValues.preferredVenueId}
        error={errors.preferredVenueId}
      >
        <option value="">No preference</option>
        {venues.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </SelectField>

      {errors.form && <p className="auth-input-error body-s">{errors.form}</p>}

      <button
        type="submit"
        className="clickable label-m"
        disabled={!dirty || pending}
      >
        {pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
