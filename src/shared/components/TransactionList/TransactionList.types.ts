export type TransactionStatus = "succeeded" | "pending" | "failed"

export type Transaction = {
  id: string
  customerName: string
  amountCents: number
  currency: string
  status: TransactionStatus
  createdAt: string
}

export type SortKey = "customerName" | "amountCents" | "status" | "createdAt"
export type SortDirection = "asc" | "desc"

export type TransactionListProps = {
  transactions: Transaction[]
  loading?: boolean
  title?: string
}
