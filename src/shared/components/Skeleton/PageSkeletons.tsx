import { Layout } from "@/app/layout/layout"
import { Skeleton } from "./Skeleton"

function PageHeader({ titleWidth = "30%", subtitleWidth = "50%" }: { titleWidth?: string; subtitleWidth?: string }) {
  return (
    <div className="space-y-2">
      <Skeleton variant="text" height={24} width={titleWidth} />
      <Skeleton variant="text" height={12} width={subtitleWidth} />
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3 h-full">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" height={10} width="45%" />
        <Skeleton variant="rounded" width={32} height={32} />
      </div>
      <Skeleton variant="text" height={28} width="50%" />
      <Skeleton variant="text" height={10} width="65%" />
      <Skeleton variant="text" height={12} width="40%" />
    </div>
  )
}

function ChartCardSkeleton({ height = 200, titleWidth = "25%" }: { height?: number; titleWidth?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <Skeleton variant="text" height={16} width={titleWidth} />
      <Skeleton variant="rounded" height={height} />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader />
        <ChartCardSkeleton height={240} titleWidth="20%" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        {/* AI Insights */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton variant="rounded" width={24} height={24} />
            <Skeleton variant="text" height={16} width={100} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={72} />
            ))}
          </div>
        </div>
        {/* Spending chart */}
        <ChartCardSkeleton height={280} titleWidth="35%" />
        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton variant="rounded" width={20} height={20} />
              <Skeleton variant="text" height={16} width={140} />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-2">
                <div className="flex-1 space-y-1.5">
                  <Skeleton variant="text" height={14} width="60%" />
                  <Skeleton variant="text" height={10} width="40%" />
                </div>
                <Skeleton variant="text" height={14} width={60} />
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton variant="rounded" width={20} height={20} />
              <Skeleton variant="text" height={16} width={120} />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton variant="text" height={12} width="30%" />
                <Skeleton variant="rounded" height={8} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export function TransactionsSkeleton() {
  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader titleWidth="25%" subtitleWidth="45%" />
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-2">
              <Skeleton variant="text" height={10} width="40%" />
              <Skeleton variant="text" height={22} width="55%" />
            </div>
          ))}
        </div>
        {/* Search bar */}
        <Skeleton variant="rounded" height={42} />
        {/* Filters */}
        <div className="flex gap-3">
          <Skeleton variant="rounded" height={36} className="flex-1" />
          <Skeleton variant="rounded" height={36} width={176} />
          <Skeleton variant="rounded" height={36} width={176} />
          <Skeleton variant="rounded" height={36} width={160} />
        </div>
        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-3 border-b border-border flex gap-4">
            {["30%", "15%", "12%", "12%", "12%", "10%"].map((w, i) => (
              <Skeleton key={i} variant="text" height={10} width={w} />
            ))}
          </div>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="px-6 py-3 border-b border-border/50 flex items-center gap-4">
              <div className="w-[30%] space-y-1.5">
                <Skeleton variant="text" height={14} width="80%" />
                <Skeleton variant="text" height={10} width="50%" />
              </div>
              <Skeleton variant="text" height={12} width="15%" />
              <Skeleton variant="rounded" height={22} width={70} />
              <Skeleton variant="text" height={12} width="12%" />
              <Skeleton variant="rounded" height={22} width={70} />
              <Skeleton variant="text" height={14} width="10%" className="ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export function BudgetSkeleton() {
  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader titleWidth="20%" subtitleWidth="40%" />
        {/* Month selector */}
        <div className="flex items-center justify-center gap-2">
          <Skeleton variant="rounded" width={32} height={32} />
          <Skeleton variant="rounded" width={32} height={32} />
          <Skeleton variant="text" height={22} width={180} />
          <Skeleton variant="rounded" width={32} height={32} />
          <Skeleton variant="rounded" width={32} height={32} />
        </div>
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton variant="text" height={14} width="40%" />
                <Skeleton variant="rounded" height={22} width={44} />
              </div>
              <Skeleton variant="rounded" height={8} />
              <Skeleton variant="text" height={10} width="50%" />
            </div>
          ))}
        </div>
        {/* Chart */}
        <ChartCardSkeleton height={260} titleWidth="30%" />
      </div>
    </Layout>
  )
}

export function AccountsSkeleton() {
  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader titleWidth="22%" subtitleWidth="42%" />
        {/* Filter */}
        <Skeleton variant="rounded" height={36} width={220} />
        {/* Net Worth chart */}
        <ChartCardSkeleton height={240} titleWidth="18%" />
        {/* Account groups (accordions) */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton variant="rounded" width={20} height={20} />
                <Skeleton variant="text" height={16} width={120} />
              </div>
              <Skeleton variant="text" height={16} width={80} />
            </div>
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="flex items-center justify-between py-2 pl-7">
                <div className="space-y-1.5">
                  <Skeleton variant="text" height={14} width={140} />
                  <Skeleton variant="text" height={10} width={80} />
                </div>
                <Skeleton variant="text" height={14} width={80} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </Layout>
  )
}

export function CardsSkeleton() {
  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader titleWidth="18%" subtitleWidth="35%" />
        <div className="flex items-center justify-between">
          <Skeleton variant="text" height={14} width={100} />
          <Skeleton variant="rounded" height={32} width={100} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={190} className="w-full" />
          ))}
        </div>
      </div>
    </Layout>
  )
}

export function AccountDetailSkeleton() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton variant="rounded" width={32} height={32} />
          <div className="flex-1 space-y-1.5">
            <Skeleton variant="text" height={22} width="35%" />
            <Skeleton variant="text" height={12} width="20%" />
          </div>
          <Skeleton variant="text" height={28} width={120} />
        </div>
        <ChartCardSkeleton height={220} titleWidth="22%" />
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border">
            <Skeleton variant="text" height={16} width={120} />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-6 py-3 border-b border-border/50 flex items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <Skeleton variant="text" height={14} width="45%" />
                <Skeleton variant="text" height={10} width="25%" />
              </div>
              <Skeleton variant="rounded" height={22} width={70} />
              <Skeleton variant="text" height={14} width={80} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export function SettingsSkeleton() {
  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader titleWidth="20%" subtitleWidth="38%" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left column */}
          <div className="space-y-6">
            {/* Profile card */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" height={14} width="40%" />
                  <Skeleton variant="text" height={10} width="55%" />
                </div>
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton variant="text" height={10} width="20%" />
                  <Skeleton variant="rounded" height={36} />
                </div>
              ))}
              <Skeleton variant="rounded" height={36} width={120} />
            </div>
            {/* Dev settings */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <Skeleton variant="rounded" width={20} height={20} />
                <Skeleton variant="text" height={14} width={130} />
              </div>
              <Skeleton variant="rounded" height={100} />
            </div>
          </div>
          {/* Right column */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <Skeleton variant="rounded" width={20} height={20} />
                <Skeleton variant="text" height={14} width={90} />
              </div>
              <div className="flex gap-2">
                <Skeleton variant="rounded" height={36} width={90} />
                <Skeleton variant="rounded" height={36} width={90} />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <Skeleton variant="rounded" width={20} height={20} />
                <Skeleton variant="text" height={14} width={80} />
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={36} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
