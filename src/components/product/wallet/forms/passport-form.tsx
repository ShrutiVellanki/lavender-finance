"use client";

import { useState } from "react";
import { ModalShell } from "../modal-shell";
import { TextInput, MaskedInput, SubmitButton } from "../form-primitives";
import { useModal } from "../modal-context";

interface Values {
  fullName: string;
  passportNumber: string;
  country: string;
  expiry: string;
}

type Errors = Partial<Values>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.fullName.trim()) e.fullName = "Full name is required";
  if (!/^[A-Z0-9]{6,9}$/i.test(v.passportNumber)) e.passportNumber = "Must be 6–9 alphanumeric characters";
  if (!v.country.trim()) e.country = "Country is required";
  if (!/^\d{2}\/\d{4}$/.test(v.expiry)) e.expiry = "Use MM/YYYY format";
  else {
    const [mm, yyyy] = v.expiry.split("/").map(Number);
    const exp = new Date(yyyy, mm - 1, 1);
    if (exp <= new Date()) e.expiry = "Passport appears to be expired";
  }
  return e;
}

export const PassportForm = () => {
  const { addItem } = useModal();
  const [values, setValues] = useState<Values>({ fullName: "", passportNumber: "", country: "", expiry: "" });
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

  const fmtExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 6);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ fullName: true, passportNumber: true, country: true, expiry: true });
    if (Object.keys(errs).length) return;
    addItem({ type: "passport", label: values.fullName, sublabel: `${values.country} · Expires ${values.expiry}` });
  };

  return (
    <ModalShell title="Add Passport">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextInput label="Full Name (as on passport)" placeholder="SMITH JOHN" value={values.fullName} onChange={set("fullName")} onBlur={blur("fullName")} error={touched.fullName ? errors.fullName : undefined} />
        <MaskedInput label="Passport Number" placeholder="A12345678" value={values.passportNumber} onChange={(e) => { const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 9); setValues((p) => ({ ...p, passportNumber: v })); if (touched.passportNumber) setErrors((err) => ({ ...err, passportNumber: validate({ ...values, passportNumber: v }).passportNumber })); }} onBlur={blur("passportNumber")} error={touched.passportNumber ? errors.passportNumber : undefined} />
        <TextInput label="Country of Issue" placeholder="United States" value={values.country} onChange={set("country")} onBlur={blur("country")} error={touched.country ? errors.country : undefined} />
        <TextInput label="Expiry Date (MM/YYYY)" placeholder="09/2032" value={values.expiry} onChange={set("expiry", fmtExpiry)} onBlur={blur("expiry")} error={touched.expiry ? errors.expiry : undefined} inputMode="numeric" />
        <SubmitButton>Save Passport</SubmitButton>
      </form>
    </ModalShell>
  );
};
