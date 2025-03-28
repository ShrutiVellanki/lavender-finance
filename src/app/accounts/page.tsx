"use client";

import { Layout } from "@/components/layout/layout";
import { AccountInfo } from "@/components/product/account/account-info/account-info";
import { Accordion } from "@/components/accordion/accordion";
import { aggregateBalancesByDate, groupAccountsByType } from "@/utils/utils";
import NetWorthChart from "@/components/product/net-worth/net-worth";
import { fetchAccountData, fetchChartData } from "@/api/api";
import { useState, useEffect } from "react";
import { Account, NetWorthData } from "@/types";
import { AccountGroup } from "@/components/product/account/account-group/account-group";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";

interface FetchError {
  message: string;
}

export default function AccountsPage() {
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
    } catch (err) {
      const error = err as FetchError | Error;
      setError(error.message || "Failed to fetch data");
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
    <Layout>
      <div className="md:p-0 p-6 overflow-x-auto">
        <div className="space-y-8 min-w-[768px]">
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
      </div>
    </Layout>
  );
} 