import { Layout } from "@/components/layout/layout";
import { useTheme } from "@/theme-provider";
import NetWorthChart from "@/components/product/net-worth/net-worth";
import { useState, useEffect, useMemo } from "react";
import { Account, NetWorthData, Transaction, BudgetCategory, SpendingSummary } from "@/types";
import {
  fetchAccountData,
  fetchChartData,
  fetchTransactions,
  fetchBudgets,
  fetchSpendingSummary,
} from "@/api/api";
import { aggregateBalancesByDate, groupAccountsByType } from "@/utils/utils";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatCurrency } from "@/lib/utils";
import { ChartContainer } from "@/components/chart/chart-container";
import { ChartConfig } from "@/components/chart/config";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  PiggyBank,
  Wallet,
  CreditCard,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
} from "lucide-react";
import { Link } from "react-router-dom";

interface FetchError {
  message: string;
}

const spendingChartConfig = {
  amount: { label: "Spent", color: "#575279" },
} satisfies ChartConfig;

export default function Dashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [groupedAccounts, setGroupedAccounts] = useState<{ [key: string]: Account[] } | null>(null);
  const [totalBalanceByDateArray, setTotalBalanceByDateArray] = useState<NetWorthData[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [spending, setSpending] = useState<SpendingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"networth" | "spending">("networth");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [accountData, chartData, txData, budgetData, spendingData] = await Promise.all([
        fetchAccountData(),
        fetchChartData(),
        fetchTransactions(),
        fetchBudgets(),
        fetchSpendingSummary(),
      ]);
      setGroupedAccounts(groupAccountsByType(accountData));
      setTotalBalanceByDateArray(aggregateBalancesByDate(chartData));
      setTransactions(txData);
      setBudgets(budgetData);
      setSpending(spendingData);
    } catch (err) {
      const error = err as FetchError | Error;
      setError(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--tooltip-x", `${e.clientX + 16}px`);
      document.documentElement.style.setProperty("--tooltip-y", `${e.clientY - 16}px`);
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  const { totalAssets, totalLiabilities } = useMemo(() => {
    let assets = 0;
    let liabilities = 0;
    if (groupedAccounts) {
      Object.values(groupedAccounts).flat().forEach((a) => {
        if (a.current_balance < 0) liabilities += Math.abs(a.current_balance);
        else assets += a.current_balance;
      });
    }
    return { totalAssets: assets, totalLiabilities: liabilities };
  }, [groupedAccounts]);

  const netWorth =
    totalBalanceByDateArray && totalBalanceByDateArray.length > 0
      ? totalBalanceByDateArray[totalBalanceByDateArray.length - 1].balance
      : totalAssets - totalLiabilities;

  const netWorthChange = useMemo(() => {
    if (!totalBalanceByDateArray || totalBalanceByDateArray.length < 30) return 0;
    const recent = totalBalanceByDateArray[totalBalanceByDateArray.length - 1].balance;
    const prev = totalBalanceByDateArray[totalBalanceByDateArray.length - 30].balance;
    return prev !== 0 ? ((recent - prev) / Math.abs(prev)) * 100 : 0;
  }, [totalBalanceByDateArray]);

  const monthlySpending = useMemo(
    () => spending.reduce((s, c) => s + c.amount, 0),
    [spending],
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={fetchData} />;

  const recentTx = transactions.slice(0, 5);

  const statusBadge = (status: Transaction["status"]) => {
    const map: Record<string, string> = {
      completed: "bg-lavenderDawn-foam/15 text-lavenderDawn-foam dark:bg-lavenderMoon-foam/15 dark:text-lavenderMoon-foam",
      pending: "bg-lavenderDawn-gold/15 text-lavenderDawn-gold dark:bg-lavenderMoon-gold/15 dark:text-lavenderMoon-gold",
      failed: "bg-lavenderDawn-love/15 text-lavenderDawn-love dark:bg-lavenderMoon-love/15 dark:text-lavenderMoon-love",
    };
    return (
      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${map[status]}`}>
        {status}
      </span>
    );
  };

  const gridColor = isDark ? "#4D4D4D" : "#f4ede8";
  const barFill = isDark ? "#A78BFA" : "#575279";

  return (
    <Layout>
      <div className="md:p-0 p-6 overflow-x-auto">
        <div className="min-w-[768px] space-y-6">
          {/* Header */}
          <div className="px-6 py-4 flex items-center gap-3">
            <PiggyBank className="w-10 h-10 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
            <h1 className="text-2xl font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
              Welcome back, Shruti!
            </h1>
          </div>

          {/* StatCards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Net Worth"
              value={formatCurrency(netWorth)}
              trend={{
                direction: netWorthChange >= 0 ? "up" : "down",
                value: `${Math.abs(netWorthChange).toFixed(1)}% this month`,
              }}
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <StatCard
              label="Total Assets"
              value={formatCurrency(totalAssets)}
              trend={{ direction: "up", value: formatCurrency(totalAssets) }}
              icon={<Wallet className="w-4 h-4" />}
            />
            <StatCard
              label="Liabilities"
              value={formatCurrency(totalLiabilities)}
              icon={<CreditCard className="w-4 h-4" />}
            />
            <StatCard
              label="Monthly Spending"
              value={formatCurrency(monthlySpending)}
              trend={{ direction: "down", value: `${budgets.length} categories` }}
              icon={<ShoppingCart className="w-4 h-4" />}
            />
          </div>

          {/* Tabs: Net Worth / Spending */}
          <div className="rounded-2xl border border-lavenderDawn-overlay dark:border-lavenderMoon-overlay bg-lavenderDawn-overlay/50 dark:bg-[#636363]/50 backdrop-blur-sm">
            <div className="flex border-b border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow">
              {(["networth", "spending"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "text-lavenderDawn-iris dark:text-lavenderMoon-iris border-b-2 border-lavenderDawn-iris dark:border-lavenderMoon-iris"
                      : "text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:text-lavenderDawn-text dark:hover:text-lavenderMoon-text"
                  }`}
                >
                  {tab === "networth" ? "Net Worth" : "Spending by Category"}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "networth" && totalBalanceByDateArray && (
                <NetWorthChart totalBalanceByDateArray={totalBalanceByDateArray} />
              )}

              {activeTab === "spending" && (
                <ChartContainer config={spendingChartConfig} className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spending} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
                      <XAxis
                        dataKey="category"
                        tick={{ fill: isDark ? "#F8FAFC" : "#4a4458", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fill: isDark ? "#F8FAFC" : "#4a4458", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `$${v}`}
                      />
                      <Tooltip
                        contentStyle={{
                          background: isDark ? "#2A2A2A" : "#fffaf3",
                          border: `1px solid ${isDark ? "#4D4D4D" : "#f4ede8"}`,
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        formatter={(v: number) => [formatCurrency(v), "Spent"]}
                      />
                      <Bar dataKey="amount" fill={barFill} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </div>
          </div>

          {/* Bottom Row: Recent Transactions + Budget Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <div className="rounded-2xl border border-lavenderDawn-overlay dark:border-lavenderMoon-overlay bg-lavenderDawn-overlay/50 dark:bg-[#636363]/50 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
                  <h2 className="text-lg font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
                    Recent Transactions
                  </h2>
                </div>
                <Link
                  to="/transactions"
                  className="text-xs font-medium text-lavenderDawn-iris dark:text-lavenderMoon-iris hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {recentTx.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-2 border-b border-lavenderDawn-highlightLow/50 dark:border-lavenderMoon-highlightLow/50 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-lavenderDawn-text dark:text-lavenderMoon-text truncate">
                        {tx.description}
                      </p>
                      <p className="text-xs text-lavenderDawn-muted dark:text-lavenderMoon-muted">
                        {tx.date} &middot; {tx.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      {statusBadge(tx.status)}
                      <span
                        className={`text-sm font-medium tabular-nums ${
                          tx.amount >= 0
                            ? "text-lavenderDawn-foam dark:text-lavenderMoon-foam"
                            : "text-lavenderDawn-text dark:text-lavenderMoon-text"
                        }`}
                      >
                        {tx.amount >= 0 ? "+" : ""}
                        {formatCurrency(tx.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Overview */}
            <div className="rounded-2xl border border-lavenderDawn-overlay dark:border-lavenderMoon-overlay bg-lavenderDawn-overlay/50 dark:bg-[#636363]/50 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="w-5 h-5 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
                  <h2 className="text-lg font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
                    Budget Overview
                  </h2>
                </div>
                <Link
                  to="/budget"
                  className="text-xs font-medium text-lavenderDawn-iris dark:text-lavenderMoon-iris hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-5">
                {budgets.slice(0, 4).map((b) => (
                  <ProgressBar
                    key={b.category}
                    value={b.spent}
                    max={b.limit}
                    label={b.category}
                    autoVariant
                    valueFormatter={(v, m) => `${formatCurrency(v)} / ${formatCurrency(m)}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
