import { Transaction, TransactionCategory, TransactionStatus } from "@/types";

export interface NLSearchResult {
  filtered: Transaction[];
  interpretation: string;
}

const CATEGORY_KEYWORDS: Record<string, TransactionCategory> = {
  grocery: "Groceries", groceries: "Groceries", food: "Groceries", supermarket: "Groceries",
  dining: "Dining", restaurant: "Dining", eat: "Dining", lunch: "Dining", dinner: "Dining", coffee: "Dining", cafe: "Dining", breakfast: "Dining",
  transport: "Transport", uber: "Transport", lyft: "Transport", gas: "Transport", fuel: "Transport", taxi: "Transport", transit: "Transport", bus: "Transport", subway: "Transport",
  shopping: "Shopping", amazon: "Shopping", store: "Shopping", retail: "Shopping", clothes: "Shopping", clothing: "Shopping",
  utilities: "Utilities", electric: "Utilities", water: "Utilities", internet: "Utilities", phone: "Utilities", bill: "Utilities", bills: "Utilities",
  income: "Income", salary: "Income", paycheck: "Income", pay: "Income", deposit: "Income",
  transfer: "Transfer", wire: "Transfer", sent: "Transfer",
  entertainment: "Entertainment", movie: "Entertainment", netflix: "Entertainment", spotify: "Entertainment", game: "Entertainment", concert: "Entertainment", music: "Entertainment",
};

const STATUS_KEYWORDS: Record<string, TransactionStatus> = {
  completed: "completed", done: "completed", cleared: "completed", finished: "completed", success: "completed",
  pending: "pending", processing: "pending", waiting: "pending",
  failed: "failed", declined: "failed", rejected: "failed", error: "failed",
};

function parseAmountRange(query: string): { min?: number; max?: number } | null {
  const overMatch = query.match(/(?:over|above|more than|greater than|>)\s*\$?(\d+(?:\.\d{2})?)/i);
  if (overMatch) return { min: parseFloat(overMatch[1]) };

  const underMatch = query.match(/(?:under|below|less than|cheaper than|<)\s*\$?(\d+(?:\.\d{2})?)/i);
  if (underMatch) return { max: parseFloat(underMatch[1]) };

  const betweenMatch = query.match(/(?:between)\s*\$?(\d+(?:\.\d{2})?)\s*(?:and|-)\s*\$?(\d+(?:\.\d{2})?)/i);
  if (betweenMatch) return { min: parseFloat(betweenMatch[1]), max: parseFloat(betweenMatch[2]) };

  const exactMatch = query.match(/(?:exactly|for)\s*\$?(\d+(?:\.\d{2})?)/i);
  if (exactMatch) {
    const v = parseFloat(exactMatch[1]);
    return { min: v - 0.01, max: v + 0.01 };
  }

  return null;
}

function parseDateRange(query: string): { start: Date; end: Date } | null {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (/\btoday\b/i.test(query)) {
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    return { start: today, end };
  }

  if (/\byesterday\b/i.test(query)) {
    const start = new Date(today);
    start.setDate(start.getDate() - 1);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (/\bthis week\b/i.test(query)) {
    const start = new Date(today);
    start.setDate(start.getDate() - start.getDay());
    return { start, end: now };
  }

  if (/\blast week\b/i.test(query)) {
    const end = new Date(today);
    end.setDate(end.getDate() - end.getDay());
    const start = new Date(end);
    start.setDate(start.getDate() - 7);
    return { start, end };
  }

  if (/\bthis month\b/i.test(query)) {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { start, end: now };
  }

  if (/\blast month\b/i.test(query)) {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return { start, end };
  }

  const nDaysMatch = query.match(/(?:last|past)\s+(\d+)\s+days?/i);
  if (nDaysMatch) {
    const days = parseInt(nDaysMatch[1]);
    const start = new Date(today);
    start.setDate(start.getDate() - days);
    return { start, end: now };
  }

  const MONTHS: Record<string, number> = {
    january: 0, jan: 0, february: 1, feb: 1, march: 2, mar: 2,
    april: 3, apr: 3, may: 4, june: 5, jun: 5,
    july: 6, jul: 6, august: 7, aug: 7, september: 8, sep: 8, sept: 8,
    october: 9, oct: 9, november: 10, nov: 10, december: 11, dec: 11,
  };

  const monthMatch = query.match(/\b(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|sept|october|oct|november|nov|december|dec)\b/i);
  if (monthMatch) {
    const monthIdx = MONTHS[monthMatch[1].toLowerCase()];
    if (monthIdx !== undefined) {
      const yearMatch = query.match(/\b(20\d{2})\b/);
      const year = yearMatch ? parseInt(yearMatch[1]) : now.getFullYear();
      const start = new Date(year, monthIdx, 1);
      const end = new Date(year, monthIdx + 1, 0, 23, 59, 59, 999);
      return { start, end };
    }
  }

  return null;
}

export function nlSearch(query: string, transactions: Transaction[]): NLSearchResult {
  if (!query.trim()) return { filtered: transactions, interpretation: "" };

  const lower = query.toLowerCase();
  const parts: string[] = [];
  let result = [...transactions];

  const amountRange = parseAmountRange(lower);
  if (amountRange) {
    result = result.filter((tx) => {
      const abs = Math.abs(tx.amount);
      if (amountRange.min !== undefined && abs < amountRange.min) return false;
      if (amountRange.max !== undefined && abs > amountRange.max) return false;
      return true;
    });
    if (amountRange.min !== undefined && amountRange.max !== undefined)
      parts.push(`amount $${amountRange.min}–$${amountRange.max}`);
    else if (amountRange.min !== undefined)
      parts.push(`amount > $${amountRange.min}`);
    else if (amountRange.max !== undefined)
      parts.push(`amount < $${amountRange.max}`);
  }

  const dateRange = parseDateRange(lower);
  if (dateRange) {
    result = result.filter((tx) => {
      const d = new Date(tx.date);
      return d >= dateRange.start && d <= dateRange.end;
    });
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    parts.push(`${fmt(dateRange.start)} – ${fmt(dateRange.end)}`);
  }

  const words = lower.split(/\s+/);
  let foundCategory: TransactionCategory | null = null;
  let foundStatus: TransactionStatus | null = null;

  for (const word of words) {
    if (!foundCategory && CATEGORY_KEYWORDS[word]) {
      foundCategory = CATEGORY_KEYWORDS[word];
    }
    if (!foundStatus && STATUS_KEYWORDS[word]) {
      foundStatus = STATUS_KEYWORDS[word];
    }
  }

  if (foundCategory) {
    result = result.filter((tx) => tx.category === foundCategory);
    parts.push(`category: ${foundCategory}`);
  }

  if (foundStatus) {
    result = result.filter((tx) => tx.status === foundStatus);
    parts.push(`status: ${foundStatus}`);
  }

  if (/\bexpenses?\b|\bspending\b|\bspent\b|\bcharges?\b|\bpurchases?\b/i.test(lower) && !foundCategory) {
    result = result.filter((tx) => tx.amount < 0);
    parts.push("expenses only");
  } else if (/\bincome\b|\bearnings?\b|\bdeposits?\b|\bcredits?\b|\breceived\b/i.test(lower) && foundCategory !== "Income") {
    result = result.filter((tx) => tx.amount > 0);
    parts.push("income only");
  }

  if (/\blargest\b|\bbiggest\b|\bhighest\b|\btop\b/i.test(lower)) {
    result.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    parts.push("sorted by largest");
  } else if (/\bsmallest\b|\blowest\b|\bcheapest\b/i.test(lower)) {
    result.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
    parts.push("sorted by smallest");
  } else if (/\brecent\b|\blatest\b|\bnewest\b/i.test(lower)) {
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    parts.push("most recent first");
  }

  if (parts.length === 0) {
    const merchantMatch = result.filter((tx) =>
      tx.merchant.toLowerCase().includes(lower) ||
      tx.description.toLowerCase().includes(lower),
    );
    if (merchantMatch.length > 0) {
      result = merchantMatch;
      parts.push(`matching "${query.trim()}"`);
    }
  }

  const interpretation = parts.length > 0
    ? `Showing ${result.length} transaction${result.length !== 1 ? "s" : ""}: ${parts.join(", ")}`
    : "";

  return { filtered: result, interpretation };
}
