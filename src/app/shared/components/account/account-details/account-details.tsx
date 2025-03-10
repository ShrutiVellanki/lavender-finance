import type React from "react"

interface AccountDetailsProps {
  accountType: string
  accountNumber: string
  balance: number
  transactions: Array<{
    date: string
    description: string
    amount: number
  }>
}

export const AccountDetails: React.FC<AccountDetailsProps> = ({
  accountType,
  accountNumber,
  balance,
  transactions,
}) => {
  // const theme = "lavenderDawn";
  return (
    <div className="w-full min-w-4xl space-y-4">
      <div className="justify-between items-center">
        <h3 className={`text-lg font-semibold text-lavenderDawn-text`}>{accountType}</h3>
        <p className={`text-lavenderDawn-muted`}>Account: {accountNumber}</p>
      </div>
      <p className={`text-xl font-bold text-lavenderDawn-pine`}>Balance: ${balance.toFixed(2)}</p>
      <div className={`bg-lavenderDawn-overlay rounded-lg p-4`}>
        <h4 className={`text-md font-semibold mb-2 text-lavenderDawn-text`}>Recent Transactions</h4>
        <ul className="space-y-2">
          {transactions.map((transaction, index) => (
            <li
              key={index}
              className={`flex justify-between items-center text-lavenderDawn-text bg-lavenderDawn-surface rounded-md p-2`}
            >
              <div>
                <p className={`text-sm text-lavenderDawn-muted`}>{transaction.date}</p>
                <p>{transaction.description}</p>
              </div>
              <p className={transaction.amount < 0 ? `text-lavenderDawn-love` : `text-lavenderDawn-pine`}>
                ${Math.abs(transaction.amount).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

