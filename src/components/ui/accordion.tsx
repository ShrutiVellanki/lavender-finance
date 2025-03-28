import { ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";

export const Accordion: React.FC = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-lavenderDawn-iris dark:border-lavenderMoon-iris rounded-lg">
      <button
        className="flex items-center justify-between w-full p-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Accordion Title</span>
        <ChevronDownIcon
          className={`h-6 w-6 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};
