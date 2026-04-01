import { Layout } from "@/app/layout/layout";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Transaction, TransactionCategory, TransactionStatus, AccountData } from "@/types";
import { fetchTransactions, fetchAccountData } from "@/services/api";
import { Loading } from "@/shared/components/Loading";
import { ErrorDisplay } from "@/shared/components/ErrorDisplay";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/Card";
import { Modal } from "@/shared/components/Modal";
import { Select } from "@/shared/components/Dropdown";
import { Autocomplete } from "@/shared/components/Autocomplete";
import { useCurrency } from "@/shared/context/currency";
import { Pagination } from "@/shared/components/Pagination";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CATEGORY_ICON, STATUS_ICON } from "@/shared/constants/category-icons";

const CATEGORIES: TransactionCategory[] = ["Groceries", "Dining", "Transport", "Shopping", "Utilities", "Income", "Transfer", "Entertainment"];
const STATUSES: TransactionStatus[] = ["completed", "pending", "failed"];
const STATUS_VARIANT: Record<string, "success" | "warning" | "danger"> = { completed: "success", pending: "warning", failed: "danger" };

type CategoryFilter = TransactionCategory | "all";
type StatusFilter = TransactionStatus | "all";

const categoryOptions: CategoryFilter[] = ["all", ...CATEGORIES];
const statusOptions: StatusFilter[] = ["all", ...STATUSES];

export default function Transactions() {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  const [searchParams] = useSearchParams();
  const initialAccount = searchParams.get("account");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<AccountData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [accountFilter, setAccountFilter] = useState<string>("all");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [searchMerchant, setSearchMerchant] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [txData, acctData] = await Promise.all([fetchTransactions(), fetchAccountData()]);
      setTransactions(txData);
      setAccounts(acctData);
      if (initialAccount && acctData[initialAccount]) {
        setAccountFilter(initialAccount);
      }
    } catch (err) {
      setError((err as globalThis.Error).message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }, [initialAccount]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const allMerchants = useMemo(() => [...new Set(transactions.map((t) => t.merchant))], [transactions]);

  const accountOptions = useMemo(() => {
    return ["all", ...Object.keys(accounts)];
  }, [accounts]);

  const fetchMerchantSuggestions = useCallback(
    async (query: string) => allMerchants.filter((m) => m.toLowerCase().includes(query.toLowerCase())),
    [allMerchants],
  );

  const filtered = useMemo(() => {
    let result = transactions;
    if (accountFilter !== "all") result = result.filter((t) => t.accountId === accountFilter);
    if (searchMerchant) result = result.filter((t) => t.merchant === searchMerchant);
    if (categoryFilter !== "all") result = result.filter((t) => t.category === categoryFilter);
    if (statusFilter !== "all") result = result.filter((t) => t.status === statusFilter);
    return result;
  }, [transactions, accountFilter, searchMerchant, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedTx = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  useEffect(() => { setCurrentPage(1); }, [categoryFilter, statusFilter, searchMerchant, accountFilter]);

  const { totalIncome, totalExpenses, net } = useMemo(() => {
    let income = 0, expenses = 0;
    filtered.forEach((t) => { if (t.amount >= 0) income += t.amount; else expenses += Math.abs(t.amount); });
    return { totalIncome: income, totalExpenses: expenses, net: income - expenses };
  }, [filtered]);

  const hasActiveFilters = searchMerchant || categoryFilter !== "all" || statusFilter !== "all" || accountFilter !== "all";

  function clearAllFilters() {
    setSearchMerchant(null);
    setCategoryFilter("all");
    setStatusFilter("all");
    setAccountFilter("all");
  }

  if (loading) return <Loading message={t("common.loading")} />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchData} title={t("common.error")} />;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text">{t("transactions.title")}</h1>
          <p className="text-xs sm:text-[13px] text-lavenderDawn-muted dark:text-lavenderMoon-muted mt-1">{t("transactions.subtitle")}</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5">
            <p className="text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider mb-1">{t("transactions.totalIncome")}</p>
            <p className="text-lg font-semibold text-lavenderDawn-foam dark:text-lavenderMoon-foam">{formatCurrency(totalIncome)}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider mb-1">{t("transactions.totalExpenses")}</p>
            <p className="text-lg font-semibold text-lavenderDawn-love dark:text-lavenderMoon-love">{formatCurrency(totalExpenses)}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider mb-1">{t("transactions.net")}</p>
            <p className={`text-lg font-semibold ${net >= 0 ? "text-lavenderDawn-foam dark:text-lavenderMoon-foam" : "text-lavenderDawn-love dark:text-lavenderMoon-love"}`}>
              {net >= 0 ? "+" : ""}{formatCurrency(net)}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-end gap-3">
          <div className="sm:col-span-2 lg:flex-1 lg:max-w-xs">
            <label className="block mb-1.5 text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider">{t("transactions.merchant")}</label>
            <Autocomplete
              fetchSuggestions={fetchMerchantSuggestions}
              getOptionLabel={(m: string) => m}
              onSelect={(m) => setSearchMerchant(m)}
              onClear={() => setSearchMerchant(null)}
              placeholder={t("transactions.searchMerchant")}
            />
          </div>
          <Select
            options={accountOptions}
            value={accountFilter}
            onChange={(v) => setAccountFilter(v)}
            getOptionLabel={(o) => o === "all" ? "All Accounts" : (accounts[o]?.name ?? o)}
            label="Account"
            className="w-full sm:w-44"
          />
          <Select
            options={categoryOptions}
            value={categoryFilter}
            onChange={(v) => setCategoryFilter(v)}
            getOptionLabel={(o) => o === "all" ? "All Categories" : o}
            renderOption={(o) => (
              <span className="flex items-center gap-2">
                {o !== "all" && CATEGORY_ICON[o] && <span className="shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5 opacity-60">{CATEGORY_ICON[o]}</span>}
                {o === "all" ? "All Categories" : o}
              </span>
            )}
            renderValue={(o) => (
              <span className="flex items-center gap-2">
                {o !== "all" && CATEGORY_ICON[o] && <span className="shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5 opacity-60">{CATEGORY_ICON[o]}</span>}
                {o === "all" ? "All Categories" : o}
              </span>
            )}
            label="Category"
            className="w-full sm:w-44"
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(v) => setStatusFilter(v)}
            getOptionLabel={(o) => o === "all" ? "All Statuses" : o}
            renderOption={(o) => (
              <span className="flex items-center gap-2">
                {o !== "all" && STATUS_ICON[o] && <span className="shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5 opacity-60">{STATUS_ICON[o]}</span>}
                {o === "all" ? "All Statuses" : o}
              </span>
            )}
            renderValue={(o) => (
              <span className="flex items-center gap-2">
                {o !== "all" && STATUS_ICON[o] && <span className="shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5 opacity-60">{STATUS_ICON[o]}</span>}
                {o === "all" ? "All Statuses" : o}
              </span>
            )}
            label="Status"
            className="w-full sm:w-40"
          />
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="self-end" onClick={clearAllFilters}>
              {t("transactions.clearFilters")}
            </Button>
          )}
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[750px]">
              <thead>
                <tr className="border-b border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow">
                  {["Description", "Account", "Category", "Date", "Status", "Amount"].map((h, i) => (
                    <th key={h} className={`${i === 0 ? "pl-6" : "pl-4"} ${i === 5 ? "pr-6 text-right" : ""} py-3 text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider text-left`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-lavenderDawn-muted dark:text-lavenderMoon-muted">{t("transactions.noMatches")}</td></tr>
                ) : paginatedTx.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="border-b border-lavenderDawn-highlightLow/50 dark:border-lavenderMoon-highlightLow/50 last:border-0 hover:bg-lavenderDawn-highlightLow/20 dark:hover:bg-lavenderMoon-highlightLow/10 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-3">
                      <p className="font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">{tx.description}</p>
                      <p className="text-xs text-lavenderDawn-muted dark:text-lavenderMoon-muted">{tx.merchant}</p>
                    </td>
                    <td className="px-4 py-3 text-lavenderDawn-text/70 dark:text-lavenderMoon-text/70 text-xs">
                      {accounts[tx.accountId]?.name ?? tx.accountId}
                    </td>
                    <td className="px-4 py-3"><Badge variant="default" icon={CATEGORY_ICON[tx.category]}>{tx.category}</Badge></td>
                    <td className="px-4 py-3 text-lavenderDawn-text/70 dark:text-lavenderMoon-text/70 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[tx.status]} icon={STATUS_ICON[tx.status]}>{tx.status}</Badge></td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {tx.amount >= 0 ? <ArrowUpRight className="w-3 h-3 text-lavenderDawn-foam dark:text-lavenderMoon-foam" /> : <ArrowDownRight className="w-3 h-3 text-lavenderDawn-love dark:text-lavenderMoon-love" />}
                        <span className={`font-medium tabular-nums ${tx.amount >= 0 ? "text-lavenderDawn-foam dark:text-lavenderMoon-foam" : "text-lavenderDawn-text dark:text-lavenderMoon-text"}`}>
                          {tx.amount >= 0 ? "+" : ""}{formatCurrency(tx.amount)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 sm:px-6 py-3 border-t border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow">
              <p className="text-xs text-lavenderDawn-muted dark:text-lavenderMoon-muted">
                {t("transactions.showing", {
                  from: (currentPage - 1) * PAGE_SIZE + 1,
                  to: Math.min(currentPage * PAGE_SIZE, filtered.length),
                  total: filtered.length,
                })}
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </Card>

        {/* Transaction Detail Modal */}
        <Modal open={!!selectedTx} onClose={() => setSelectedTx(null)} title={t("transactions.details")}>
          {selectedTx && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-lavenderDawn-muted dark:text-lavenderMoon-muted">{t("transactions.amount")}</span>
                <span className={`text-lg font-semibold ${selectedTx.amount >= 0 ? "text-lavenderDawn-foam dark:text-lavenderMoon-foam" : "text-lavenderDawn-text dark:text-lavenderMoon-text"}`}>
                  {selectedTx.amount >= 0 ? "+" : ""}{formatCurrency(selectedTx.amount)}
                </span>
              </div>
              {[
                ["Description", selectedTx.description],
                ["Merchant", selectedTx.merchant],
                ["Date", new Date(selectedTx.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })],
                ["Account", accounts[selectedTx.accountId]?.name ?? selectedTx.accountId],
                ["Transaction ID", selectedTx.id],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-lavenderDawn-muted dark:text-lavenderMoon-muted">{label}</span>
                  <span className="text-sm text-lavenderDawn-text dark:text-lavenderMoon-text">{val}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-sm text-lavenderDawn-muted dark:text-lavenderMoon-muted">{t("transactions.category")}</span>
                <Badge variant="default" icon={CATEGORY_ICON[selectedTx.category]}>{selectedTx.category}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-lavenderDawn-muted dark:text-lavenderMoon-muted">{t("transactions.status")}</span>
                <Badge variant={STATUS_VARIANT[selectedTx.status]} icon={STATUS_ICON[selectedTx.status]}>{selectedTx.status}</Badge>
              </div>
              <Button variant="outline" className="w-full mt-2" onClick={() => setSelectedTx(null)}>{t("common.close")}</Button>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
}
