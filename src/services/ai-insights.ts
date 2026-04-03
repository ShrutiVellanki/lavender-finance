import { Transaction, BudgetCategory, SpendingSummary, Account } from "@/types";

export interface Insight {
  id: string;
  type: "saving" | "warning" | "trend" | "tip";
  title: string;
  body: string;
  metric?: string;
}

function categorizeByMonth(transactions: Transaction[]): Map<string, Transaction[]> {
  const map = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const d = new Date(tx.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(tx);
  }
  return map;
}

function topSpendingCategory(spending: SpendingSummary[]): SpendingSummary | undefined {
  return spending.reduce<SpendingSummary | undefined>(
    (max, s) => (!max || s.amount > max.amount ? s : max),
    undefined,
  );
}

export function generateInsights(
  transactions: Transaction[],
  budgets: BudgetCategory[],
  spending: SpendingSummary[],
  accounts: Record<string, Account>,
  formatCurrency: (v: number) => string,
): Insight[] {
  const insights: Insight[] = [];
  const now = new Date();

  const top = topSpendingCategory(spending);
  if (top) {
    insights.push({
      id: "top-category",
      type: "trend",
      title: "Top spending category",
      body: `${top.category} leads your spending this month at ${formatCurrency(top.amount)}. Consider setting a tighter budget if this trend continues.`,
      metric: formatCurrency(top.amount),
    });
  }

  const overBudget = budgets.filter((b) => b.spent > b.limit);
  if (overBudget.length > 0) {
    const names = overBudget.map((b) => b.category).join(", ");
    const totalOver = overBudget.reduce((s, b) => s + (b.spent - b.limit), 0);
    insights.push({
      id: "over-budget",
      type: "warning",
      title: `${overBudget.length} ${overBudget.length === 1 ? "category" : "categories"} over budget`,
      body: `${names} exceeded ${overBudget.length === 1 ? "its" : "their"} budget by ${formatCurrency(totalOver)} total. Review spending or adjust limits to stay on track.`,
      metric: formatCurrency(totalOver),
    });
  }

  const nearBudget = budgets.filter((b) => b.spent >= b.limit * 0.85 && b.spent <= b.limit);
  if (nearBudget.length > 0) {
    const names = nearBudget.map((b) => `${b.category} (${Math.round((b.spent / b.limit) * 100)}%)`).join(", ");
    insights.push({
      id: "near-budget",
      type: "warning",
      title: "Approaching budget limits",
      body: `${names} — you're close to your cap. Slow down spending or reallocate surplus from under-spent categories.`,
    });
  }

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  if (totalBudget > 0) {
    const utilization = Math.round((totalSpent / totalBudget) * 100);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    const expectedUtil = Math.round((daysPassed / daysInMonth) * 100);

    if (utilization < expectedUtil - 15) {
      insights.push({
        id: "under-spending",
        type: "saving",
        title: "Under budget pace",
        body: `You've used ${utilization}% of your budget with ${Math.round((daysPassed / daysInMonth) * 100)}% of the month gone. At this rate, you could save ${formatCurrency(totalBudget - totalSpent)} this month.`,
        metric: `${utilization}%`,
      });
    } else if (utilization > expectedUtil + 15) {
      insights.push({
        id: "over-spending",
        type: "warning",
        title: "Spending ahead of schedule",
        body: `Budget utilization is at ${utilization}% with ${daysInMonth - daysPassed} days remaining. Consider reducing discretionary spending to finish the month on target.`,
        metric: `${utilization}%`,
      });
    }
  }

  const monthlyMap = categorizeByMonth(transactions);
  const keys = [...monthlyMap.keys()].sort();
  if (keys.length >= 2) {
    const current = monthlyMap.get(keys[keys.length - 1])!;
    const previous = monthlyMap.get(keys[keys.length - 2])!;
    const currentTotal = current.reduce((s, t) => s + (t.amount < 0 ? Math.abs(t.amount) : 0), 0);
    const previousTotal = previous.reduce((s, t) => s + (t.amount < 0 ? Math.abs(t.amount) : 0), 0);

    if (previousTotal > 0) {
      const change = ((currentTotal - previousTotal) / previousTotal) * 100;
      if (Math.abs(change) > 10) {
        insights.push({
          id: "mom-change",
          type: change > 0 ? "warning" : "saving",
          title: `Spending ${change > 0 ? "up" : "down"} month-over-month`,
          body: `Your expenses ${change > 0 ? "increased" : "decreased"} by ${Math.abs(Math.round(change))}% compared to last month (${formatCurrency(previousTotal)} → ${formatCurrency(currentTotal)}).`,
          metric: `${change > 0 ? "+" : ""}${Math.round(change)}%`,
        });
      }
    }
  }

  const incomeTotal = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expenseTotal = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  if (incomeTotal > 0) {
    const savingsRate = Math.round(((incomeTotal - expenseTotal) / incomeTotal) * 100);
    insights.push({
      id: "savings-rate",
      type: savingsRate >= 20 ? "saving" : savingsRate >= 0 ? "tip" : "warning",
      title: "Savings rate",
      body: savingsRate >= 20
        ? `Strong ${savingsRate}% savings rate — you're keeping more than the recommended 20%. Keep it up!`
        : savingsRate >= 0
          ? `Your savings rate is ${savingsRate}%. Financial advisors recommend targeting at least 20% — look for small cuts in discretionary categories.`
          : `You're spending ${Math.abs(savingsRate)}% more than you earn this period. Review recurring charges and non-essential expenses.`,
      metric: `${savingsRate}%`,
    });
  }

  const merchantCounts = new Map<string, { count: number; total: number }>();
  for (const tx of transactions.filter((t) => t.amount < 0)) {
    const entry = merchantCounts.get(tx.merchant) ?? { count: 0, total: 0 };
    entry.count++;
    entry.total += Math.abs(tx.amount);
    merchantCounts.set(tx.merchant, entry);
  }
  const topMerchant = [...merchantCounts.entries()].sort((a, b) => b[1].total - a[1].total)[0];
  if (topMerchant && topMerchant[1].count >= 3) {
    insights.push({
      id: "top-merchant",
      type: "tip",
      title: "Frequent merchant",
      body: `You've made ${topMerchant[1].count} transactions at ${topMerchant[0]} totaling ${formatCurrency(topMerchant[1].total)}. Check if a subscription or loyalty program could save you money.`,
      metric: formatCurrency(topMerchant[1].total),
    });
  }

  return insights.slice(0, 6);
}
