import { Layout } from "@/components/layout/layout";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Account, Transaction, ChartDataPoint } from "@/types";
import { fetchAccountData, fetchChartData, fetchTransactions } from "@/api/api";
import { Loading } from "@/components/ui/loading";
import { ErrorDisplay } from "@/components/ui/error-display";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useTheme } from "@/theme-provider";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import { ArrowLeft, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { STATUS_ICON } from "@/constants/category-icons";

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  completed: "success", pending: "warning", failed: "danger",
};

export default function AccountDetail() {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();

  const [account, setAccount] = useState<Account | null>(null);
  const [chartPoints, setChartPoints] = useState<ChartDataPoint[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const [accountData, chart, txData] = await Promise.all([
        fetchAccountData(), fetchChartData(), fetchTransactions(),
      ]);
      const acct = accountData[id];
      if (!acct) { setError("Account not found"); setLoading(false); return; }
      setAccount(acct);
      setChartPoints(chart[id] ?? []);
      setTransactions(txData.filter((t) => t.accountId === id));
    } catch (err) {
      setError((err as globalThis.Error).message || "Failed to load account");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const gridColor = isDark ? "#44415a" : "#efeef5";
  const lineColor = isDark ? "#c4a7e7" : "#907aa9";

  const sampledChart = useMemo(() => {
    if (chartPoints.length <= 60) return chartPoints;
    const step = Math.ceil(chartPoints.length / 60);
    return chartPoints.filter((_, i) => i % step === 0 || i === chartPoints.length - 1);
  }, [chartPoints]);

  if (loading) return <Loading message={t("common.loading")} />;
  if (error || !account) return <ErrorDisplay message={error || t("accounts.accountNotFound")} onRetry={fetchData} title={t("common.error")} />;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/accounts">
            <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text">{account.name}</h1>
            <p className="text-[13px] text-lavenderDawn-muted dark:text-lavenderMoon-muted capitalize">{account.subtype.replace("_", " ")} · {account.type}</p>
          </div>
          <div className="ml-auto">
            <span className={`text-2xl font-semibold tabular-nums ${account.current_balance >= 0 ? "text-lavenderDawn-foam dark:text-lavenderMoon-foam" : "text-lavenderDawn-love dark:text-lavenderMoon-love"}`}>
              {formatCurrency(account.current_balance)}
            </span>
          </div>
        </div>

        {/* Balance History */}
        {sampledChart.length > 0 && (
          <Card className="p-6">
            <h2 className="text-sm font-medium text-lavenderDawn-text dark:text-lavenderMoon-text mb-4">{t("accounts.balanceHistory")}</h2>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampledChart} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: isDark ? "#e0def4" : "#575279", fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    interval="preserveStartEnd"
                    minTickGap={40}
                  />
                  <YAxis
                    tick={{ fill: isDark ? "#e0def4" : "#575279", fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <RechartsTooltip
                    contentStyle={{ background: isDark ? "#2a273f" : "#ffffff", border: `1px solid ${isDark ? "#44415a" : "#dfdee8"}`, borderRadius: 10, fontSize: 12 }}
                    formatter={(v: number) => [formatCurrency(v), "Balance"]}
                    labelFormatter={(l) => new Date(l).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  />
                  <Line type="monotone" dataKey="balance" stroke={lineColor} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Transactions */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>{t("transactions.title")}</CardTitle>
            <Link to={`/transactions?account=${id}`}>
              <Button variant="link" size="sm">{t("accounts.viewAllTransactions")}</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-sm text-lavenderDawn-muted dark:text-lavenderMoon-muted py-6 text-center">{t("accounts.noTransactions")}</p>
            ) : (
              <div className="divide-y divide-lavenderDawn-highlightLow/50 dark:divide-lavenderMoon-highlightLow/50">
                {transactions.slice(0, 15).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-lavenderDawn-text dark:text-lavenderMoon-text truncate">{tx.description}</p>
                      <p className="text-xs text-lavenderDawn-muted dark:text-lavenderMoon-muted">{tx.date} · {tx.category}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <Badge variant={STATUS_VARIANT[tx.status]} icon={STATUS_ICON[tx.status]}>{tx.status}</Badge>
                      <div className="flex items-center gap-1">
                        {tx.amount >= 0 ? <ArrowUpRight className="w-3 h-3 text-lavenderDawn-foam dark:text-lavenderMoon-foam" /> : <ArrowDownRight className="w-3 h-3 text-lavenderDawn-love dark:text-lavenderMoon-love" />}
                        <span className={`text-sm font-medium tabular-nums ${tx.amount >= 0 ? "text-lavenderDawn-foam dark:text-lavenderMoon-foam" : "text-lavenderDawn-text dark:text-lavenderMoon-text"}`}>
                          {tx.amount >= 0 ? "+" : ""}{formatCurrency(tx.amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
