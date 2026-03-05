"use client";

import { useState } from "react";
import { ModalShell } from "../modal-shell";
import { MaskedInput, TextInput, SubmitButton } from "../form-primitives";
import { useModal } from "../modal-context";

interface Values {
  ssn: string;
  fullName: string;
  dob: string;
}

type Errors = Partial<Values>;

function validate(v: Values): Errors {
  const e: Errors = {};
  const raw = v.ssn.replace(/\D/g, "");
  if (raw.length !== 9) e.ssn = "SSN must be 9 digits";
  else if (/^000|^666|^9/.test(raw)) e.ssn = "Invalid SSN (invalid area number)";
  else if (raw.slice(3, 5) === "00") e.ssn = "Invalid SSN (zero group number)";
  else if (raw.slice(5) === "0000") e.ssn = "Invalid SSN (zero serial number)";
  if (!v.fullName.trim()) e.fullName = "Full name is required";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.dob)) e.dob = "Use YYYY-MM-DD format";
  return e;
}

export const SsnForm = () => {
  const { addItem } = useModal();
  const [values, setValues] = useState<Values>({ ssn: "", fullName: "", dob: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});

  const fmtSsn = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 9);
    if (d.length > 5) return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
    if (d.length > 3) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return d;
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ ssn: true, fullName: true, dob: true });
    if (Object.keys(errs).length) return;
    addItem({ type: "ssn", label: values.fullName, sublabel: `SSN ••• •• ${values.ssn.slice(-4)}` });
  };

  return (
    <ModalShell title="Add Social Security Number">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextInput label="Full Legal Name" placeholder="John Smith" value={values.fullName} onChange={set("fullName")} onBlur={blur("fullName")} error={touched.fullName ? errors.fullName : undefined} />
        <MaskedInput label="Social Security Number" placeholder="•••-••-••••" value={values.ssn} onChange={set("ssn", fmtSsn)} onBlur={blur("ssn")} error={touched.ssn ? errors.ssn : undefined} inputMode="numeric" />
        <TextInput label="Date of Birth" placeholder="1990-01-15" value={values.dob} onChange={set("dob")} onBlur={blur("dob")} error={touched.dob ? errors.dob : undefined} type="date" />
        <SubmitButton>Save SSN</SubmitButton>
      </form>
    </ModalShell>
  );
};
