"use client"
import type React from "react"
import { AccountDetails } from "./shared/components/account/account-details/account-details"
import { AccountInfo } from "./shared/components/account/account-info/account-info"
import { AccountOverview } from "./shared/components/account/account-overview/account-overview"
import { Card, CardContent } from "./shared/components/card/card"
import { useTheme, ThemeProvider } from "./shared/components/theme-provider"
import { Accordion } from "./shared/components/Accordion/Accordion"
import { BanknoteIcon as Bank, CreditCard, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { ThemeSwitcher } from "./shared/components/theme-switcher"
import { ChartConfig, ChartContainer } from "./shared/components/LineChart/LineChart"
import { Bar, BarChart } from "recharts"
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

const Home: React.FC = () => {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen flex flex-col bg-${theme}-base text-${theme}-text ${theme}`}>
      {/* <Header userName="Alex" userImage="https://via.placeholder.com/40x40" /> */}
      <ChartContainer config={chartConfig} className="min-h-[200px] w-[200px]">
      <BarChart accessibilityLayer data={chartData}>
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
      <ThemeSwitcher />
      <main className="flex-grow max-w-4xl w-full mx-auto p-4 space-y-6 mt-16 mb-20">
        <h1 className="text-3xl font-bold mb-6">Financial Overview</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <AccountOverview balance={24562.0} percentageChange={2.3} />

          <Card className={`bg-${theme}-surface`}>
            <CardContent className="space-y-4">
              <AccountInfo
                name="Total Assets"
                logo={<TrendingUp className={`w-6 h-6 text-${theme}-pine`} />}
                balance={32450.0}
                description="4 accounts"
                balanceColor={`text-${theme}-pine`}
              />
              <AccountInfo
                name="Total Liabilities"
                logo={<TrendingDown className={`w-6 h-6 text-${theme}-love`} />}
                balance={7888.0}
                description="2 accounts"
                balanceColor={`text-${theme}-love`}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Accordion
            header={
              <AccountInfo
                name="Chase Bank"
                logo={<Bank className={`w-6 h-6 text-${theme}-foam`} />}
                balance={12350.0}
                description="Checking ****4523"
              />
            }
          >
            <AccountDetails
              accountType="Checking Account"
              accountNumber="****4523"
              balance={12350.0}
              transactions={[
                { date: "2023-04-15", description: "Grocery Store", amount: -120.5 },
                { date: "2023-04-14", description: "Salary Deposit", amount: 3000.0 },
                { date: "2023-04-13", description: "Electric Bill", amount: -85.2 },
              ]}
            />
          </Accordion>

          <Accordion
            header={
              <AccountInfo
                name="Amex Platinum"
                logo={<CreditCard className={`w-6 h-6 text-${theme}-iris`} />}
                balance={-2180.0}
                description="Credit Card ****7890"
              />
            }
          >
            <AccountDetails
              accountType="Credit Card"
              accountNumber="****7890"
              balance={-2180.0}
              transactions={[
                { date: "2023-04-15", description: "Restaurant", amount: -75.2 },
                { date: "2023-04-14", description: "Online Shopping", amount: -150.3 },
                { date: "2023-04-12", description: "Gas Station", amount: -40.0 },
              ]}
            />
          </Accordion>

          <Accordion
            header={
              <AccountInfo
                name="Fidelity"
                logo={<Wallet className={`w-6 h-6 text-${theme}-gold`} />}
                balance={15720.0}
                description="Investment ****9981"
              />
            }
          >
            <AccountDetails
              accountType="Investment Account"
              accountNumber="****9981"
              balance={15720.0}
              transactions={[
                { date: "2023-04-15", description: "Stock Purchase", amount: -500.0 },
                { date: "2023-04-13", description: "Dividend Payment", amount: 25.5 },
                { date: "2023-04-10", description: "Fund Transfer", amount: 1000.0 },
              ]}
            />
          </Accordion>
        </div>
      </main>
      {/* <Footer onHomeClick={() => console.log("Home clicked")} /> */}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  )
}

