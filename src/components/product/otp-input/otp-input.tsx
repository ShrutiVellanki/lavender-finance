"use client";

import type React from "react";
import { useRef, useState, useCallback } from "react";

export interface OtpInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onComplete }) => {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focus = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/\D/g, "").slice(-1);
      const next = [...digits];
      next[index] = digit;
      setDigits(next);

      if (digit && index < length - 1) {
        focus(index + 1);
      }

      if (next.every((d) => d !== "")) {
        onComplete?.(next.join(""));
      }
    },
    [digits, length, onComplete]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (digits[index]) {
          const next = [...digits];
          next[index] = "";
          setDigits(next);
        } else if (index > 0) {
          const next = [...digits];
          next[index - 1] = "";
          setDigits(next);
          focus(index - 1);
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        focus(index - 1);
      } else if (e.key === "ArrowRight" && index < length - 1) {
        focus(index + 1);
      }
    },
    [digits, length]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      if (!pasted) return;

      const next = Array(length).fill("");
      pasted.split("").forEach((char, i) => {
        next[i] = char;
      });
      setDigits(next);

      const lastFilled = Math.min(pasted.length, length - 1);
      focus(lastFilled);

      if (pasted.length === length) {
        onComplete?.(pasted);
      }
    },
    [length, onComplete]
  );

  return (
    <div className="flex gap-3 justify-center" role="group" aria-label="One-time passcode">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className="w-12 h-14 text-center text-xl font-mono font-semibold rounded-xl border-2 bg-lavenderDawn-overlay dark:bg-lavenderMoon-overlay text-lavenderDawn-text dark:text-lavenderMoon-text border-lavenderDawn-highlightMed dark:border-lavenderMoon-highlightMed focus:outline-none focus:border-lavenderDawn-iris dark:focus:border-lavenderMoon-iris focus:ring-2 focus:ring-lavenderDawn-iris/30 dark:focus:ring-lavenderMoon-iris/30 transition-all duration-200 caret-transparent"
        />
      ))}
    </div>
  );
};
