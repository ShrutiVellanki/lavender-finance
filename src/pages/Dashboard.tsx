import { Layout } from "@/components/layout/layout";
import { useTheme } from "@/theme-provider";
import NetWorthChart from "@/components/product/net-worth/net-worth";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Account, NetWorthData, Transaction, BudgetCategory, SpendingSummary } from "@/types";
import {
  fetchAccountData, fetchChartData, fetchTransactions, fetchBudgets, fetchSpendingSummary,
} from "@/api/api";
import { aggregateBalancesByDate, groupAccountsByType } from "@/lib/utils";
import { Loading } from "@/components/ui/loading";
import { ErrorDisplay } from "@/components/ui/error-display";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsPanel } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/utils";
import { ChartContainer } from "@/components/chart/chart-container";
import { ChartConfig } from "@/components/chart/config";
import { ChartTooltipContent } from "@/components/chart/chart-tooltip";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import {
  PiggyBank, Wallet, CreditCard, ShoppingCart, TrendingUp, Receipt, Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { STATUS_ICON } from "@/constants/category-icons";

interface FetchError { message: string }

const spendingChartConfig = {
  amount: { label: "Spent", color: "#907aa9" },
} satisfies ChartConfig;

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  completed: "success", pending: "warning", failed: "danger",
};

export default function Dashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();
  const [groupedAccounts, setGroupedAccounts] = useState<{ [key: string]: Account[] } | null>(null);
  const [totalBalanceByDateArray, setTotalBalanceByDateArray] = useState<NetWorthData[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [spending, setSpending] = useState<SpendingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [accountData, chartData, txData, budgetData, spendingData] = await Promise.all([
        fetchAccountData(), fetchChartData(), fetchTransactions(), fetchBudgets(), fetchSpendingSummary(),
      ]);
      setGroupedAccounts(groupAccountsByType(accountData));
      setTotalBalanceByDateArray(aggregateBalancesByDate(chartData));
      setTransactions(txData);
      setBudgets(budgetData);
      setSpending(spendingData);
    } catch (err) {
      setError((err as FetchError).message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--tooltip-x", `${e.clientX + 16}px`);
      document.documentElement.style.setProperty("--tooltip-y", `${e.clientY - 16}px`);
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  const { totalAssets, totalLiabilities } = useMemo(() => {
    let assets = 0, liabilities = 0;
    if (groupedAccounts) {
      Object.values(groupedAccounts).flat().forEach((a) => {
        if (a.current_balance < 0) liabilities += Math.abs(a.current_balance);
        else assets += a.current_balance;
      });
    }
    return { totalAssets: assets, totalLiabilities: liabilities };
  }, [groupedAccounts]);

  const netWorth = totalBalanceByDateArray?.length
    ? totalBalanceByDateArray[totalBalanceByDateArray.length - 1].balance
    : totalAssets - totalLiabilities;

  const netWorthChange = useMemo(() => {
    if (!totalBalanceByDateArray || totalBalanceByDateArray.length < 30) return 0;
    const recent = totalBalanceByDateArray[totalBalanceByDateArray.length - 1].balance;
    const prev = totalBalanceByDateArray[totalBalanceByDateArray.length - 30].balance;
    return prev !== 0 ? ((recent - prev) / Math.abs(prev)) * 100 : 0;
  }, [totalBalanceByDateArray]);

  const monthlySpending = useMemo(() => spending.reduce((s, c) => s + c.amount, 0), [spending]);

  if (loading) return <Loading message={t("common.loading")} />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchData} title={t("common.error")} />;

  const recentTx = transactions.slice(0, 5);
  const gridColor = isDark ? "#44415a" : "#efeef5";
  const barFill = isDark ? "#c4a7e7" : "#907aa9";

  return (
    <Layout>
      <div>
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text">
              {t("dashboard.title")}
            </h1>
            <p className="text-[13px] text-lavenderDawn-muted dark:text-lavenderMoon-muted mt-1">
              {t("dashboard.subtitle", { name: "Shruti" })}
            </p>
          </div>

          {/* StatCards with Tooltips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Tooltip content={t("dashboard.tooltipNetWorth")}>
              <div>
                <StatCard
                  label={t("dashboard.netWorth")}
                  value={formatCurrency(netWorth)}
                  trend={{ direction: netWorthChange >= 0 ? "up" : "down", value: t("dashboard.thisMonth", { value: Math.abs(netWorthChange).toFixed(1) }) }}
                  icon={<TrendingUp className="w-4 h-4" />}
                />
              </div>
            </Tooltip>
            <Tooltip content={t("dashboard.tooltipAssets")}>
              <div>
                <StatCard label={t("dashboard.totalAssets")} value={formatCurrency(totalAssets)} icon={<Wallet className="w-4 h-4" />} />
              </div>
            </Tooltip>
            <Tooltip content={t("dashboard.tooltipLiabilities")}>
              <div>
                <StatCard label={t("dashboard.liabilities")} value={formatCurrency(totalLiabilities)} icon={<CreditCard className="w-4 h-4" />} />
              </div>
            </Tooltip>
            <Tooltip content={t("dashboard.tooltipSpending")}>
              <div>
                <StatCard
                  label={t("dashboard.monthlySpending")}
                  value={formatCurrency(monthlySpending)}
                  trend={{ direction: "down", value: t("dashboard.categories", { count: budgets.length }) }}
                  icon={<ShoppingCart className="w-4 h-4" />}
                />
              </div>
            </Tooltip>
          </div>

          {/* Tabs: Net Worth / Spending */}
          <Card>
            <Tabs defaultValue="networth">
              <TabsList>
                <TabsTrigger value="networth">{t("dashboard.netWorthTab")}</TabsTrigger>
                <TabsTrigger value="spending">{t("dashboard.spendingTab")}</TabsTrigger>
              </TabsList>
              <TabsPanel value="networth" className="p-6">
                {totalBalanceByDateArray && (
                  <NetWorthChart totalBalanceByDateArray={totalBalanceByDateArray} />
                )}
              </TabsPanel>
              <TabsPanel value="spending" className="p-6">
                <ChartContainer config={spendingChartConfig} className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spending} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
                      <XAxis dataKey="category" tick={{ fill: isDark ? "#e0def4" : "#575279", fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: isDark ? "#e0def4" : "#575279", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                      <RechartsTooltip content={<ChartTooltipContent />} cursor={{ fill: isDark ? "rgba(196,167,231,0.06)" : "rgba(144,122,169,0.06)" }} />
                      <Bar dataKey="amount" fill={barFill} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsPanel>
            </Tabs>
          </Card>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
                  <CardTitle>{t("dashboard.recentTransactions")}</CardTitle>
                </div>
                <Link to="/transactions">
                  <Button variant="link" size="sm">{t("common.viewAll")}</Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTx.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-2 border-b border-lavenderDawn-highlightLow/50 dark:border-lavenderMoon-highlightLow/50 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-lavenderDawn-text dark:text-lavenderMoon-text truncate">{tx.description}</p>
                        <p className="text-xs text-lavenderDawn-muted dark:text-lavenderMoon-muted">{tx.date} · {tx.category}</p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <Badge variant={STATUS_VARIANT[tx.status]} icon={STATUS_ICON[tx.status]}>{tx.status}</Badge>
                        <span className={`text-sm font-medium tabular-nums ${tx.amount >= 0 ? "text-lavenderDawn-foam dark:text-lavenderMoon-foam" : "text-lavenderDawn-text dark:text-lavenderMoon-text"}`}>
                          {tx.amount >= 0 ? "+" : ""}{formatCurrency(tx.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Budget Overview */}
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
                  <CardTitle>{t("dashboard.budgetOverview")}</CardTitle>
                </div>
                <Link to="/budget">
                  <Button variant="link" size="sm">{t("common.viewAll")}</Button>
                </Link>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
