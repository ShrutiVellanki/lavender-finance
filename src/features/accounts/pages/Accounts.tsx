import { Layout } from "@/app/layout/layout";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/shared/components/Accordion";
import { aggregateBalancesByDate, groupAccountsByType, accountTypes, formatCurrency } from "@/shared/utils";
import NetWorthChart from "@/features/dashboard/components/net-worth/net-worth";
import { fetchAccountData, fetchChartData } from "@/services/api";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Account, NetWorthData } from "@/types";
import { Loading } from "@/shared/components/Loading";
import { ErrorDisplay } from "@/shared/components/ErrorDisplay";
import { Card } from "@/shared/components/Card";
import { Combobox } from "@/shared/components/Combobox";
import { VirtualizedList } from "@/shared/components/VirtualizedList";
import { Badge } from "@/shared/components/Badge";
import { Layers, CreditCard, Banknote as Bank, Car, Coins, House, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { accountTypeLabels, accountSubtypeLabels } from "@/shared/constants/account-constants";

interface FetchError { message: string }

const ACCOUNT_GROUP_ICONS: Record<string, React.ReactNode> = {
  credit: <CreditCard className="w-5 h-5 text-lavenderDawn-iris/90 dark:text-lavenderMoon-iris/90 stroke-[1.5]" />,
  real_estate: <House className="w-5 h-5 text-lavenderDawn-iris/90 dark:text-lavenderMoon-iris/90 stroke-[1.5]" />,
  depository: <Bank className="w-5 h-5 text-lavenderDawn-iris/90 dark:text-lavenderMoon-iris/90 stroke-[1.5]" />,
  vehicle: <Car className="w-5 h-5 text-lavenderDawn-iris/90 dark:text-lavenderMoon-iris/90 stroke-[1.5]" />,
  brokerage: <Coins className="w-5 h-5 text-lavenderDawn-iris/90 dark:text-lavenderMoon-iris/90 stroke-[1.5]" />,
  loan: <DollarSign className="w-5 h-5 text-lavenderDawn-iris/90 dark:text-lavenderMoon-iris/90 stroke-[1.5]" />,
};

function CurrencyValue({ amount, bold = false }: { amount: number; bold?: boolean }) {
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
  const [groupedAccounts, setGroupedAccounts] = useState<{ [key: string]: Account[] } | null>(null);
  const [totalBalanceByDateArray, setTotalBalanceByDateArray] = useState<NetWorthData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [accountData, chartData] = await Promise.all([fetchAccountData(), fetchChartData()]);
      setGroupedAccounts(groupAccountsByType(accountData));
      setTotalBalanceByDateArray(aggregateBalancesByDate(chartData));
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

  if (loading) return <Loading message={t("common.loading")} />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchData} title={t("common.error")} />;

  return (
    <Layout>
      <div>
        <div className="space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
            <h1 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text">{t("accounts.title")}</h1>
            <Badge variant="default">{t("accounts.accountCount", { count: allAccounts.length })}</Badge>
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
            <NetWorthChart totalBalanceByDateArray={totalBalanceByDateArray || []} />
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
