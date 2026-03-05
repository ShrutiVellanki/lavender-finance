"use client";

import { useState } from "react";
import { ModalShell } from "../modal-shell";
import { TextInput, MaskedInput, SubmitButton } from "../form-primitives";
import { useModal } from "../modal-context";

interface Values {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

type Errors = Partial<Values>;

function luhn(num: string): boolean {
  const digits = num.replace(/\s/g, "").split("").reverse().map(Number);
  const sum = digits.reduce((acc, d, i) => {
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
    return acc + d;
  }, 0);
  return sum % 10 === 0;
}

function validate(v: Values): Errors {
  const e: Errors = {};
  const raw = v.number.replace(/\s/g, "");
  if (raw.length < 13 || raw.length > 16) e.number = "Must be 13–16 digits";
  else if (!luhn(raw)) e.number = "Invalid card number (Luhn check failed)";
  if (!v.name.trim()) e.name = "Cardholder name is required";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(v.expiry)) e.expiry = "Use MM/YY format";
  if (!/^\d{3,4}$/.test(v.cvv)) e.cvv = "Must be 3–4 digits";
  return e;
}

export const CreditCardModalForm = () => {
  const { addItem } = useModal();
  const [values, setValues] = useState<Values>({ number: "", name: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});

  const set = (field: keyof Values, formatter?: (v: string) => string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = formatter ? formatter(e.target.value) : e.target.value;
      setValues((v) => ({ ...v, [field]: val }));
      if (touched[field]) setErrors((err) => ({ ...err, [field]: validate({ ...values, [field]: val })[field] }));
    };

  const blur = (field: keyof Values) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((err) => ({ ...err, [field]: validate(values)[field] }));
  };

  const fmtNumber = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/.{4}/g, "$& ").trim();
  const fmtExpiry = (v: string) => { let d = v.replace(/\D/g, "").slice(0, 4); if (d.length >= 3) d = d.slice(0, 2) + "/" + d.slice(2); return d; };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ number: true, name: true, expiry: true, cvv: true });
    if (Object.keys(errs).length) return;
    const last4 = values.number.replace(/\s/g, "").slice(-4);
    addItem({ type: "credit-card", label: `${values.name} ••••${last4}`, sublabel: `Expires ${values.expiry}` });
  };

  return (
    <ModalShell title="Add Credit Card">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <MaskedInput label="Card Number" placeholder="4242 4242 4242 4242" value={values.number} onChange={set("number", fmtNumber)} onBlur={blur("number")} error={touched.number ? errors.number : undefined} inputMode="numeric" />
        <TextInput label="Cardholder Name" placeholder="Full Name" value={values.name} onChange={set("name")} onBlur={blur("name")} error={touched.name ? errors.name : undefined} autoComplete="cc-name" />
        <div className="grid grid-cols-2 gap-3">
          <TextInput label="Expiry" placeholder="MM/YY" value={values.expiry} onChange={set("expiry", fmtExpiry)} onBlur={blur("expiry")} error={touched.expiry ? errors.expiry : undefined} inputMode="numeric" />
          <MaskedInput label="CVV" placeholder="•••" value={values.cvv} onChange={set("cvv")} onBlur={blur("cvv")} error={touched.cvv ? errors.cvv : undefined} inputMode="numeric" maxLength={4} />
        </div>
        <SubmitButton>Save Card</SubmitButton>
      </form>
    </ModalShell>
  );
};
