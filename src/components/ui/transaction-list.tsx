import React, { useMemo, useState } from "react"
import { cn } from "@/lib/utils"

type TransactionStatus = "succeeded" | "pending" | "failed"

type Transaction = {
  id: string
  customerName: string
  amountCents: number
  currency: string
  status: TransactionStatus
  createdAt: string
}

type SortKey = "customerName" | "amountCents" | "status" | "createdAt"
type SortDirection = "asc" | "desc"

type TransactionListProps = {
  transactions: Transaction[]
  loading?: boolean
  title?: string
}

function formatCurrency(amountCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amountCents / 100)
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso))
}

function compareValues(a: string | number, b: string | number, dir: SortDirection) {
  if (a < b) return dir === "asc" ? -1 : 1
  if (a > b) return dir === "asc" ? 1 : -1
  return 0
}

const statusVariant: Record<TransactionStatus, string> = {
  succeeded: "bg-chart-2/10 text-chart-2",
  pending: "bg-chart-4/10 text-chart-4",
  failed: "bg-destructive/10 text-destructive",
}

export default function TransactionList({
  transactions,
  loading = false,
  title = "Recent transactions",
}: TransactionListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | TransactionStatus>("all")
  const [sortKey, setSortKey] = useState<SortKey>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDirection(key === "createdAt" ? "desc" : "asc")
    }
  }

  const rows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const filtered = transactions.filter((t) => {
      const matchSearch = !q || t.customerName.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
      const matchStatus = statusFilter === "all" || t.status === statusFilter
      return matchSearch && matchStatus
    })
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "customerName": return compareValues(a.customerName.toLowerCase(), b.customerName.toLowerCase(), sortDirection)
        case "amountCents": return compareValues(a.amountCents, b.amountCents, sortDirection)
        case "status": return compareValues(a.status, b.status, sortDirection)
        case "createdAt": return compareValues(new Date(a.createdAt).getTime(), new Date(b.createdAt).getTime(), sortDirection)
        default: return 0
      }
    })
  }, [transactions, searchQuery, statusFilter, sortKey, sortDirection])

  const totalVolume = useMemo(
    () => rows.reduce((sum, t) => (t.status === "succeeded" ? sum + t.amountCents : sum), 0),
    [rows],
  )

  const sortIndicator = (col: SortKey) => (sortKey !== col ? "↕" : sortDirection === "asc" ? "↑" : "↓")

  return (
    <section aria-labelledby="tx-heading" className="rounded-xl border border-border bg-card p-5 max-w-[900px]">
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 id="tx-heading" className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">{title}</h2>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {rows.length} transactions &middot; Volume {formatCurrency(totalVolume, "USD")}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer or ID"
            className="h-8 px-3 text-[12px] rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 ring-offset-background min-w-[200px]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | TransactionStatus)}
            className="h-8 px-2 text-[12px] rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 ring-offset-background"
          >
            <option value="all">All</option>
            <option value="succeeded">Succeeded</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div aria-live="polite" className="py-8 text-center text-[13px] text-muted-foreground">Loading transactions...</div>
      ) : rows.length === 0 ? (
        <div aria-live="polite" className="py-8 text-center text-[13px] text-muted-foreground">No transactions found.</div>
      ) : (
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border text-left">
                {(["customerName", "amountCents", "status", "createdAt"] as SortKey[]).map((col) => (
                  <th key={col} scope="col" className="py-2.5 px-3 first:pl-0">
                    <button
                      type="button"
                      onClick={() => handleSort(col)}
                      className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {col === "customerName" ? "Customer" : col === "amountCents" ? "Amount" : col === "createdAt" ? "Date" : "Status"}{" "}
                      <span className="opacity-50">{sortIndicator(col)}</span>
                    </button>
                  </th>
                ))}
                <th scope="col" className="py-2.5 px-3 text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">ID</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-3 px-3 first:pl-0 text-[13px] font-medium text-foreground">{t.customerName}</td>
                  <td className="py-3 px-3 text-[13px] text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {formatCurrency(t.amountCents, t.currency)}
                  </td>
                  <td className="py-3 px-3">
                    <span className={cn("inline-block px-2 py-0.5 rounded-md text-[11px] font-medium", statusVariant[t.status])}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[13px] text-muted-foreground">{formatDate(t.createdAt)}</td>
                  <td className="py-3 px-3 text-[11px] font-mono text-muted-foreground">{t.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
