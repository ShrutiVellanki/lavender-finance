"use client";

import { Layout } from "@/components/layout/layout";
import { useTheme } from "@/theme-provider";
import NetWorthChart from "@/components/product/net-worth/net-worth";
import { AccountGroup } from "@/components/product/account/account-group/account-group";
import { useState, useEffect } from "react";
import { Account, NetWorthData } from "@/types";
import { fetchAccountData, fetchChartData } from "@/api/api";
import { aggregateBalancesByDate, groupAccountsByType } from "@/utils/utils";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";
import { ArrowUpRight, ArrowDownRight, Wallet, CreditCard, LineChart, PiggyBank, Info, Gift } from "lucide-react";
import { Accordion } from "@/components/accordion/accordion";
import { AccountInfo } from "@/components/product/account/account-info/account-info";

interface FetchError {
  message: string;
}

export default function Dashboard() {
  const { theme } = useTheme();
  const [groupedAccounts, setGroupedAccounts] = useState<{ [key: string]: Account[] } | null>(null);
  const [totalBalanceByDateArray, setTotalBalanceByDateArray] = useState<NetWorthData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateTooltipPosition = (e: MouseEvent) => {
      const tooltip = document.documentElement;
      tooltip.style.setProperty('--tooltip-x', `${e.clientX + 16}px`);
      tooltip.style.setProperty('--tooltip-y', `${e.clientY - 16}px`);
    };

    document.addEventListener('mousemove', updateTooltipPosition);
    return () => document.removeEventListener('mousemove', updateTooltipPosition);
  }, []);

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

  // Calculate total assets and liabilities from chart data
  const calculateTotals = () => {
    let totalAssets = 0;
    let totalLiabilities = 0;

    if (totalBalanceByDateArray && totalBalanceByDateArray.length > 0) {
      // Get the latest data point from each account in the chart
      const latestData = totalBalanceByDateArray[totalBalanceByDateArray.length - 1];
      
      // For assets and liabilities, we need to look at individual accounts
      if (groupedAccounts) {
        Object.entries(groupedAccounts).forEach(([type, accounts]) => {
          accounts.forEach(account => {
            const balance = account.current_balance;
            if (balance < 0) {
              totalLiabilities += Math.abs(balance);
            } else {
              totalAssets += balance;
            }
          });
        });
      }

      // Adjust the totals to match the net worth from chart data
      const chartNetWorth = latestData.balance;
      const currentNetWorth = totalAssets - totalLiabilities;
      const adjustment = chartNetWorth - currentNetWorth;
      
      // Distribute the adjustment proportionally between assets and liabilities
      if (adjustment !== 0) {
        const totalAbsolute = totalAssets + totalLiabilities;
        if (totalAbsolute > 0) {
          const assetRatio = totalAssets / totalAbsolute;
          const liabilityRatio = totalLiabilities / totalAbsolute;
          
          if (adjustment > 0) {
            totalAssets += adjustment * assetRatio;
          } else {
            totalLiabilities += Math.abs(adjustment) * liabilityRatio;
          }
        }
      }
    }

    return { totalAssets, totalLiabilities };
  };

  const { totalAssets, totalLiabilities } = calculateTotals();
  const netWorth = totalBalanceByDateArray && totalBalanceByDateArray.length > 0
    ? totalBalanceByDateArray[totalBalanceByDateArray.length - 1].balance
    : totalAssets - totalLiabilities;
  const netWorthChange = totalBalanceByDateArray && totalBalanceByDateArray.length > 1
    ? ((totalBalanceByDateArray[totalBalanceByDateArray.length - 1].balance - 
        totalBalanceByDateArray[totalBalanceByDateArray.length - 2].balance) / 
        Math.abs(totalBalanceByDateArray[totalBalanceByDateArray.length - 2].balance)) * 100
    : 0;

  return (
    <Layout>
      <div className="md:p-0 p-6 overflow-x-auto">
        <div className="min-w-[768px] space-y-6">
          {/* Welcome Banner */}
          <div className="px-6 py-4 flex items-center gap-3">
            <PiggyBank className="w-10 h-10 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
            <h1 className="text-2xl font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
              Welcome back, Shruti!
            </h1>
          </div>

          {/* Latest Updates */}
          <div className="rounded-2xl border border-lavenderDawn-overlay dark:border-lavenderMoon-overlay bg-lavenderDawn-overlay/50 dark:bg-[#636363]/50 backdrop-blur-sm">
            <Accordion
              header={
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
                  <h2 className="text-lg font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">Latest Updates</h2>
                </div>
              }
              variant="default"
              headerClassName="p-6 hover:bg-lavenderDawn-highlightLow/30 dark:hover:bg-[#636363]/70 transition-all duration-200"
              contentClassName="space-y-2 px-6 pb-6"
            >
              <div className="rounded-lg bg-lavenderDawn-overlay/30 dark:bg-lavenderMoon-overlay/30">
                <div className="flex items-start gap-4 p-4">
                  <ArrowUpRight className="w-4 h-4 text-lavenderDawn-iris dark:text-lavenderMoon-iris mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
                          New Accounts View
                        </h3>
                        <p className="text-sm text-lavenderDawn-text/50 dark:text-lavenderMoon-text/50 mt-0.5">
                          Enhanced view of your accounts with detailed breakdowns and improved organization
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-lavenderDawn-overlay/30 dark:bg-lavenderMoon-overlay/30">
                <div className="flex items-start gap-4 p-4">
                  <LineChart className="w-4 h-4 text-lavenderDawn-iris dark:text-lavenderMoon-iris mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
                            Budgeting
                          </h3>
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10 text-lavenderDawn-iris dark:text-lavenderMoon-iris">
                            Coming Soon
                          </span>
                        </div>
                        <p className="text-sm text-lavenderDawn-text/50 dark:text-lavenderMoon-text/50 mt-0.5">
                          Set budgets, track expenses, and achieve your financial goals
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Accordion>
          </div>

          {/* Overview */}
          <div className="rounded-2xl border border-lavenderDawn-overlay dark:border-lavenderMoon-overlay bg-lavenderDawn-overlay/50 dark:bg-[#636363]/50 backdrop-blur-sm p-6 hover:bg-lavenderDawn-highlightLow/30 dark:hover:bg-[#636363]/70 transition-all duration-200">
            <h2 className="text-lg font-medium text-lavenderDawn-text dark:text-lavenderMoon-text mb-4">Overview</h2>
            <div className="space-y-2">
              {/* Net Worth */}
              <div className="rounded-lg bg-lavenderDawn-overlay/30 dark:bg-lavenderMoon-overlay/30">
                <div className="flex items-start gap-4 p-4">
                  <PiggyBank className="w-4 h-4 text-lavenderDawn-iris dark:text-lavenderMoon-iris mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
                          Net Worth
                        </h3>
                        <p className="text-sm text-lavenderDawn-text/50 dark:text-lavenderMoon-text/50 mt-0.5">
                          Your total assets minus total liabilities
                        </p>
                      </div>
                      <div>
                        <p className="text-base font-medium text-lavenderDawn-iris dark:text-lavenderMoon-iris text-right">
                          ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <div className={`flex items-center justify-end mt-0.5`}>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10 text-lavenderDawn-iris dark:text-lavenderMoon-iris">
                            {netWorthChange >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                            <span className="text-sm font-medium">{Math.abs(netWorthChange).toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Assets */}
              <div className="rounded-lg bg-lavenderDawn-overlay/30 dark:bg-lavenderMoon-overlay/30">
                <div className="flex items-start gap-4 p-4">
                  <Wallet className="w-4 h-4 text-lavenderDawn-iris dark:text-lavenderMoon-iris mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
                          Total Assets
                        </h3>
                        <p className="text-sm text-lavenderDawn-text/50 dark:text-lavenderMoon-text/50 mt-0.5">
                          The total value of all your assets, including cash, investments, and property
                        </p>
                      </div>
                      <p className="text-base font-medium text-lavenderDawn-iris dark:text-lavenderMoon-iris">
                        ${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Liabilities */}
              <div className="rounded-lg bg-lavenderDawn-overlay/30 dark:bg-lavenderMoon-overlay/30">
                <div className="flex items-start gap-4 p-4">
                  <CreditCard className="w-4 h-4 text-lavenderDawn-iris dark:text-lavenderMoon-iris mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
                          Total Liabilities
                        </h3>
                        <p className="text-sm text-lavenderDawn-text/50 dark:text-lavenderMoon-text/50 mt-0.5">
                          The total amount of all your debts, including loans, mortgages, and credit cards
                        </p>
                      </div>
                      <p className="text-base font-medium text-lavenderDawn-iris dark:text-lavenderMoon-iris">
                        ${totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Types */}
              <div className="rounded-lg bg-lavenderDawn-overlay/30 dark:bg-lavenderMoon-overlay/30">
                <div className="flex items-start gap-4 p-4">
                  <LineChart className="w-4 h-4 text-lavenderDawn-iris dark:text-lavenderMoon-iris mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
                          Account Types
                        </h3>
                        <p className="text-sm text-lavenderDawn-text/50 dark:text-lavenderMoon-text/50 mt-0.5">
                          The number of different account categories in your portfolio
                        </p>
                      </div>
                      <p className="text-base font-medium text-lavenderDawn-iris dark:text-lavenderMoon-iris">
                        {groupedAccounts ? Object.keys(groupedAccounts).length : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
