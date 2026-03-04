"use client";

import { Layout } from "@/components/layout/layout";
import { CreditCardForm } from "@/components/product/credit-card/credit-card";
import { CreditCard } from "lucide-react";
import { useState } from "react";

export default function CardsPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Layout>
      <div className="md:p-0 p-6">
        <div className="max-w-lg mx-auto space-y-8 py-6">
          {/* Header */}
          <div className="px-6 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
            <h1 className="text-2xl font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
              Add a Card
            </h1>
          </div>

          {/* Card Form */}
          <div className="rounded-2xl border border-lavenderDawn-overlay dark:border-lavenderMoon-overlay bg-lavenderDawn-overlay/50 dark:bg-[#636363]/50 backdrop-blur-sm p-8">
            {submitted ? (
              <div className="text-center space-y-3 py-8">
                <CreditCard className="w-12 h-12 mx-auto text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
                <p className="text-base font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
                  Card added successfully!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm text-lavenderDawn-iris dark:text-lavenderMoon-iris hover:underline"
                >
                  Add another card
                </button>
              </div>
            ) : (
              <CreditCardForm onSubmit={() => setSubmitted(true)} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
