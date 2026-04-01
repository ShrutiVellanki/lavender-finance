import { Layout } from "@/components/layout/layout";
import { AccountInfo } from "@/components/product/account/account-info/account-info";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { aggregateBalancesByDate, groupAccountsByType, accountTypes } from "@/lib/utils";
import NetWorthChart from "@/components/product/net-worth/net-worth";
import { fetchAccountData, fetchChartData } from "@/api/api";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Account, NetWorthData } from "@/types";
import { AccountGroup } from "@/components/product/account/account-group/account-group";
import { Loading } from "@/components/ui/loading";
import { ErrorDisplay } from "@/components/ui/error-display";
import { Card } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combo-popover-box";
import { VirtualizedList } from "@/components/ui/virtualized-list";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Layers, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FetchError { message: string }

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
          <div className="flex items-center gap-3">
            <Layers className="w-8 h-8 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
            <h1 className="text-xl font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text">{t("accounts.title")}</h1>
            <Badge variant="default" className="ml-2">{t("accounts.accountCount", { count: allAccounts.length })}</Badge>
          </div>

          {/* Account Type Filter (Combobox) */}
          <div className="flex items-end gap-3">
            <div>
              <label className="block mb-1.5 text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider">
                {t("accounts.filterByType")}
              </label>
              <Combobox
                options={allTypes}
                value={typeFilter ? allTypes.find((t) => t.value === typeFilter) ?? null : null}
                onChange={(opt) => setTypeFilter(opt?.value ?? null)}
                getOptionLabel={(o) => o.label}
                placeholder={t("accounts.allTypes")}
                className="w-60"
              />
            </div>
            {typeFilter && (
              <button
                onClick={() => setTypeFilter(null)}
                className="text-xs text-lavenderDawn-iris dark:text-lavenderMoon-iris hover:underline pb-2"
              >
                {t("common.clearFilter")}
              </button>
            )}
          </div>

          {/* Net Worth Chart */}
          <Card className="p-6">
            <NetWorthChart totalBalanceByDateArray={totalBalanceByDateArray || []} />
          </Card>

          {/* Grouped Accounts (Accordion) */}
          <div className="space-y-4">
            <Accordion type="multiple">
              {filteredEntries.map(([type, accounts]) => (
                <AccordionItem key={type} value={type}>
                  <AccordionTrigger className="hover:bg-accent/20 transition-all duration-200 p-4">
                    <AccountGroup type={type} accounts={accounts} />
                  </AccordionTrigger>
                  <AccordionContent className="bg-muted/30">
                    {accounts.length > 10 ? (
                      <VirtualizedList
                        items={accounts}
                        height={400}
                        itemHeight={64}
                        renderItem={(account) => (
                          <AccountInfo
                            key={account.id}
                            id={account.id}
                            name={account.name}
                            balance={account.current_balance}
                            subtype={account.subtype}
                          />
                        )}
                      />
                    ) : (
                      accounts.map((account) => (
                        <AccountInfo
                          key={account.id}
                          id={account.id}
                          name={account.name}
                          balance={account.current_balance}
                          subtype={account.subtype}
                        />
                      ))
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </Layout>
  );
}
