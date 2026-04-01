import { Routes, Route } from "react-router-dom"
import Dashboard from "@/features/dashboard/pages/Dashboard"
import Accounts from "@/features/accounts/pages/Accounts"
import AccountDetail from "@/features/accounts/pages/AccountDetail"
import Transactions from "@/features/transactions/pages/Transactions"
import Budget from "@/features/budget/pages/Budget"
import Cards from "@/features/cards/pages/Cards"
import Settings from "@/features/settings/pages/Settings"
import NotFound from "@/app/NotFound"

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/accounts/:id" element={<AccountDetail />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/budget" element={<Budget />} />
      <Route path="/cards" element={<Cards />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
