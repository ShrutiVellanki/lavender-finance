import type { TransactionStatus } from "./TransactionList.types"

export const statusVariant: Record<TransactionStatus, string> = {
  succeeded: "bg-chart-2/10 text-chart-2",
  pending: "bg-chart-4/10 text-chart-4",
  failed: "bg-destructive/10 text-destructive",
}
