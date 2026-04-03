import { Layout } from "@/app/layout/layout";
import { useState, useEffect, useMemo, useCallback } from "react";
import { BudgetCategory } from "@/types";
import { fetchBudgets } from "@/services/api";
import { BudgetSkeleton } from "@/shared/components/Skeleton/PageSkeletons";
import { ErrorDisplay } from "@/shared/components/ErrorDisplay";
import { StatCard } from "@/shared/components/StatCard";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { Card, CardContent } from "@/shared/components/Card";
import { useCurrency } from "@/shared/context/currency";
import { ChartContainer } from "@/shared/components/Chart/chart-container";
import { ChartConfig } from "@/shared/components/Chart/config";
import { ChartLegend, ChartLegendContent } from "@/shared/components/Chart/chart-legend";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/shared/components/ThemeProvider";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Target, TrendingDown, PiggyBank, CalendarDays } from "lucide-react";
import { Tooltip } from "@/shared/components/Tooltip";
import { useTranslation } from "react-i18next";
import { CATEGORY_ICON } from "@/shared/constants/category-icons";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const budgetChartConfig = {
  budget: { label: "Budget", color: "#908caa" },
  spent: { label: "Spent", color: "#56949f" },
} satisfies ChartConfig;

export default function Budget() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
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

  function goToStart() {
    setCurrentMonth(minMonth);
    setCurrentYear(minYear);
  }

  function goToEnd() {
    setCurrentMonth(maxMonth);
    setCurrentYear(maxYear);
  }

  function goToToday() {
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  }

  const isToday = currentMonth === now.getMonth() && currentYear === now.getFullYear();
  useDocumentTitle(`${t("budget.title")} — ${MONTHS[currentMonth]} ${currentYear}`);

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

  if (loading) return <BudgetSkeleton />;
  if (error) return <ErrorDisplay message={error} onRetry={() => fetchData(currentMonth, currentYear)} title={t("common.error")} />;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text">{t("budget.title")}</h1>
          <p className="text-xs sm:text-[13px] text-lavenderDawn-muted dark:text-lavenderMoon-muted mt-1">{t("budget.subtitle")}</p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <Tooltip content={`${t("budget.goToEarliest")} — ${MONTHS[minMonth]} ${minYear}`}>
            <Button variant="outline" size="icon" onClick={goToStart} disabled={!canGoBack} aria-label={`Go to earliest month: ${MONTHS[minMonth]} ${minYear}`}>
              <ChevronsLeft className="w-4 h-4" />
            </Button>
          </Tooltip>
          <Tooltip content={`${t("budget.goToPrevious")} — ${MONTHS[currentMonth === 0 ? 11 : currentMonth - 1]} ${currentMonth === 0 ? currentYear - 1 : currentYear}`}>
            <Button variant="outline" size="icon" onClick={goBack} disabled={!canGoBack} aria-label={`Go to previous month: ${MONTHS[currentMonth === 0 ? 11 : currentMonth - 1]} ${currentMonth === 0 ? currentYear - 1 : currentYear}`}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Tooltip>
          <div className="flex flex-col items-center min-w-[160px] sm:min-w-[200px]">
            <span className="text-base sm:text-lg font-medium text-lavenderDawn-text dark:text-lavenderMoon-text text-center">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            {isFutureMonth && <span className="text-xs font-normal text-lavenderDawn-muted dark:text-lavenderMoon-muted">{t("budget.futureMonth")}</span>}
            {!isToday && (
              <button
                onClick={goToToday}
                className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-lavenderDawn-iris dark:text-lavenderMoon-iris hover:underline transition-colors"
              >
                <CalendarDays className="w-3 h-3" />
                {t("budget.today")}
              </button>
            )}
          </div>
          <Tooltip content={`${t("budget.goToNext")} — ${MONTHS[currentMonth === 11 ? 0 : currentMonth + 1]} ${currentMonth === 11 ? currentYear + 1 : currentYear}`}>
            <Button variant="outline" size="icon" onClick={goForward} disabled={!canGoForward} aria-label={`Go to next month: ${MONTHS[currentMonth === 11 ? 0 : currentMonth + 1]} ${currentMonth === 11 ? currentYear + 1 : currentYear}`}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Tooltip>
          <Tooltip content={`${t("budget.goToLatest")} — ${MONTHS[maxMonth]} ${maxYear}`}>
            <Button variant="outline" size="icon" onClick={goToEnd} disabled={!canGoForward} aria-label={`Go to latest month: ${MONTHS[maxMonth]} ${maxYear}`}>
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </Tooltip>
        </div>

        {/* Summary StatCards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label={t("budget.totalBudget")}
            value={formatCurrency(totals.totalBudget)}
            description={t("budget.tooltipTotalBudget")}
            icon={<Target className="w-4 h-4" />}
          />
          <StatCard
            label={t("budget.totalSpent")}
            value={formatCurrency(totals.totalSpent)}
            description={t("budget.tooltipTotalSpent")}
            trend={{ direction: totals.totalSpent > totals.totalBudget * 0.9 ? "down" : "up", value: t("budget.ofBudget", { pct: Math.round((totals.totalSpent / totals.totalBudget) * 100) }) }}
            icon={<TrendingDown className="w-4 h-4" />}
          />
          <StatCard
            label={t("budget.remaining")}
            value={formatCurrency(totals.remaining)}
            description={t("budget.tooltipRemaining")}
            trend={{ direction: totals.remaining > 0 ? "up" : "down", value: totals.remaining > 0 ? t("budget.underBudget") : t("budget.overBudget") }}
            icon={<PiggyBank className="w-4 h-4" />}
          />
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
          <ChartContainer config={budgetChartConfig} className="h-[220px] sm:h-[300px] w-full" aria-label={`Spending overview chart for ${MONTHS[currentMonth]} ${currentYear}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
                <XAxis dataKey="category" tick={{ fill: isDark ? "#e0def4" : "#575279", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: isDark ? "#e0def4" : "#575279", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <RechartsTooltip
                  cursor={{ fill: isDark ? "rgba(196,167,231,0.06)" : "rgba(144,122,169,0.06)" }}
                  contentStyle={{ background: isDark ? "#2a273f" : "#ffffff", border: `1px solid ${isDark ? "#44415a" : "#dfdee8"}`, borderRadius: 10, fontSize: 12, color: isDark ? "#e0def4" : "#575279" }}
                  formatter={(v: number, name: string) => [formatCurrency(v), name === "budget" ? "Budget" : "Spent"]}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="budget" fill={isDark ? "#6e6a86" : "#b4b0c8"} radius={[6, 6, 0, 0]} />
                <Bar dataKey="spent" fill={isDark ? "#c4a7e7" : "#907aa9"} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

      </div>
    </Layout>
  );
}
