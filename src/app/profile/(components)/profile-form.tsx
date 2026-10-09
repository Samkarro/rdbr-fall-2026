"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/api/user.api";
import Field from "@/lib/components/global/input-field";
import { SelectField } from "./custom-select";
import "./styles/custom-select.styles.css";

type Venue = { id: number; name: string };

type Values = {
  email: string;
  fullName: string;
  mobileNumber: string;
  dateOfBirth: string;
  preferredVenueId: string;
};

const editableKeys = [
  "fullName",
  "mobileNumber",
  "dateOfBirth",
  "preferredVenueId",
] as const;

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
  const formRef = useRef<HTMLFormElement>(null);
  const baselineRef = useRef<Record<string, string>>(defaultValues);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [valid, setValid] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [dirty, setDirty] = useState(false);

  const readForm = (form: HTMLFormElement) =>
    Object.fromEntries(new FormData(form)) as Record<string, string>;

  // overrides covers the dropdown, whose new value isn't in the hidden input yet when its callback fires
  function checkDirty(
    form: HTMLFormElement,
    overrides: Record<string, string> = {},
  ) {
    const data = { ...readForm(form), ...overrides };
    setDirty(editableKeys.some((k) => data[k] !== baselineRef.current[k]));
  }

  function handleChange(e: React.ChangeEvent<HTMLFormElement>) {
    const target = e.target;

    checkDirty(e.currentTarget);
    setErrors(({ [target.name]: _, form: __, ...rest }) => rest);
    setValid([]);
  }

  function handleVenueChange(value: string) {
    if (formRef.current)
      checkDirty(formRef.current, { preferredVenueId: value });
    setErrors(({ preferredVenueId: _, form: __, ...rest }) => rest);
    setValid([]);
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = readForm(e.currentTarget);

    setErrors({});
    setValid([]);
    setPending(true);
    const result = await updateProfile(data);
    setPending(false);

    if (result.ok) {
      baselineRef.current = { ...baselineRef.current, ...data };
      setValid(Object.keys(data));
      setDirty(false);
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
      ref={formRef}
      className="profile-form"
      onSubmit={handleSubmit}
      onChange={handleChange}
      noValidate
    >
      <div className="profile-fields-container">
        <Field
          label="Full name"
          name="fullName"
          defaultValue={defaultValues.fullName}
          error={errors.fullName}
          valid={valid.includes("fullName")}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          defaultValue={defaultValues.email}
          disabledMessage={"Set at registration and cannot be changed"}
          disabled
        />

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
          valid={valid.includes("preferredVenueId")}
          onValueChange={handleVenueChange}
          options={[
            { value: "", label: "No preference" },
            ...venues.map((v) => ({ value: String(v.id), label: v.name })),
          ]}
        />
      </div>
      {errors.form && <p className="auth-input-error body-s">{errors.form}</p>}

      <button
        type="submit"
        {...{ autoComplete: "off" }}
        className="custom-button-large red-button clickable label-m"
        disabled={!dirty || pending}
      >
        Save changes
      </button>
    </form>
  );
}
