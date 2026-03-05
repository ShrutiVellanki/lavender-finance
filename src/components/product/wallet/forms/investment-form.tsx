"use client";

import { useState } from "react";
import { ModalShell } from "../modal-shell";
import { TextInput, SelectInput, MaskedInput, SubmitButton } from "../form-primitives";
import { useModal } from "../modal-context";

interface Values {
  brokerage: string;
  accountNumber: string;
  portfolioType: string;
  value: string;
}

type Errors = Partial<Values>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.brokerage.trim()) e.brokerage = "Brokerage name is required";
  if (!/^[A-Z0-9\-]{4,20}$/i.test(v.accountNumber)) e.accountNumber = "Account number must be 4–20 characters";
  if (!v.portfolioType) e.portfolioType = "Select a portfolio type";
  if (v.value && !/^\d+(\.\d{1,2})?$/.test(v.value)) e.value = "Enter a valid dollar amount";
  return e;
}

export const InvestmentForm = () => {
  const { addItem } = useModal();
  const [values, setValues] = useState<Values>({ brokerage: "", accountNumber: "", portfolioType: "", value: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});

  const set = (field: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    setTouched({ brokerage: true, accountNumber: true, portfolioType: true, value: true });
    if (Object.keys(errs).length) return;
    const last4 = values.accountNumber.slice(-4);
    const val = values.value ? `$${parseFloat(values.value).toLocaleString()}` : "";
    addItem({ type: "investment", label: `${values.brokerage} ••${last4}`, sublabel: `${values.portfolioType.toUpperCase()}${val ? ` · ${val}` : ""}` });
  };

  return (
    <ModalShell title="Add Investment Account">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextInput label="Brokerage" placeholder="Fidelity" value={values.brokerage} onChange={set("brokerage")} onBlur={blur("brokerage")} error={touched.brokerage ? errors.brokerage : undefined} />
        <MaskedInput label="Account Number" placeholder="X12345678" value={values.accountNumber} onChange={set("accountNumber")} onBlur={blur("accountNumber")} error={touched.accountNumber ? errors.accountNumber : undefined} />
        <SelectInput label="Portfolio Type" value={values.portfolioType} onChange={set("portfolioType")} onBlur={blur("portfolioType")} error={touched.portfolioType ? errors.portfolioType : undefined}
          options={[{ value: "brokerage", label: "Brokerage" }, { value: "ira", label: "IRA" }, { value: "roth-ira", label: "Roth IRA" }, { value: "401k", label: "401(k)" }]}
        />
        <TextInput label="Current Value ($) — optional" placeholder="24500.00" value={values.value} onChange={set("value")} onBlur={blur("value")} error={touched.value ? errors.value : undefined} inputMode="decimal" />
        <SubmitButton>Save Account</SubmitButton>
      </form>
    </ModalShell>
  );
};
