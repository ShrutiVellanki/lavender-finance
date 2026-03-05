"use client";

import { useState } from "react";
import { ModalShell } from "../modal-shell";
import { TextInput, SelectInput, MaskedInput, SubmitButton } from "../form-primitives";
import { useModal } from "../modal-context";

interface Values {
  provider: string;
  memberId: string;
  groupNumber: string;
  planType: string;
  copay: string;
}

type Errors = Partial<Values>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.provider.trim()) e.provider = "Provider is required";
  if (!/^[A-Z0-9]{5,15}$/i.test(v.memberId)) e.memberId = "Member ID must be 5–15 alphanumeric characters";
  if (!v.groupNumber.trim()) e.groupNumber = "Group number is required";
  if (!v.planType) e.planType = "Select a plan type";
  if (v.copay && !/^\d+(\.\d{1,2})?$/.test(v.copay)) e.copay = "Enter a valid dollar amount";
  return e;
}

export const HealthInsuranceForm = () => {
  const { addItem } = useModal();
  const [values, setValues] = useState<Values>({ provider: "", memberId: "", groupNumber: "", planType: "", copay: "" });
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
    setTouched({ provider: true, memberId: true, groupNumber: true, planType: true, copay: true });
    if (Object.keys(errs).length) return;
    addItem({ type: "health-insurance", label: `${values.provider} · ${values.planType.toUpperCase()}`, sublabel: `Member ${values.memberId.slice(0, 3)}•••` });
  };

  return (
    <ModalShell title="Add Health Insurance">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextInput label="Insurance Provider" placeholder="Blue Cross Blue Shield" value={values.provider} onChange={set("provider")} onBlur={blur("provider")} error={touched.provider ? errors.provider : undefined} />
        <MaskedInput label="Member ID" placeholder="XYZ123456" value={values.memberId} onChange={set("memberId")} onBlur={blur("memberId")} error={touched.memberId ? errors.memberId : undefined} />
        <MaskedInput label="Group Number" placeholder="00123456" value={values.groupNumber} onChange={set("groupNumber")} onBlur={blur("groupNumber")} error={touched.groupNumber ? errors.groupNumber : undefined} />
        <SelectInput label="Plan Type" value={values.planType} onChange={set("planType")} onBlur={blur("planType")} error={touched.planType ? errors.planType : undefined}
          options={[{ value: "hmo", label: "HMO" }, { value: "ppo", label: "PPO" }, { value: "epo", label: "EPO" }, { value: "hdhp", label: "HDHP" }]}
        />
        <TextInput label="Copay ($) — optional" placeholder="25.00" value={values.copay} onChange={set("copay")} onBlur={blur("copay")} error={touched.copay ? errors.copay : undefined} inputMode="decimal" />
        <SubmitButton>Save Insurance</SubmitButton>
      </form>
    </ModalShell>
  );
};
