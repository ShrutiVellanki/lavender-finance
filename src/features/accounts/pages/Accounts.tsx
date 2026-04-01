import { Layout } from "@/app/layout/layout";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/shared/components/Accordion";
import { aggregateBalancesByDate, groupAccountsByType, accountTypes } from "@/shared/utils";
import { useCurrency } from "@/shared/context/currency";
import NetWorthChart from "@/features/dashboard/components/net-worth/net-worth";
import { fetchAccountData, fetchChartData, getSavedCards } from "@/services/api";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Account, NetWorthData, ChartData } from "@/types";
import { Loading } from "@/shared/components/Loading";
import { ErrorDisplay } from "@/shared/components/ErrorDisplay";
import { Card } from "@/shared/components/Card";
import { Combobox } from "@/shared/components/Combobox";
import { VirtualizedList } from "@/shared/components/VirtualizedList";
import { Badge } from "@/shared/components/Badge";
import { CreditCard, Banknote as Bank, Car, Coins, House, DollarSign, Landmark, TrendingUp, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { accountTypeLabels, accountSubtypeLabels } from "@/shared/constants/account-constants";

interface FetchError { message: string }

const iconCls = (size: string) => `${size} text-lavenderDawn-iris/90 dark:text-lavenderMoon-iris/90 stroke-[1.5]`

const ACCOUNT_TYPE_ICONS: Record<string, (cls: string) => React.ReactNode> = {
  credit: (c) => <CreditCard className={c} />,
  depository: (c) => <Bank className={c} />,
  real_estate: (c) => <House className={c} />,
  vehicle: (c) => <Car className={c} />,
  brokerage: (c) => <Coins className={c} />,
  investment: (c) => <TrendingUp className={c} />,
  loan: (c) => <DollarSign className={c} />,
  mortgage: (c) => <Landmark className={c} />,
  other: (c) => <MoreHorizontal className={c} />,
}

const ACCOUNT_GROUP_ICONS: Record<string, React.ReactNode> = Object.fromEntries(
  Object.entries(ACCOUNT_TYPE_ICONS).map(([k, fn]) => [k, fn(iconCls("w-5 h-5"))])
)

function CurrencyValue({ amount, bold = false }: { amount: number; bold?: boolean }) {
  const { formatCurrency } = useCurrency();
  return (
    <span
      className={`text-sm sm:text-base tracking-tight tabular-nums shrink-0 ${bold ? "font-semibold" : "font-medium"} ${
        amount < 0 ? "text-rose-600 dark:text-rose-400" : "text-lavenderDawn-iris dark:text-lavenderMoon-iris"
      }`}
    >
      {formatCurrency(amount)}
    </span>
  );
}

export default function AccountsPage() {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  const [groupedAccounts, setGroupedAccounts] = useState<{ [key: string]: Account[] } | null>(null);
  const [rawChartData, setRawChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [accountData, chartData] = await Promise.all([fetchAccountData(), fetchChartData()]);

      const userCards = getSavedCards();
      const merged = { ...accountData };
      for (const card of userCards) {
        if (!merged[card.id]) {
          merged[card.id] = {
            id: card.id,
            name: card.name,
            current_balance: 0,
            type: "credit",
            subtype: "credit_card",
          };
        }
      }

      setGroupedAccounts(groupAccountsByType(merged));
      setRawChartData(chartData);
    } catch (err) {
      setError((err as FetchError).message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const allTypes = useMemo(() => {
    if (!groupedAccounts) return [];
    return Object.keys(groupedAccounts).map((t) => ({
      value: t,
      label: accountTypes[t] || t,
    }));
  }, [groupedAccounts]);

  const allAccounts = useMemo(() => {
    if (!groupedAccounts) return [];
    return Object.values(groupedAccounts).flat();
  }, [groupedAccounts]);

  const filteredEntries = useMemo(() => {
    if (!groupedAccounts) return [];
    const entries = Object.entries(groupedAccounts);
    if (!typeFilter) return entries;
    return entries.filter(([type]) => type === typeFilter);
  }, [groupedAccounts, typeFilter]);

  const chartBalanceArray = useMemo<NetWorthData[]>(() => {
    if (!rawChartData) return [];
    if (!typeFilter || !groupedAccounts) return aggregateBalancesByDate(rawChartData);
    const accountIdsForType = new Set(
      (groupedAccounts[typeFilter] ?? []).map((a) => a.id),
    );
    const filtered: ChartData = {};
    for (const [id, points] of Object.entries(rawChartData)) {
      if (accountIdsForType.has(id)) filtered[id] = points;
    }
    return aggregateBalancesByDate(filtered);
  }, [rawChartData, typeFilter, groupedAccounts]);

  if (loading) return <Loading message={t("common.loading")} />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchData} title={t("common.error")} />;

  return (
    <Layout>
      <div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text">{t("accounts.title")}</h1>
              <Badge variant="default">{t("accounts.accountCount", { count: allAccounts.length })}</Badge>
            </div>
            <p className="text-xs sm:text-[13px] text-lavenderDawn-muted dark:text-lavenderMoon-muted mt-1">{t("accounts.subtitle")}</p>
          </div>

          {/* Account Type Filter */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3">
            <div className="w-full sm:w-auto">
              <label className="block mb-1.5 text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider">
                {t("accounts.filterByType")}
              </label>
              <Combobox
                options={allTypes}
                value={typeFilter ? allTypes.find((t) => t.value === typeFilter) ?? null : null}
                onChange={(opt) => setTypeFilter(opt?.value ?? null)}
                getOptionLabel={(o) => o.label}
                renderOption={(o) => (
                  <span className="flex items-center gap-2">
                    {ACCOUNT_TYPE_ICONS[o.value]?.(iconCls("w-4 h-4")) ?? <MoreHorizontal className={iconCls("w-4 h-4")} />}
                    {o.label}
                  </span>
                )}
                renderValue={(o) => (
                  <span className="flex items-center gap-2">
                    {ACCOUNT_TYPE_ICONS[o.value]?.(iconCls("w-4 h-4")) ?? <MoreHorizontal className={iconCls("w-4 h-4")} />}
                    {o.label}
                  </span>
                )}
                placeholder={t("accounts.allTypes")}
                className="w-full sm:w-60"
              />
            </div>
            {typeFilter && (
              <button
                onClick={() => setTypeFilter(null)}
                className="text-xs text-lavenderDawn-iris dark:text-lavenderMoon-iris hover:underline sm:pb-2"
              >
                {t("common.clearFilter")}
              </button>
            )}
          </div>

          {/* Net Worth Chart */}
          <Card className="p-4 sm:p-6">
            <NetWorthChart totalBalanceByDateArray={chartBalanceArray} />
          </Card>

          {/* Grouped Accounts */}
          <div className="space-y-4">
            <Accordion type="multiple">
              {filteredEntries.map(([type, accounts]) => {
                const totalBalance = accounts.reduce((sum, a) => sum + a.current_balance, 0);
                return (
                  <AccordionItem key={type} value={type}>
                    <AccordionTrigger className="hover:bg-accent/20 transition-all duration-200 p-4">
                      <div className="flex items-center justify-between w-full gap-4">
                        <div className="flex items-center gap-2 min-w-0">
                          {ACCOUNT_GROUP_ICONS[type]}
                          <span className="text-base font-medium tracking-tight text-lavenderDawn-text dark:text-lavenderMoon-text truncate">
                            {accountTypeLabels[type as keyof typeof accountTypeLabels] || type}
                          </span>
                        </div>
                        <CurrencyValue amount={totalBalance} bold />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-muted/30">
                      {accounts.length > 10 ? (
                        <VirtualizedList
                          items={accounts}
                          height={400}
                          itemHeight={64}
                          renderItem={(account) => (
                            <AccountRow key={account.id} account={account} />
                          )}
                        />
                      ) : (
                        accounts.map((account) => (
                          <AccountRow key={account.id} account={account} />
                        ))
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function AccountRow({ account }: { account: Account }) {
  const subtype = account.subtype
    ? accountSubtypeLabels[account.subtype as keyof typeof accountSubtypeLabels] || account.subtype
    : undefined;

  return (
    <Link
      to={`/accounts/${account.id}`}
      className="w-full flex items-center justify-between gap-2 p-3 sm:p-4 cursor-pointer hover:bg-lavenderDawn-highlightLow dark:hover:bg-lavenderMoon-highlightMed transition-all duration-200 rounded-lg hover:translate-x-1"
    >
      <div className="flex flex-col items-start min-w-0 flex-1">
        <span className="text-sm sm:text-base font-medium tracking-tight text-lavenderDawn-text dark:text-lavenderMoon-text truncate w-full">
          {account.name}
        </span>
        {subtype && (
          <span className="text-sm font-medium tracking-tight text-lavenderDawn-text/50 dark:text-lavenderMoon-text/50 mt-0.5">
            {subtype}
          </span>
        )}
      </div>
      <CurrencyValue amount={account.current_balance} />
    </Link>
  );
}
