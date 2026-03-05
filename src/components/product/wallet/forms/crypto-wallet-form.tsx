"use client";

import { useState } from "react";
import { ModalShell } from "../modal-shell";
import { TextInput, SelectInput, MaskedInput, SubmitButton } from "../form-primitives";
import { useModal } from "../modal-context";

interface Values {
  label: string;
  address: string;
  network: string;
}

type Errors = Partial<Values>;

const ADDRESS_RULES: Record<string, RegExp> = {
  ethereum: /^0x[a-fA-F0-9]{40}$/,
  bitcoin: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[ac-hj-np-z02-9]{39,59}$/,
  solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  polygon: /^0x[a-fA-F0-9]{40}$/,
};

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.label.trim()) e.label = "Label is required";
  if (!v.network) e.network = "Select a network";
  const rule = ADDRESS_RULES[v.network];
  if (v.network && !v.address) e.address = "Wallet address is required";
  else if (rule && v.address && !rule.test(v.address)) e.address = `Invalid ${v.network} address`;
  return e;
}

export const CryptoWalletForm = () => {
  const { addItem } = useModal();
  const [values, setValues] = useState<Values>({ label: "", address: "", network: "" });
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
    setTouched({ label: true, address: true, network: true });
    if (Object.keys(errs).length) return;
    const short = `${values.address.slice(0, 6)}…${values.address.slice(-4)}`;
    addItem({ type: "crypto-wallet", label: values.label, sublabel: `${values.network} · ${short}` });
  };

  return (
    <ModalShell title="Add Crypto Wallet">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextInput label="Wallet Label" placeholder="My ETH Wallet" value={values.label} onChange={set("label")} onBlur={blur("label")} error={touched.label ? errors.label : undefined} />
        <SelectInput label="Network" value={values.network} onChange={set("network")} onBlur={blur("network")} error={touched.network ? errors.network : undefined}
          options={[{ value: "ethereum", label: "Ethereum (ERC-20)" }, { value: "bitcoin", label: "Bitcoin" }, { value: "solana", label: "Solana" }, { value: "polygon", label: "Polygon" }]}
        />
        <MaskedInput label="Wallet Address" placeholder="0x71C7656…" value={values.address} onChange={set("address")} onBlur={blur("address")} error={touched.address ? errors.address : undefined} />
        <SubmitButton>Save Wallet</SubmitButton>
      </form>
    </ModalShell>
  );
};
