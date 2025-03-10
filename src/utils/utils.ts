export const accountTypes = {
  credit: "Credit",
  depository: "Bank",
  investment: "Investment",
  loan: "Loan",
  mortgage: "Mortgage",
  vehicle: "Vehicle",
  real_estate: "Real Estate",
  brokerage: "Brokerage",
  other: "Other",
} as any;

export const groupAccountsByType = (accounts: { [key: string]: any }) => {
  return Object.entries(accounts).reduce(
    (acc: any, [key, account]: [string, any]) => {
      const accountType = account.type || "Unknown";
      if (!acc[accountType]) {
        acc[accountType] = [];
      }
      acc[accountType].push({ ...account, number: key });
      return acc;
    },
    {},
  );
};

export const aggregateBalancesByDate = (chartData: {
  [accountNumber: string]: { balance: number; date: string }[];
}) => {
  const groupedData: { [date: string]: number } = {};

  // Group balances by date and sum them
  Object.values(chartData).forEach((accountBalances) => {
    accountBalances.forEach(({ balance, date }) => {
      if (!groupedData[date]) {
        groupedData[date] = 0;
      }
      groupedData[date] += balance;
    });
  });

  // Convert the grouped data into an array format and sort by date
  const sortedData = Object.keys(groupedData)
    .map((date) => ({
      date,
      balance: groupedData[date],
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return sortedData;
};
