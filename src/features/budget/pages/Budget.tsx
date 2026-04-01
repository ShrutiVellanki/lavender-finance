import { Layout } from "@/app/layout/layout";
import { useState, useEffect, useMemo, useCallback } from "react";
import { BudgetCategory } from "@/types";
import { fetchBudgets } from "@/services/api";
import { Loading } from "@/shared/components/Loading";
import { ErrorDisplay } from "@/shared/components/ErrorDisplay";
import { StatCard } from "@/shared/components/StatCard";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { Card, CardContent } from "@/shared/components/Card";
import { Tooltip } from "@/shared/components/Tooltip";
import { formatCurrency } from "@/shared/utils";
import { ChartContainer } from "@/shared/components/Chart/chart-container";
import { ChartConfig } from "@/shared/components/Chart/config";
import { ChartLegend, ChartLegendContent } from "@/shared/components/Chart/chart-legend";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/shared/components/ThemeProvider";
import { Calculator, ChevronLeft, ChevronRight, Target, TrendingDown, PiggyBank } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CATEGORY_ICON } from "@/shared/constants/category-icons";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const budgetChartConfig = {
  budget: { label: "Budget", color: "#575279" },
  spent: { label: "Spent", color: "#56949f" },
} satisfies ChartConfig;

export default function Budget() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();
  const now = useMemo(() => new Date(), []);
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const minYear = now.getFullYear() - 1;
  const minMonth = now.getMonth();
  const maxYear = now.getFullYear();
  const maxMonth = 11;

  const canGoBack = currentYear > minYear || (currentYear === minYear && currentMonth > minMonth);
  const canGoForward = currentYear < maxYear || (currentYear === maxYear && currentMonth < maxMonth);
  const isFutureMonth = currentYear > now.getFullYear() || (currentYear === now.getFullYear() && currentMonth > now.getMonth());

  function goBack() {
    if (!canGoBack) return;
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  }

  function goForward() {
    if (!canGoForward) return;
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  }

  const fetchData = useCallback(async (month: number, year: number) => {
    try {
      setLoading(true);
      setError(null);
      setBudgets(await fetchBudgets(month, year));
    } catch (err) {
      setError((err as globalThis.Error).message || "Failed to fetch budget data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(currentMonth, currentYear); }, [fetchData, currentMonth, currentYear]);

  const totals = useMemo(() => {
    const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
    const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
    return { totalBudget, totalSpent, remaining: totalBudget - totalSpent };
  }, [budgets]);

  const chartData = useMemo(() => budgets.map((b) => ({ category: b.category, budget: b.limit, spent: b.spent })), [budgets]);
  const gridColor = isDark ? "#44415a" : "#efeef5";

  if (loading) return <Loading message={t("common.loading")} />;
  if (error) return <ErrorDisplay message={error} onRetry={() => fetchData(currentMonth, currentYear)} title={t("common.error")} />;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
          <h1 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text">{t("budget.title")}</h1>
        </div>

        {/* Month Selector */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <Button variant="outline" size="icon" onClick={goBack} disabled={!canGoBack}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-base sm:text-lg font-medium text-lavenderDawn-text dark:text-lavenderMoon-text min-w-[160px] sm:min-w-[200px] text-center">
            {MONTHS[currentMonth]} {currentYear}
            {isFutureMonth && <span className="block text-xs font-normal text-lavenderDawn-muted dark:text-lavenderMoon-muted">{t("budget.futureMonth")}</span>}
          </span>
          <Button variant="outline" size="icon" onClick={goForward} disabled={!canGoForward}>
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
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-medium text-lavenderDawn-text dark:text-lavenderMoon-text mb-4">{t("budget.budgetVsActual")}</h2>
          <ChartContainer config={budgetChartConfig} className="h-[220px] sm:h-[300px] w-full">
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
