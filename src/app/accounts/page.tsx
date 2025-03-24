"use client";
import type React from "react";
import { AccountInfo } from "@/components/product/account/account-info/account-info";
import { useTheme, ThemeProvider } from "@/theme-provider";
import { Navbar } from "@/components/layout/navbar/navbar";
import { Footer } from "@/components/layout/footer/footer";
import { Accordion } from "@/components/accordion/accordion";
import { aggregateBalancesByDate, groupAccountsByType } from "@/utils/utils";
import NetWorthChart from "@/components/product/net-worth/net-worth";
import { fetchAccountData, fetchChartData } from "@/api/api";
import { useState, useEffect } from "react";
import { Account, NetWorthData } from "@/types";
import { AccountGroup } from "@/components/product/account/account-group/account-group";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";

const AccountsPage: React.FC = () => {
  const { theme } = useTheme();
  const [groupedAccounts, setGroupedAccounts] = useState<{ [key: string]: Account[] } | null>(null);
  const [totalBalanceByDateArray, setTotalBalanceByDateArray] = useState<NetWorthData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [accountData, chartData] = await Promise.all([
        fetchAccountData(),
        fetchChartData()
      ]);

      const grouped = groupAccountsByType(accountData);
      const totalBalanceByDateArray = aggregateBalancesByDate(chartData);
      
      setGroupedAccounts(grouped);
      setTotalBalanceByDateArray(totalBalanceByDateArray);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={fetchData} />;
  }

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col bg-lavenderDawn-base text-lavenderDawn-text dark:bg-lavenderMoon-base dark:text-lavenderMoon-text`}
    >
      <Navbar />
      <main className="flex-grow max-w-4xl w-full mx-auto p-6 space-y-8 mt-16">
        <div className="space-y-8">
          <NetWorthChart totalBalanceByDateArray={totalBalanceByDateArray || []} />
          <div className="space-y-4">
            {groupedAccounts && Object.entries(groupedAccounts).map(([type, accounts]) => (
              <Accordion 
                key={type} 
                header={<AccountGroup type={type} accounts={accounts} />}
                variant="default"
                headerClassName="hover:bg-lavenderDawn-highlightLow/20 dark:hover:bg-lavenderMoon-highlightLow/10 transition-all duration-200"
              >
                {accounts.map((account) => (
                  <AccountInfo
                    key={account.name}
                    name={account.name}
                    balance={account.current_balance}
                    subtype={account.subtype}
                  />
                ))}
              </Accordion>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AccountsPage />
    </ThemeProvider>
  );
} 