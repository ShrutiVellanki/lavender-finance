"use client";

import type React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// ─── Field ────────────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({ label, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium uppercase tracking-widest text-lavenderDawn-subtle dark:text-lavenderMoon-subtle">
      {label}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
    )}
  </div>
);

// ─── Base input className ─────────────────────────────────────────────────────

export const inputCls = (hasError?: boolean) =>
  `w-full bg-lavenderDawn-overlay dark:bg-lavenderMoon-overlay border rounded-lg px-3 py-2.5 text-sm text-lavenderDawn-text dark:text-lavenderMoon-text placeholder:text-lavenderDawn-muted dark:placeholder:text-lavenderMoon-muted focus:outline-none focus:ring-2 transition-all duration-200 font-mono tracking-wide ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-400/30"
      : "border-lavenderDawn-highlightMed dark:border-lavenderMoon-highlightMed focus:border-lavenderDawn-iris dark:focus:border-lavenderMoon-iris focus:ring-lavenderDawn-iris/30 dark:focus:ring-lavenderMoon-iris/30"
  }`;

// ─── TextInput ────────────────────────────────────────────────────────────────

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ label, error, className, ...props }) => (
  <Field label={label} error={error}>
    <input {...props} className={inputCls(!!error)} />
  </Field>
);

// ─── SelectInput ─────────────────────────────────────────────────────────────

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const SelectInput: React.FC<SelectInputProps> = ({ label, error, options, ...props }) => (
  <Field label={label} error={error}>
    <select
      {...props}
      className={`${inputCls(!!error)} font-sans`}
    >
      <option value="">Select…</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </Field>
);

// ─── MaskedInput ──────────────────────────────────────────────────────────────
// Shows a "show/hide" toggle; actual masking is done by type="password" when hidden

interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  maskDisplay?: string; // what to show when masked (e.g. "•••• •••• ••1234")
}

export const MaskedInput: React.FC<MaskedInputProps> = ({
  label,
  error,
  maskDisplay,
  value,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Field label={label} error={error}>
      <div className="relative">
        <input
          {...props}
          value={value}
          type={visible ? "text" : "password"}
          className={`${inputCls(!!error)} pr-10`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide" : "Show"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:text-lavenderDawn-subtle dark:hover:text-lavenderMoon-subtle transition-colors"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </Field>
  );
};

// ─── SubmitButton ─────────────────────────────────────────────────────────────

export const SubmitButton: React.FC<{ children?: React.ReactNode }> = ({ children = "Save" }) => (
  <button
    type="submit"
    className="w-full py-3 rounded-xl font-medium text-sm tracking-wide text-white bg-gradient-to-r from-lavenderDawn-iris to-lavenderDawn-pine dark:from-lavenderMoon-iris dark:to-lavenderMoon-pine hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-lavenderDawn-iris/20 dark:shadow-lavenderMoon-iris/20"
  >
    {children}
  </button>
);
