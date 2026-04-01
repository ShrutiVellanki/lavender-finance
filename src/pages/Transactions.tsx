import { Layout } from "@/components/layout/layout";
import { useState, useEffect, useMemo } from "react";
import { Transaction, TransactionCategory, TransactionStatus } from "@/types";
import { fetchTransactions } from "@/api/api";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeftRight,
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const CATEGORIES: TransactionCategory[] = [
  "Groceries",
  "Dining",
  "Transport",
  "Shopping",
  "Utilities",
  "Income",
  "Transfer",
  "Entertainment",
];

const STATUSES: TransactionStatus[] = ["completed", "pending", "failed"];

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<TransactionCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (err) {
      setError((err as Error).message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    let result = transactions;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.merchant.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }
    if (categoryFilter !== "all") {
      result = result.filter((t) => t.category === categoryFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }
    return result;
  }, [transactions, searchQuery, categoryFilter, statusFilter]);

  const { totalIncome, totalExpenses, net } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    filtered.forEach((t) => {
      if (t.amount >= 0) income += t.amount;
      else expenses += Math.abs(t.amount);
    });
    return { totalIncome: income, totalExpenses: expenses, net: income - expenses };
  }, [filtered]);

  const statusBadge = (status: TransactionStatus) => {
    const map: Record<string, string> = {
      completed:
        "bg-lavenderDawn-foam/15 text-lavenderDawn-foam dark:bg-lavenderMoon-foam/15 dark:text-lavenderMoon-foam",
      pending:
        "bg-lavenderDawn-gold/15 text-lavenderDawn-gold dark:bg-lavenderMoon-gold/15 dark:text-lavenderMoon-gold",
      failed:
        "bg-lavenderDawn-love/15 text-lavenderDawn-love dark:bg-lavenderMoon-love/15 dark:text-lavenderMoon-love",
    };
    return (
      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${map[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={fetchData} />;

  return (
    <Layout>
      <div className="md:p-0 p-6 overflow-x-auto">
        <div className="min-w-[768px] space-y-6">
          {/* Header */}
          <div className="px-6 py-4 flex items-center gap-3">
            <ArrowLeftRight className="w-8 h-8 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
            <h1 className="text-2xl font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
              Transactions
            </h1>
          </div>

          {/* Summary Banner */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-lavenderDawn-overlay dark:border-lavenderMoon-overlay bg-lavenderDawn-overlay/50 dark:bg-[#636363]/50 p-5">
              <p className="text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider mb-1">
                Total Income
              </p>
              <p className="text-lg font-semibold text-lavenderDawn-foam dark:text-lavenderMoon-foam">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="rounded-2xl border border-lavenderDawn-overlay dark:border-lavenderMoon-overlay bg-lavenderDawn-overlay/50 dark:bg-[#636363]/50 p-5">
              <p className="text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider mb-1">
                Total Expenses
              </p>
              <p className="text-lg font-semibold text-lavenderDawn-love dark:text-lavenderMoon-love">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="rounded-2xl border border-lavenderDawn-overlay dark:border-lavenderMoon-overlay bg-lavenderDawn-overlay/50 dark:bg-[#636363]/50 p-5">
              <p className="text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider mb-1">
                Net
              </p>
              <p
                className={`text-lg font-semibold ${
                  net >= 0
                    ? "text-lavenderDawn-foam dark:text-lavenderMoon-foam"
                    : "text-lavenderDawn-love dark:text-lavenderMoon-love"
                }`}
              >
                {net >= 0 ? "+" : ""}
                {formatCurrency(net)}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lavenderDawn-muted dark:text-lavenderMoon-muted" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow bg-lavenderDawn-base dark:bg-lavenderMoon-surface text-lavenderDawn-text dark:text-lavenderMoon-text placeholder:text-lavenderDawn-muted/50 dark:placeholder:text-lavenderMoon-muted/50 focus:outline-none focus:ring-1 focus:ring-lavenderDawn-iris dark:focus:ring-lavenderMoon-iris"
              />
            </div>

            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as TransactionCategory | "all")}
                className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow bg-lavenderDawn-base dark:bg-lavenderMoon-surface text-lavenderDawn-text dark:text-lavenderMoon-text focus:outline-none focus:ring-1 focus:ring-lavenderDawn-iris dark:focus:ring-lavenderMoon-iris"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-lavenderDawn-muted dark:text-lavenderMoon-muted" />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | "all")}
                className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow bg-lavenderDawn-base dark:bg-lavenderMoon-surface text-lavenderDawn-text dark:text-lavenderMoon-text focus:outline-none focus:ring-1 focus:ring-lavenderDawn-iris dark:focus:ring-lavenderMoon-iris"
              >
                <option value="all">All Statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-lavenderDawn-muted dark:text-lavenderMoon-muted" />
            </div>
          </div>

          {/* Transaction Table */}
          <div className="rounded-2xl border border-lavenderDawn-overlay dark:border-lavenderMoon-overlay bg-lavenderDawn-overlay/50 dark:bg-[#636363]/50 backdrop-blur-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow">
                  <th className="text-left px-6 py-3 text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-lavenderDawn-muted dark:text-lavenderMoon-muted"
                    >
                      No transactions match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-lavenderDawn-highlightLow/50 dark:border-lavenderMoon-highlightLow/50 last:border-0 hover:bg-lavenderDawn-highlightLow/20 dark:hover:bg-lavenderMoon-highlightLow/10 transition-colors"
                    >
                      <td className="px-6 py-3">
                        <div>
                          <p className="font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
                            {tx.description}
                          </p>
                          <p className="text-xs text-lavenderDawn-muted dark:text-lavenderMoon-muted">
                            {tx.merchant}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10 text-lavenderDawn-iris dark:text-lavenderMoon-iris">
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-lavenderDawn-text/70 dark:text-lavenderMoon-text/70">
                        {new Date(tx.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">{statusBadge(tx.status)}</td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {tx.amount >= 0 ? (
                            <ArrowUpRight className="w-3 h-3 text-lavenderDawn-foam dark:text-lavenderMoon-foam" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-lavenderDawn-love dark:text-lavenderMoon-love" />
                          )}
                          <span
                            className={`font-medium tabular-nums ${
                              tx.amount >= 0
                                ? "text-lavenderDawn-foam dark:text-lavenderMoon-foam"
                                : "text-lavenderDawn-text dark:text-lavenderMoon-text"
                            }`}
                          >
                            {tx.amount >= 0 ? "+" : ""}
                            {formatCurrency(tx.amount)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
