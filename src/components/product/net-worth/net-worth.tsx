import { ChartContainer } from "@/components/chart/chart-container";
import { ChartConfig } from "@/components/chart/config";
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip } from "recharts";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#575279",
  },
} satisfies ChartConfig;

interface NetWorthChartProps {
  totalBalanceByDateArray: { date: string; balance: number }[];
}

// The theme context is useful here because it allows us to change the theme of the chart based on the theme of the app.
const NetWorthChart: React.FC<NetWorthChartProps> = ({
  totalBalanceByDateArray,
}) => {
  return (
    <>
      <h1 className="text-2xl font-semibold">Net Worth</h1>
      <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
        {totalBalanceByDateArray && totalBalanceByDateArray.length > 0 ? (
          <AreaChart data={totalBalanceByDateArray}>
            <defs>
              <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorNetWorth)"
            />
          </AreaChart>
        ) : (
          <h1>No data</h1>
        )}
      </ChartContainer>
    </>
  );
};

export default NetWorthChart;
