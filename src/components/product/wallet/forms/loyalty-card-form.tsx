"use client";

import { useState } from "react";
import { ModalShell } from "../modal-shell";
import { TextInput, MaskedInput, SubmitButton } from "../form-primitives";
import { useModal } from "../modal-context";

interface Values {
  program: string;
  cardNumber: string;
  points: string;
  tier: string;
}

type Errors = Partial<Values>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.program.trim()) e.program = "Program name is required";
  if (!/^[A-Z0-9\-]{6,20}$/i.test(v.cardNumber.replace(/\s/g, ""))) e.cardNumber = "Card number must be 6–20 alphanumeric characters";
  if (v.points && !/^\d+$/.test(v.points)) e.points = "Points must be a whole number";
  return e;
}

export const LoyaltyCardForm = () => {
  const { addItem } = useModal();
  const [values, setValues] = useState<Values>({ program: "", cardNumber: "", points: "", tier: "" });
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
    setTouched({ program: true, cardNumber: true, points: true, tier: true });
    if (Object.keys(errs).length) return;
    const pts = values.points ? `${parseInt(values.points).toLocaleString()} pts` : "0 pts";
    addItem({ type: "loyalty-card", label: values.program, sublabel: `${pts}${values.tier ? ` · ${values.tier}` : ""}` });
  };

  return (
    <ModalShell title="Add Loyalty Card">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextInput label="Loyalty Program" placeholder="United MileagePlus" value={values.program} onChange={set("program")} onBlur={blur("program")} error={touched.program ? errors.program : undefined} />
        <MaskedInput label="Card / Member Number" placeholder="UA-123456789" value={values.cardNumber} onChange={set("cardNumber")} onBlur={blur("cardNumber")} error={touched.cardNumber ? errors.cardNumber : undefined} />
        <TextInput label="Points Balance — optional" placeholder="42000" value={values.points} onChange={set("points")} onBlur={blur("points")} error={touched.points ? errors.points : undefined} inputMode="numeric" />
        <TextInput label="Tier / Status — optional" placeholder="Gold" value={values.tier} onChange={set("tier")} onBlur={blur("tier")} error={touched.tier ? errors.tier : undefined} />
        <SubmitButton>Save Card</SubmitButton>
      </form>
    </ModalShell>
  );
};
