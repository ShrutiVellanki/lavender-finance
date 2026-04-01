import { Layout } from "@/components/layout/layout";
import { useState, useEffect, useMemo, useCallback } from "react";
import { BudgetCategory } from "@/types";
import { fetchBudgets, fetchSpendingSummary } from "@/api/api";
import { Loading } from "@/components/ui/loading";
import { ErrorDisplay } from "@/components/ui/error-display";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/utils";
import { ChartContainer } from "@/components/chart/chart-container";
import { ChartConfig } from "@/components/chart/config";
import { ChartLegend, ChartLegendContent } from "@/components/chart/chart-legend";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/theme-provider";
import { Calculator, ChevronLeft, ChevronRight, Target, TrendingDown, PiggyBank } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CATEGORY_ICON } from "@/constants/category-icons";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const budgetChartConfig = {
  budget: { label: "Budget", color: "#575279" },
  spent: { label: "Spent", color: "#56949f" },
} satisfies ChartConfig;

export default function Budget() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear] = useState(new Date().getFullYear());
  const fetchData = useCallback(async (month: number) => {
    try {
      setLoading(true);
      setError(null);
      setBudgets(await fetchBudgets(month));
    } catch (err) {
      setError((err as globalThis.Error).message || "Failed to fetch budget data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(currentMonth); }, [fetchData, currentMonth]);

  const totals = useMemo(() => {
    const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
    const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
    return { totalBudget, totalSpent, remaining: totalBudget - totalSpent };
  }, [budgets]);

  const chartData = useMemo(() => budgets.map((b) => ({ category: b.category, budget: b.limit, spent: b.spent })), [budgets]);
  const gridColor = isDark ? "#44415a" : "#efeef5";

  if (loading) return <Loading message={t("common.loading")} />;
  if (error) return <ErrorDisplay message={error} onRetry={() => fetchData(currentMonth)} title={t("common.error")} />;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Calculator className="w-8 h-8 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
          <h1 className="text-xl font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text">{t("budget.title")}</h1>
        </div>

        {/* Month Selector */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth((m) => (m === 0 ? 11 : m - 1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-lg font-medium text-lavenderDawn-text dark:text-lavenderMoon-text min-w-[180px] text-center">
            {MONTHS[currentMonth]} {currentYear}
          </span>
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth((m) => (m === 11 ? 0 : m + 1))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Summary StatCards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Tooltip content={t("budget.tooltipTotalBudget")}>
            <div><StatCard label={t("budget.totalBudget")} value={formatCurrency(totals.totalBudget)} icon={<Target className="w-4 h-4" />} /></div>
          </Tooltip>
          <Tooltip content={t("budget.tooltipTotalSpent")}>
            <div>
              <StatCard
                label={t("budget.totalSpent")}
                value={formatCurrency(totals.totalSpent)}
                trend={{ direction: totals.totalSpent > totals.totalBudget * 0.9 ? "down" : "up", value: t("budget.ofBudget", { pct: Math.round((totals.totalSpent / totals.totalBudget) * 100) }) }}
                icon={<TrendingDown className="w-4 h-4" />}
              />
            </div>
          </Tooltip>
          <Tooltip content={t("budget.tooltipRemaining")}>
            <div>
              <StatCard
                label={t("budget.remaining")}
                value={formatCurrency(totals.remaining)}
                trend={{ direction: totals.remaining > 0 ? "up" : "down", value: totals.remaining > 0 ? t("budget.underBudget") : t("budget.overBudget") }}
                icon={<PiggyBank className="w-4 h-4" />}
              />
            </div>
          </Tooltip>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const pct = Math.round((b.spent / b.limit) * 100);
            const variant: "success" | "warning" | "danger" = pct >= 90 ? "danger" : pct >= 75 ? "warning" : "success";
            return (
              <Card key={b.category} className="p-5 space-y-3 hover:shadow-sm hover:border-lavenderDawn-highlightMed dark:hover:border-lavenderMoon-highlightHigh">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
                    {CATEGORY_ICON[b.category] && <span className="shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5 opacity-60">{CATEGORY_ICON[b.category]}</span>}
                    {b.category}
                  </span>
                  <Badge variant={variant}>{pct}%</Badge>
                </div>
                <ProgressBar value={b.spent} max={b.limit} showValue autoVariant valueFormatter={(v, m) => `${formatCurrency(v)} / ${formatCurrency(m)}`} />
              </Card>
            );
          })}
        </div>

        {/* Budget vs Actual Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-medium text-lavenderDawn-text dark:text-lavenderMoon-text mb-4">{t("budget.budgetVsActual")}</h2>
          <ChartContainer config={budgetChartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
                <XAxis dataKey="category" tick={{ fill: isDark ? "#e0def4" : "#575279", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: isDark ? "#e0def4" : "#575279", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <RechartsTooltip
                  cursor={{ fill: isDark ? "rgba(196,167,231,0.06)" : "rgba(144,122,169,0.06)" }}
                  contentStyle={{ background: isDark ? "#2a273f" : "#ffffff", border: `1px solid ${isDark ? "#44415a" : "#dfdee8"}`, borderRadius: 10, fontSize: 12 }}
                  formatter={(v: number, name: string) => [formatCurrency(v), name === "budget" ? "Budget" : "Spent"]}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="budget" fill={isDark ? "#44415a" : "#dfdee8"} radius={[6, 6, 0, 0]} />
                <Bar dataKey="spent" fill={isDark ? "#c4a7e7" : "#907aa9"} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

      </div>
    </Layout>
  );
}
