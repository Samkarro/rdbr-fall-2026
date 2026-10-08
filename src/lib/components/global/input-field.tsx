import "./styles/input-field.styles.css";

export type FieldProps = {
  label: string;
  name: string;
  error?: string;
  invalid?: boolean;
  valid?: boolean;
} & React.ComponentProps<"input">;

export default function Field({
  label,
  name,
  error,
  invalid,
  valid,
  ...props
}: FieldProps) {
  const hasError = Boolean(error || error === "" || invalid);

  return (
    <div className={`custom-input ${hasError ? "error" : ""}`}>
      <label className="label-s" htmlFor={name}>
        {label}
      </label>
      <div className="custom-input-control">
        <input id={name} className="label-s" name={name} {...props} />
        {valid && !hasError && (
          <img className="green-check" src="/green-check.svg" alt="" />
        )}
      </div>
      {error && <p className="custom-input-error body-s">{error}</p>}
    </div>
  );
}

export function SelectField({
  label,
  name,
  error,
  children,
  ...props
}: {
  label: string;
  name: string;
  error?: string;
} & React.ComponentProps<"select">) {
  return (
    <div className={`custom-input ${error ? "error" : ""}`}>
      <label className="label-s" htmlFor={name}>
        {label}
      </label>
      <div className="custom-input-control">
        <select id={name} className="label-s" name={name} {...props}>
          {children}
        </select>
      </div>
      {error && <p className="custom-input-error body-s">{error}</p>}
    </div>
  );
}
