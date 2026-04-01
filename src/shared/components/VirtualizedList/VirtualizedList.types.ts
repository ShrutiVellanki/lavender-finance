import type React from "react"

export type VirtualizedListProps<T> = {
  items: T[]
  height: number
  itemHeight: number
  overscan?: number
  renderItem: (item: T, index: number) => React.ReactNode
}
