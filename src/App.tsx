import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Accounts from "./pages/Accounts"
import Transactions from "./pages/Transactions"
import Budget from "./pages/Budget"
import Cards from "./pages/Cards"
import NotFound from "./pages/NotFound"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/budget" element={<Budget />} />
      <Route path="/cards" element={<Cards />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
