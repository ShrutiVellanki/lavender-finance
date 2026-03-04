"use client";

import { Layout } from "@/components/layout/layout";
import { OtpInput } from "@/components/product/otp-input/otp-input";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function OtpPage() {
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState("");

  const handleComplete = (otp: string) => {
    setCode(otp);
    setSubmitted(true);
  };

  return (
    <Layout>
      <div className="md:p-0 p-6">
        <div className="max-w-lg mx-auto space-y-8 py-6">
          {/* Header */}
          <div className="px-6 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
            <h1 className="text-2xl font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
              Verification
            </h1>
          </div>

          {/* OTP Form */}
          <div className="rounded-2xl border border-lavenderDawn-overlay dark:border-lavenderMoon-overlay bg-lavenderDawn-overlay/50 dark:bg-[#636363]/50 backdrop-blur-sm p-8">
            {submitted ? (
              <div className="text-center space-y-3 py-8">
                <ShieldCheck className="w-12 h-12 mx-auto text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
                <p className="text-base font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
                  Code verified successfully!
                </p>
                <p className="text-sm font-mono text-lavenderDawn-subtle dark:text-lavenderMoon-subtle">
                  {code}
                </p>
                <button
                  onClick={() => { setSubmitted(false); setCode(""); }}
                  className="text-sm text-lavenderDawn-iris dark:text-lavenderMoon-iris hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <p className="text-sm text-lavenderDawn-subtle dark:text-lavenderMoon-subtle">
                    Enter the 6-digit code sent to your device
                  </p>
                </div>
                <OtpInput length={6} onComplete={handleComplete} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
