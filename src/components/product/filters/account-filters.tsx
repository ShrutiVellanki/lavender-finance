"use client";
import type React from "react";
import { AccountType, AccountSubtype } from "@/types";
import type { AccountFilters } from "@/types";

interface AccountFiltersPanelProps {
  filters: AccountFilters;
  onFilterChange: (filters: AccountFilters) => void;
}

export const AccountFiltersPanel: React.FC<AccountFiltersPanelProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleTypeChange = (type: AccountType) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onFilterChange({ ...filters, types: newTypes });
  };

  const handleSubtypeChange = (subtype: AccountSubtype) => {
    const newSubtypes = filters.subtypes.includes(subtype)
      ? filters.subtypes.filter((s) => s !== subtype)
      : [...filters.subtypes, subtype];
    onFilterChange({ ...filters, subtypes: newSubtypes });
  };

  const handleDateRangeChange = (start: string, end: string) => {
    onFilterChange({
      ...filters,
      dateRange: { start, end },
    });
  };

  return (
    <div className="space-y-4 p-4 bg-lavenderDawn-highlightLow rounded-lg">
      <div>
        <h3 className="text-lg font-semibold mb-2">Account Types</h3>
        <div className="flex flex-wrap gap-2">
          {Object.values(AccountType).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.types.includes(type)
                  ? "bg-lavenderDawn-highlightMed text-lavenderDawn-text"
                  : "bg-lavenderDawn-base text-lavenderDawn-text"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Account Subtypes</h3>
        <div className="flex flex-wrap gap-2">
          {Object.values(AccountSubtype).map((subtype) => (
            <button
              key={subtype}
              onClick={() => handleSubtypeChange(subtype)}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.subtypes.includes(subtype)
                  ? "bg-lavenderDawn-highlightMed text-lavenderDawn-text"
                  : "bg-lavenderDawn-base text-lavenderDawn-text"
              }`}
            >
              {subtype}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Date Range</h3>
        <div className="flex gap-4">
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) =>
              handleDateRangeChange(e.target.value, filters.dateRange.end)
            }
            className="px-3 py-1 rounded bg-lavenderDawn-base text-lavenderDawn-text"
          />
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) =>
              handleDateRangeChange(filters.dateRange.start, e.target.value)
            }
            className="px-3 py-1 rounded bg-lavenderDawn-base text-lavenderDawn-text"
          />
        </div>
      </div>
    </div>
  );
}; 