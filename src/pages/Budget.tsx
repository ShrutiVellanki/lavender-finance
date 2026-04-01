import { Layout } from "@/components/layout/layout";
import { useState, useEffect, useMemo } from "react";
import { BudgetCategory, SpendingSummary } from "@/types";
import { fetchBudgets, fetchSpendingSummary } from "@/api/api";
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
  Legend,
} from "recharts";
import { useTheme } from "@/theme-provider";
import {
  Calculator,
  ChevronLeft,
  ChevronRight,
  Target,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const budgetChartConfig = {
  budget: { label: "Budget", color: "#575279" },
  spent: { label: "Spent", color: "#56949f" },
} satisfies ChartConfig;

export default function Budget() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear] = useState(new Date().getFullYear());

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBudgets();
      setBudgets(data);
    } catch (err) {
      setError((err as Error).message || "Failed to fetch budget data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totals = useMemo(() => {
    const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
    const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
    return { totalBudget, totalSpent, remaining: totalBudget - totalSpent };
  }, [budgets]);

  const chartData = useMemo(
    () => budgets.map((b) => ({ category: b.category, budget: b.limit, spent: b.spent })),
    [budgets],
  );

  const prevMonth = () => setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
  const nextMonth = () => setCurrentMonth((m) => (m === 11 ? 0 : m + 1));

  const gridColor = isDark ? "#4D4D4D" : "#f4ede8";

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={fetchData} />;

  return (
    <Layout>
      <div className="md:p-0 p-6 overflow-x-auto">
        <div className="min-w-[768px] space-y-6">
          {/* Header */}
          <div className="px-6 py-4 flex items-center gap-3">
            <Calculator className="w-8 h-8 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
            <h1 className="text-2xl font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
              Budget
            </h1>
          </div>

          {/* Month Selector */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow hover:bg-lavenderDawn-highlightLow/30 dark:hover:bg-lavenderMoon-highlightLow/30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-lavenderDawn-text dark:text-lavenderMoon-text" />
            </button>
            <span className="text-lg font-medium text-lavenderDawn-text dark:text-lavenderMoon-text min-w-[180px] text-center">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow hover:bg-lavenderDawn-highlightLow/30 dark:hover:bg-lavenderMoon-highlightLow/30 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-lavenderDawn-text dark:text-lavenderMoon-text" />
            </button>
          </div>

          {/* Summary StatCards */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="Total Budget"
              value={formatCurrency(totals.totalBudget)}
              icon={<Target className="w-4 h-4" />}
            />
            <StatCard
              label="Total Spent"
              value={formatCurrency(totals.totalSpent)}
              trend={{
                direction: totals.totalSpent > totals.totalBudget * 0.9 ? "down" : "up",
                value: `${Math.round((totals.totalSpent / totals.totalBudget) * 100)}% of budget`,
              }}
              icon={<TrendingDown className="w-4 h-4" />}
            />
            <StatCard
              label="Remaining"
              value={formatCurrency(totals.remaining)}
              trend={{
                direction: totals.remaining > 0 ? "up" : "down",
                value: totals.remaining > 0 ? "Under budget" : "Over budget",
              }}
              icon={<PiggyBank className="w-4 h-4" />}
            />
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((b) => {
              const pct = Math.round((b.spent / b.limit) * 100);
              return (
                <div
                  key={b.category}
                  className="rounded-2xl border border-lavenderDawn-overlay dark:border-lavenderMoon-overlay bg-lavenderDawn-overlay/50 dark:bg-[#636363]/50 backdrop-blur-sm p-5 space-y-3 hover:bg-lavenderDawn-highlightLow/30 dark:hover:bg-[#636363]/70 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
                      {b.category}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        pct >= 90
                          ? "bg-lavenderDawn-love/15 text-lavenderDawn-love dark:bg-lavenderMoon-love/15 dark:text-lavenderMoon-love"
                          : pct >= 75
                            ? "bg-lavenderDawn-gold/15 text-lavenderDawn-gold dark:bg-lavenderMoon-gold/15 dark:text-lavenderMoon-gold"
                            : "bg-lavenderDawn-foam/15 text-lavenderDawn-foam dark:bg-lavenderMoon-foam/15 dark:text-lavenderMoon-foam"
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                  <ProgressBar
                    value={b.spent}
                    max={b.limit}
                    showValue
                    autoVariant
                    valueFormatter={(v, m) => `${formatCurrency(v)} / ${formatCurrency(m)}`}
                  />
                </div>
              );
            })}
          </div>

          {/* Budget vs Actual Chart */}
          <div className="rounded-2xl border border-lavenderDawn-overlay dark:border-lavenderMoon-overlay bg-lavenderDawn-overlay/50 dark:bg-[#636363]/50 backdrop-blur-sm p-6">
            <h2 className="text-lg font-medium text-lavenderDawn-text dark:text-lavenderMoon-text mb-4">
              Budget vs Actual
            </h2>
            <ChartContainer config={budgetChartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                    formatter={(v: number, name: string) => [
                      formatCurrency(v),
                      name === "budget" ? "Budget" : "Spent",
                    ]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 12 }}
                    formatter={(value: string) => (value === "budget" ? "Budget" : "Spent")}
                  />
                  <Bar dataKey="budget" fill={isDark ? "#666666" : "#cbd5e1"} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="spent" fill={isDark ? "#A78BFA" : "#575279"} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}
