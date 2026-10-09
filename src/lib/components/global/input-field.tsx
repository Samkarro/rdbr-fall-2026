import "./styles/input-field.styles.css";

export type FieldProps = {
  label: string;
  name: string;
  error?: string;
  invalid?: boolean;
  valid?: boolean;
  disabledMessage?: string;
} & React.ComponentProps<"input">;

export default function Field({
  label,
  name,
  error,
  invalid,
  valid,
  disabledMessage,
  ...props
}: FieldProps) {
  const hasError = Boolean(error || error === "" || invalid);

  return (
    <div className={`custom-input ${hasError ? "error" : ""}`}>
      <label className="label-s" htmlFor={name}>
        {label}
      </label>
      <div className="custom-input-control">
        <input
          id={name}
          className={`label-s ${props.disabled ? "disabled" : ""} ${props.type === "date" ? "clickable" : ""}`}
          name={name}
          {...props}
          defaultValue={props.defaultValue ?? ""}
          onFocus={
            props.type === "date"
              ? (e) => e.currentTarget.showPicker()
              : undefined
          }
        />
        {valid && !hasError && (
          <img className="green-check" src="/green-check.svg" alt="" />
        )}
      </div>
      {disabledMessage && (
        <p className="custom-input-disabled-message label-s">
          {disabledMessage}
        </p>
      )}
      {error && <p className="custom-input-error body-s">{error}</p>}
    </div>
  );
}
