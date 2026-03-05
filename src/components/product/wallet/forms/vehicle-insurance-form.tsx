"use client";

import { useState } from "react";
import { ModalShell } from "../modal-shell";
import { TextInput, SelectInput, MaskedInput, SubmitButton } from "../form-primitives";
import { useModal } from "../modal-context";

interface Values {
  provider: string;
  policyNumber: string;
  vehicle: string;
  coverageType: string;
  premium: string;
}

type Errors = Partial<Values>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.provider.trim()) e.provider = "Provider is required";
  if (!/^[A-Z0-9\-]{6,20}$/i.test(v.policyNumber)) e.policyNumber = "Policy number must be 6–20 characters";
  if (!v.vehicle.trim()) e.vehicle = "Vehicle description is required";
  if (!v.coverageType) e.coverageType = "Select a coverage type";
  if (v.premium && !/^\d+(\.\d{1,2})?$/.test(v.premium)) e.premium = "Enter a valid dollar amount";
  return e;
}

export const VehicleInsuranceForm = () => {
  const { addItem } = useModal();
  const [values, setValues] = useState<Values>({ provider: "", policyNumber: "", vehicle: "", coverageType: "", premium: "" });
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
    setTouched({ provider: true, policyNumber: true, vehicle: true, coverageType: true, premium: true });
    if (Object.keys(errs).length) return;
    addItem({ type: "vehicle-insurance", label: `${values.provider} · ${values.vehicle}`, sublabel: `${values.coverageType}${values.premium ? ` · $${parseFloat(values.premium).toFixed(2)}/mo` : ""}` });
  };

  return (
    <ModalShell title="Add Vehicle Insurance">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextInput label="Insurance Provider" placeholder="State Farm" value={values.provider} onChange={set("provider")} onBlur={blur("provider")} error={touched.provider ? errors.provider : undefined} />
        <MaskedInput label="Policy Number" placeholder="SF-123456789" value={values.policyNumber} onChange={set("policyNumber")} onBlur={blur("policyNumber")} error={touched.policyNumber ? errors.policyNumber : undefined} />
        <TextInput label="Vehicle" placeholder="2022 Toyota Camry" value={values.vehicle} onChange={set("vehicle")} onBlur={blur("vehicle")} error={touched.vehicle ? errors.vehicle : undefined} />
        <SelectInput label="Coverage Type" value={values.coverageType} onChange={set("coverageType")} onBlur={blur("coverageType")} error={touched.coverageType ? errors.coverageType : undefined}
          options={[{ value: "Liability", label: "Liability" }, { value: "Collision", label: "Collision" }, { value: "Comprehensive", label: "Comprehensive" }, { value: "Full Coverage", label: "Full Coverage" }]}
        />
        <TextInput label="Monthly Premium ($) — optional" placeholder="142.00" value={values.premium} onChange={set("premium")} onBlur={blur("premium")} error={touched.premium ? errors.premium : undefined} inputMode="decimal" />
        <SubmitButton>Save Insurance</SubmitButton>
      </form>
    </ModalShell>
  );
};
