"use client";

import { useState } from "react";
import { ModalShell } from "../modal-shell";
import { TextInput, SelectInput, MaskedInput, SubmitButton } from "../form-primitives";
import { useModal } from "../modal-context";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

interface Values {
  fullName: string;
  licenseNumber: string;
  state: string;
  expiry: string;
  licenseClass: string;
}

type Errors = Partial<Values>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.fullName.trim()) e.fullName = "Full name is required";
  if (!/^[A-Z0-9]{5,15}$/i.test(v.licenseNumber)) e.licenseNumber = "Must be 5–15 alphanumeric characters";
  if (!v.state) e.state = "State is required";
  if (!/^\d{2}\/\d{4}$/.test(v.expiry)) e.expiry = "Use MM/YYYY format";
  if (!v.licenseClass) e.licenseClass = "Select a license class";
  return e;
}

export const DriversLicenseForm = () => {
  const { addItem } = useModal();
  const [values, setValues] = useState<Values>({ fullName: "", licenseNumber: "", state: "", expiry: "", licenseClass: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});

  const set = (field: keyof Values, formatter?: (v: string) => string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    setTouched({ fullName: true, licenseNumber: true, state: true, expiry: true, licenseClass: true });
    if (Object.keys(errs).length) return;
    addItem({ type: "drivers-license", label: values.fullName, sublabel: `${values.state} · Class ${values.licenseClass} · Exp ${values.expiry}` });
  };

  return (
    <ModalShell title="Add Driver's License">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextInput label="Full Name" placeholder="John Smith" value={values.fullName} onChange={set("fullName")} onBlur={blur("fullName")} error={touched.fullName ? errors.fullName : undefined} />
        <MaskedInput label="License Number" placeholder="D1234567" value={values.licenseNumber} onChange={set("licenseNumber")} onBlur={blur("licenseNumber")} error={touched.licenseNumber ? errors.licenseNumber : undefined} />
        <div className="grid grid-cols-2 gap-3">
          <SelectInput label="State" value={values.state} onChange={set("state")} onBlur={blur("state")} error={touched.state ? errors.state : undefined}
            options={US_STATES.map((s) => ({ value: s, label: s }))}
          />
          <SelectInput label="Class" value={values.licenseClass} onChange={set("licenseClass")} onBlur={blur("licenseClass")} error={touched.licenseClass ? errors.licenseClass : undefined}
            options={[{ value: "A", label: "Class A" }, { value: "B", label: "Class B" }, { value: "C", label: "Class C" }, { value: "M", label: "Motorcycle" }]}
          />
        </div>
        <TextInput label="Expiry (MM/YYYY)" placeholder="08/2030" value={values.expiry} onChange={set("expiry", fmtExpiry)} onBlur={blur("expiry")} error={touched.expiry ? errors.expiry : undefined} inputMode="numeric" />
        <SubmitButton>Save License</SubmitButton>
      </form>
    </ModalShell>
  );
};
