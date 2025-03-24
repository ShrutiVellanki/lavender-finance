export const formatCurrency = (amount: number): string => {
  const isNegative = amount < 0;
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  return isNegative ? `-${formattedAmount}` : formattedAmount;
}; 