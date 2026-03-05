"use client";

import { useState } from "react";
import { ModalShell } from "../modal-shell";
import { TextInput, SelectInput, MaskedInput, SubmitButton } from "../form-primitives";
import { useModal } from "../modal-context";

interface Values {
  nickname: string;
  routingNumber: string;
  accountNumber: string;
  accountType: string;
}

type Errors = Partial<Values>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.nickname.trim()) e.nickname = "Nickname is required";
  if (!/^\d{9}$/.test(v.routingNumber)) e.routingNumber = "Must be exactly 9 digits";
  if (!/^\d{4,17}$/.test(v.accountNumber)) e.accountNumber = "Must be 4–17 digits";
  if (!v.accountType) e.accountType = "Select an account type";
  return e;
}

export const BankAccountForm = () => {
  const { addItem } = useModal();
  const [values, setValues] = useState<Values>({ nickname: "", routingNumber: "", accountNumber: "", accountType: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});

  const set = (field: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.value.replace(field !== "nickname" && field !== "accountType" ? /\D/g : /^/, "");
    setValues((v) => ({ ...v, [field]: field === "routingNumber" || field === "accountNumber" ? e.target.value.replace(/\D/g, "") : e.target.value }));
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
    setTouched({ nickname: true, routingNumber: true, accountNumber: true, accountType: true });
    if (Object.keys(errs).length) return;
    const last4 = values.accountNumber.slice(-4);
    addItem({
      type: "bank-account",
      label: `${values.nickname} ••${last4}`,
      sublabel: values.accountType.charAt(0).toUpperCase() + values.accountType.slice(1),
    });
  };

  return (
    <ModalShell title="Add Bank Account">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextInput label="Nickname" placeholder="Chase Checking" value={values.nickname} onChange={set("nickname")} onBlur={blur("nickname")} error={touched.nickname ? errors.nickname : undefined} />
        <MaskedInput label="Routing Number" placeholder="021000021" value={values.routingNumber} onChange={set("routingNumber")} onBlur={blur("routingNumber")} error={touched.routingNumber ? errors.routingNumber : undefined} inputMode="numeric" maxLength={9} />
        <MaskedInput label="Account Number" placeholder="000123456789" value={values.accountNumber} onChange={set("accountNumber")} onBlur={blur("accountNumber")} error={touched.accountNumber ? errors.accountNumber : undefined} inputMode="numeric" maxLength={17} />
        <SelectInput label="Account Type" value={values.accountType} onChange={set("accountType")} onBlur={blur("accountType")} error={touched.accountType ? errors.accountType : undefined}
          options={[{ value: "checking", label: "Checking" }, { value: "savings", label: "Savings" }, { value: "money-market", label: "Money Market" }]}
        />
        <SubmitButton>Save Account</SubmitButton>
      </form>
    </ModalShell>
  );
};
