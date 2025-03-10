"use client";
import type React from "react";
import { AccountInfo } from "../components/product/account/account-info/account-info";
import { useTheme, ThemeProvider } from "../theme-provider";
import { ThemeSwitcher } from "../components/theme-switcher";
import { Accordion } from "../components/accordion/accordion";
import { aggregateBalancesByDate, groupAccountsByType } from "@/utils/utils";
import NetWorthChart from "@/components/product/net-worth/net-worth";
import AccountGroup from "@/components/product/account/account-group/account-group";
import { fetchAccountData, fetchChartData } from "@/api/api";
import { useState, useEffect } from "react";

const Home: React.FC = () => {
  const { theme } = useTheme();
  const [groupedAccounts, setGroupedAccounts] = useState<any>(null);
  const [totalBalanceByDateArray, setTotalBalanceByDateArray] =
    useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccountData()
      .then((data) => {
        setGroupedAccounts(groupAccountsByType(data));
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
      <ThemeSwitcher />
      <main className="flex-grow max-w-4xl w-full mx-auto p-4 space-y-6 mt-16 mb-20">
        <NetWorthChart totalBalanceByDateArray={totalBalanceByDateArray} />
        <div className="space-y-4">
          {Object.keys(groupedAccounts).map((type) => (
            <Accordion key={type} header={<AccountGroup type={type as any} />}>
              {groupedAccounts[type].map((account: any) => (
                <AccountInfo
                  key={account.name}
                  name={account.name}
                  balance={account.current_balance}
                  description={`${account.subtype} ****${account.number.toString().slice(-4)}`}
                />
              ))}
            </Accordion>
          ))}
        </div>
      </main>
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
