import type { AccountData, ChartData, Transaction, BudgetCategory, SpendingSummary, UserSettings } from "../types";

export const accountData: AccountData = {
  "182616478020197825": {
    id: "182616478020197825",
    current_balance: 15272.19,
    name: "Melanie's Checking",
    subtype: "checking",
    type: "depository"
  },
  "182616478054800834": {
    id: "182616478054800834",
    current_balance: 50428.32,
    name: "Joint Savings",
    subtype: "savings",
    type: "depository"
  },
  "182616478096743875": {
    id: "182616478096743875",
    current_balance: -2621.39,
    name: "Joint Credit Card",
    subtype: "credit_card",
    type: "credit"
  },
  "182616478134492612": {
    id: "182616478134492612",
    current_balance: 180707.72,
    name: "Jon's 401k",
    subtype: "st_401k",
    type: "brokerage"
  },
  "182616478165949893": {
    id: "182616478165949893",
    current_balance: 150912.46,
    name: "Melanie's 401k",
    subtype: "st_401k",
    type: "brokerage"
  },
  "182616478214184390": {
    id: "182616478214184390",
    current_balance: 200862.92,
    name: "Melanie's IRA",
    subtype: "ira",
    type: "brokerage"
  },
  "182616478263467463": {
    id: "182616478263467463",
    current_balance: 10635.8,
    name: "Brokerage",
    subtype: "brokerage",
    type: "brokerage"
  },
  "182616478315896264": {
    id: "182616478315896264",
    current_balance: 300090.9,
    name: "Home",
    subtype: "primary_home",
    type: "real_estate"
  },
  "182616478354693577": {
    id: "182616478354693577",
    current_balance: -239133.1,
    name: "Mortgage",
    subtype: "mortgage",
    type: "loan"
  },
  "182616478368325066": {
    id: "182616478368325066",
    current_balance: 20614.07,
    name: "Honda CR-V",
    subtype: "car",
    type: "vehicle"
  }
};

// Generate dates for the past year
const generateDates = (count: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

const dates = generateDates(365); // Generate 365 days of data

// Helper function to generate historical data for an account
const generateAccountHistory = (
  baseBalance: number,
  dates: string[],
  modifiers: (date: string, index: number, prevBalance: number) => { balance: number }
) => {
  return dates.reduce((acc: { date: string; balance: number }[], date, index) => {
    const prevBalance = index === 0 ? baseBalance : acc[index - 1].balance;
    const { balance } = modifiers(date, index, prevBalance);
    acc.push({ date, balance });
    return acc;
  }, []);
};

export const chartData: ChartData = {
  // Checking account with regular salary deposits and spending patterns
  "182616478020197825": generateAccountHistory(15000, dates, (date, index, prevBalance) => {
    const dayOfMonth = new Date(date).getDate();
    const monthlyPattern = dayOfMonth === 15 ? 5000 : (dayOfMonth === 30 || dayOfMonth === 31) ? 5000 : -200;
    const randomVariation = Math.random() * 300 - 150;
    return { balance: prevBalance + monthlyPattern + randomVariation };
  }),

  // Savings account with steady growth and occasional large deposits
  "182616478054800834": generateAccountHistory(45000, dates, (date, index, prevBalance) => {
    const monthlyInterest = 50;
    const quarterEnd = [31, 91, 182, 273].includes(index);
    const bonusDeposit = quarterEnd ? 5000 : 0;
    return { balance: prevBalance + monthlyInterest + bonusDeposit };
  }),

  // Credit card with holiday spending spikes and regular payments
  "182616478096743875": generateAccountHistory(-2500, dates, (date, index, prevBalance) => {
    const dayOfMonth = new Date(date).getDate();
    const monthIndex = new Date(date).getMonth();
    const holidaySpending = (monthIndex === 10 || monthIndex === 11) ? -1500 : 0;
    const payment = dayOfMonth === 5 ? 2000 : -100;
    const randomSpending = Math.random() * 100 - 80;
    return { balance: prevBalance + payment + holidaySpending + randomSpending };
  }),

  // 401k with market volatility and regular contributions
  "182616478134492612": generateAccountHistory(160000, dates, (date, index, prevBalance) => {
    const dailyMarketChange = Math.random() * 2000 - 1000;
    const dayOfMonth = new Date(date).getDate();
    const biweeklyContribution = (dayOfMonth === 15 || dayOfMonth === 30) ? 500 : 0;
    const marketCorrection = index === 180 ? -15000 : 0;
    const yearEndRally = index > 330 ? 200 : 0;
    return { balance: prevBalance + dailyMarketChange + biweeklyContribution + marketCorrection + yearEndRally };
  }),

  // Second 401k with different investment strategy
  "182616478165949893": generateAccountHistory(140000, dates, (date, index, prevBalance) => {
    const dailyMarketChange = Math.random() * 1500 - 750;
    const dayOfMonth = new Date(date).getDate();
    const monthlyContribution = dayOfMonth === 15 ? 1000 : 0;
    const techBoom = (index > 90 && index < 180) ? 200 : 0;
    return { balance: prevBalance + dailyMarketChange + monthlyContribution + techBoom };
  }),

  // IRA with conservative growth
  "182616478214184390": generateAccountHistory(195000, dates, (date, index, prevBalance) => {
    const dailyMarketChange = Math.random() * 1000 - 400;
    const monthlyDividend = new Date(date).getDate() === 15 ? 300 : 0;
    return { balance: prevBalance + dailyMarketChange + monthlyDividend };
  }),

  // Brokerage account with active trading
  "182616478263467463": generateAccountHistory(8000, dates, (date, index, prevBalance) => {
    const dailyTrading = Math.random() * 500 - 250;
    const goodTrades = (index > 120 && index < 150) ? 200 : 0;
    const badTrades = (index > 200 && index < 220) ? -150 : 0;
    return { balance: prevBalance + dailyTrading + goodTrades + badTrades };
  }),

  // Home value with seasonal trends
  "182616478315896264": generateAccountHistory(290000, dates, (date, index, prevBalance) => {
    const monthIndex = new Date(date).getMonth();
    const seasonalTrend = (monthIndex >= 3 && monthIndex <= 8) ? 100 : -50;
    const appreciation = 50;
    return { balance: prevBalance + seasonalTrend + appreciation };
  }),

  // Mortgage with regular payments
  "182616478354693577": generateAccountHistory(-245000, dates, (date, index, prevBalance) => {
    const dayOfMonth = new Date(date).getDate();
    const monthlyPayment = dayOfMonth === 1 ? 2000 : 0;
    const principalPortion = dayOfMonth === 1 ? 500 : 0;
    return { balance: prevBalance + monthlyPayment + principalPortion };
  }),

  // Vehicle with depreciation
  "182616478368325066": generateAccountHistory(22000, dates, (date, index, prevBalance) => {
    const dailyDepreciation = -1.5;
    const monthIndex = new Date(date).getMonth();
    const winterDepreciation = (monthIndex === 11 || monthIndex === 0 || monthIndex === 1) ? -5 : 0;
    return { balance: prevBalance + dailyDepreciation + winterDepreciation };
  })
};

// ──────────────────────────── Transactions ────────────────────────────

const merchants: Record<string, { category: Transaction["category"]; desc: string }> = {
  "Whole Foods": { category: "Groceries", desc: "Whole Foods Market" },
  "Trader Joe's": { category: "Groceries", desc: "Trader Joe's" },
  "Costco": { category: "Groceries", desc: "Costco Wholesale" },
  "Uber Eats": { category: "Dining", desc: "Uber Eats Order" },
  "Chipotle": { category: "Dining", desc: "Chipotle Mexican Grill" },
  "Starbucks": { category: "Dining", desc: "Starbucks Coffee" },
  "Shell Gas": { category: "Transport", desc: "Shell Gas Station" },
  "Uber": { category: "Transport", desc: "Uber Ride" },
  "Lyft": { category: "Transport", desc: "Lyft Ride" },
  "Amazon": { category: "Shopping", desc: "Amazon.com" },
  "Target": { category: "Shopping", desc: "Target" },
  "Nike": { category: "Shopping", desc: "Nike.com" },
  "PG&E": { category: "Utilities", desc: "PG&E Electric" },
  "Comcast": { category: "Utilities", desc: "Comcast Internet" },
  "AT&T": { category: "Utilities", desc: "AT&T Wireless" },
  "Netflix": { category: "Entertainment", desc: "Netflix Subscription" },
  "Spotify": { category: "Entertainment", desc: "Spotify Premium" },
  "AMC": { category: "Entertainment", desc: "AMC Theatres" },
  "Employer": { category: "Income", desc: "Direct Deposit - Payroll" },
  "Venmo": { category: "Transfer", desc: "Venmo Transfer" },
};

const merchantKeys = Object.keys(merchants);
const accountIds = Object.keys(accountData);
const statuses: Transaction["status"][] = ["completed", "completed", "completed", "completed", "pending", "failed"];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateTransactions(): Transaction[] {
  const now = new Date();
  const currentDayOfMonth = now.getDate();
  const daysInPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();

  return Array.from({ length: 50 }, (_, i) => {
    const seed = i + 42;
    const merchantKey = merchantKeys[Math.floor(seededRandom(seed) * merchantKeys.length)];
    const { category, desc } = merchants[merchantKey];
    const isIncome = category === "Income";
    const isTransfer = category === "Transfer";
    const baseAmount = isIncome
      ? 2500 + seededRandom(seed + 1) * 3000
      : isTransfer
        ? 50 + seededRandom(seed + 1) * 450
        : 5 + seededRandom(seed + 1) * 295;

    let daysAgo: number;
    if (i < 30) {
      // First 30 txns fall within the current month (0 to currentDayOfMonth-1 days ago)
      daysAgo = Math.floor(seededRandom(seed + 2) * Math.max(currentDayOfMonth, 1));
    } else {
      // Remaining 20 txns fall in the previous month
      daysAgo = currentDayOfMonth + Math.floor(seededRandom(seed + 2) * daysInPrevMonth);
    }

    const txDate = new Date(now);
    txDate.setDate(now.getDate() - daysAgo);

    return {
      id: `tx-${String(i + 1).padStart(3, "0")}`,
      accountId: accountIds[Math.floor(seededRandom(seed + 3) * 3)],
      description: desc,
      amount: isIncome ? Math.round(baseAmount * 100) / 100 : -Math.round(baseAmount * 100) / 100,
      date: txDate.toISOString().split("T")[0],
      category,
      status: statuses[Math.floor(seededRandom(seed + 4) * statuses.length)],
      merchant: merchantKey,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const transactionData: Transaction[] = generateTransactions();

// ──────────────────────────── Budgets ────────────────────────────

const budgetLimits: { category: BudgetCategory["category"]; limit: number }[] = [
  { category: "Groceries", limit: 600 },
  { category: "Dining", limit: 300 },
  { category: "Transport", limit: 200 },
  { category: "Shopping", limit: 400 },
  { category: "Utilities", limit: 350 },
  { category: "Entertainment", limit: 150 },
];

function spentByCategory(month: number, year: number): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const tx of transactionData) {
    const d = new Date(tx.date);
    if (d.getMonth() === month && d.getFullYear() === year && tx.amount < 0 && tx.category !== "Transfer") {
      totals[tx.category] = (totals[tx.category] ?? 0) + Math.abs(tx.amount);
    }
  }
  return totals;
}

function generateMonthlyBudgets(): Record<string, BudgetCategory[]> {
  const result: Record<string, BudgetCategory[]> = {};
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const startYear = currentYear - 1;
  const startMonth = currentMonth;

  for (let y = startYear; y <= currentYear; y++) {
    const mStart = y === startYear ? startMonth : 0;
    const mEnd = 11;
    for (let m = mStart; m <= mEnd; m++) {
      const key = `${y}-${m}`;
      const isFuture = y > currentYear || (y === currentYear && m > currentMonth);

      if (isFuture) {
        result[key] = budgetLimits.map(({ category, limit }) => ({ category, limit, spent: 0 }));
        continue;
      }

      const txSpent = spentByCategory(m, y);
      const hasTxData = Object.keys(txSpent).length > 0;

      result[key] = budgetLimits.map(({ category, limit }) => {
        if (hasTxData) {
          return { category, limit, spent: Math.round((txSpent[category] ?? 0) * 100) / 100 };
        }
        const seed = y * 1200 + m * 100 + limit;
        const ratio = 0.55 + seededRandom(seed) * 0.5;
        return { category, limit, spent: Math.round(limit * ratio) };
      });
    }
  }
  return result;
}

export const budgetsByMonth = generateMonthlyBudgets();
export const budgetData: BudgetCategory[] = budgetsByMonth[`${new Date().getFullYear()}-${new Date().getMonth()}`] ?? [];

// ──────────────────────── Spending Summary (last 30 days) ────────────────────────

function spentLast30Days(): Record<string, number> {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 30);
  const totals: Record<string, number> = {};
  for (const tx of transactionData) {
    const d = new Date(tx.date);
    if (d >= cutoff && d <= now && tx.amount < 0 && tx.category !== "Transfer") {
      totals[tx.category] = (totals[tx.category] ?? 0) + Math.abs(tx.amount);
    }
  }
  return totals;
}

export const spendingSummary: SpendingSummary[] = (() => {
  const spent = spentLast30Days();
  return budgetLimits.map(({ category }) => ({
    category,
    amount: Math.round((spent[category] ?? 0) * 100) / 100,
  }));
})();

// ──────────────────────── User Settings ────────────────────────

export const userSettings: UserSettings = {
  name: "Shruti Vellanki",
  email: "shruti@lavenderfinance.com",
  phone: "+1 (555) 867-4832",
  currency: "USD",
};
