"use client";

import { User } from "@/lib/api/types/user.types";
import Field from "@/lib/components/global/input-field";

export default function CheckoutForm({ user }: { user: User }) {
  return (
    <form className="checkout-form-container">
      <div className="checkout-personal-info-container checkout-info-container">
        <Field
          name="fullName"
          label="Full Name"
          placeholder="John Doe"
          defaultValue={user.fullName!}
        />
        <div className="checkout-double-input-container">
          <Field
            name="email"
            label="Email"
            placeholder="email@example.com"
            defaultValue={user.email!}
          />
          <Field
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            placeholder="598000000"
            defaultValue={user.mobileNumber!}
          />
        </div>
      </div>
      <hr className="checkout-form-divider" />
      <div className="checkout-card-info-container checkout-info-container">
        <Field
          name="fullName"
          label="Card Number"
          placeholder="XXXX XXXX XXXX XXXX"
        />
        <div className="checkout-double-input-container">
          <Field name="fullName" label="Expiry" placeholder="MM/YY" />
          <Field name="fullName" label="CVV" placeholder="XXX" />
        </div>
      </div>
    </form>
  );
}
