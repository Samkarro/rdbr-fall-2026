import { FieldErrors } from "@/lib/api/types/booking.types";
import { User } from "@/lib/api/types/user.types";
import Field from "@/lib/components/global/input-field";

export default function CheckoutForm({
  user,
  errors,
  onSubmit,
  onFieldChange,
}: {
  user: User;
  errors: FieldErrors;
  onSubmit: (data: FormData) => void;
  onFieldChange: (name: string) => void;
}) {
  return (
    <form
      id="checkout-form"
      className="checkout-form-container"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget));
      }}
      onChange={(e) => {
        const name = e.target.name;
        if (name) onFieldChange(name);
      }}
    >
      <div className="checkout-personal-info-container checkout-info-container">
        <Field
          name="fullName"
          label="Full Name"
          placeholder="John Doe"
          defaultValue={user.fullName!}
          error={errors.fullName}
        />
        <div className="checkout-double-input-container">
          <Field
            name="email"
            label="Email"
            placeholder="email@example.com"
            defaultValue={user.email!}
            error={errors.email}
          />
          <Field
            name="mobileNumber"
            label="Phone Number"
            type="tel"
            placeholder="598000000"
            defaultValue={user.mobileNumber!}
            error={errors.mobileNumber}
          />
        </div>
      </div>
      <hr className="checkout-form-divider" />
      <div className="checkout-card-info-container checkout-info-container">
        <Field
          name="cardNumber"
          label="Card Number"
          placeholder="XXXX XXXX XXXX XXXX"
          error={errors.cardNumber}
        />
        <div className="checkout-double-input-container">
          <Field
            name="expiry"
            label="Expiry"
            placeholder="MM/YY"
            error={errors.expiry}
          />
          <Field name="cvv" label="CVV" placeholder="XXX" error={errors.cvv} />
        </div>
      </div>
    </form>
  );
}
