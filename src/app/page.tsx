"use client";
import type React from "react";
import { AccountInfo } from "../components/product/account/account-info/account-info";
import { useTheme, ThemeProvider } from "../theme-provider";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Accordion } from "../components/accordion/accordion";
import { aggregateBalancesByDate, groupAccountsByType, filterAccounts } from "@/utils/utils";
import NetWorthChart from "@/components/product/net-worth/net-worth";
import { fetchAccountData, fetchChartData } from "@/api/api";
import { useState, useEffect } from "react";
import { Account, AccountData, NetWorthData, AccountFilters, AccountType, AccountSubtype } from "../types";
import { AccountGroup } from "@/components/product/account/account-group/account-group";
import { AccountFiltersPanel } from "@/components/product/filters/account-filters";

const Home: React.FC = () => {
  const { theme } = useTheme();
  const [groupedAccounts, setGroupedAccounts] = useState<{ [key: string]: Account[] } | null>(null);
  const [filteredAccounts, setFilteredAccounts] = useState<{ [key: string]: Account[] } | null>(null);
  const [totalBalanceByDateArray, setTotalBalanceByDateArray] = useState<NetWorthData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AccountFilters>({
    types: Object.values(AccountType),
    subtypes: Object.values(AccountSubtype),
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
      end: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    fetchAccountData()
      .then((data) => {
        const grouped = groupAccountsByType(data);
        setGroupedAccounts(grouped);
        setFilteredAccounts(grouped);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchChartData()
      .then((data) => {
        const totalBalanceByDateArray = aggregateBalancesByDate(data);
        setTotalBalanceByDateArray(totalBalanceByDateArray);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (groupedAccounts) {
      const filtered = filterAccounts(groupedAccounts, filters);
      setFilteredAccounts(filtered);
    }
  }, [filters, groupedAccounts]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return !loading && !error ? (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col bg-lavenderDawn-base text-lavenderDawn-text dark:bg-lavenderMoon-base dark:text-lavenderMoon-text`}
    >
      <Navbar />
      <main className="flex-grow max-w-4xl w-full mx-auto p-4 space-y-6 mt-16 mb-20">
        <NetWorthChart totalBalanceByDateArray={totalBalanceByDateArray || []} />
        <AccountFiltersPanel filters={filters} onFilterChange={setFilters} />
        <div className="space-y-4">
          {filteredAccounts && Object.entries(filteredAccounts).map(([type, accounts]) => (
            <Accordion key={type} header={<AccountGroup type={type} />}>
              {accounts.map((account) => (
                <AccountInfo
                  key={account.name}
                  name={account.name}
                  balance={account.current_balance}
                  description={`${account.subtype} ****${account.name.slice(-4)}`}
                />
              ))}
            </Accordion>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  ) : (
    <></>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
}
