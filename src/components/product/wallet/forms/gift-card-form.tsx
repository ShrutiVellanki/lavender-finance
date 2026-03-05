"use client";

import { useState } from "react";
import { ModalShell } from "../modal-shell";
import { TextInput, MaskedInput, SubmitButton } from "../form-primitives";
import { useModal } from "../modal-context";

interface Values {
  issuer: string;
  cardNumber: string;
  pin: string;
  balance: string;
}

type Errors = Partial<Values>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.issuer.trim()) e.issuer = "Issuer is required (e.g. Amazon, Starbucks)";
  if (!/^[A-Z0-9\- ]{10,25}$/i.test(v.cardNumber)) e.cardNumber = "Card number must be 10–25 characters";
  if (v.pin && !/^\d{4,8}$/.test(v.pin)) e.pin = "PIN must be 4–8 digits";
  if (v.balance && !/^\d+(\.\d{1,2})?$/.test(v.balance)) e.balance = "Enter a valid dollar amount";
  return e;
}

export const GiftCardForm = () => {
  const { addItem } = useModal();
  const [values, setValues] = useState<Values>({ issuer: "", cardNumber: "", pin: "", balance: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});

  const set = (field: keyof Values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (touched[field]) setErrors((err) => ({ ...err, [field]: validate({ ...values, [field]: e.target.value })[field] }));
  };

  const blur = (field: keyof Values) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((err) => ({ ...err, [field]: validate(values)[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ issuer: true, cardNumber: true, pin: true, balance: true });
    if (Object.keys(errs).length) return;
    const bal = values.balance ? `$${parseFloat(values.balance).toFixed(2)}` : "";
    addItem({ type: "gift-card", label: `${values.issuer} Gift Card`, sublabel: bal || "Balance unknown" });
  };

  return (
    <ModalShell title="Add Gift Card">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextInput label="Issuer" placeholder="Amazon" value={values.issuer} onChange={set("issuer")} onBlur={blur("issuer")} error={touched.issuer ? errors.issuer : undefined} />
        <MaskedInput label="Card Number" placeholder="AMZN-XXXX-XXXX-XXXX" value={values.cardNumber} onChange={set("cardNumber")} onBlur={blur("cardNumber")} error={touched.cardNumber ? errors.cardNumber : undefined} />
        <MaskedInput label="PIN — optional" placeholder="••••" value={values.pin} onChange={set("pin")} onBlur={blur("pin")} error={touched.pin ? errors.pin : undefined} inputMode="numeric" maxLength={8} />
        <TextInput label="Balance ($) — optional" placeholder="25.00" value={values.balance} onChange={set("balance")} onBlur={blur("balance")} error={touched.balance ? errors.balance : undefined} inputMode="decimal" />
        <SubmitButton>Save Gift Card</SubmitButton>
      </form>
    </ModalShell>
  );
};
