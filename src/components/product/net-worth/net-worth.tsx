import { ChartContainer } from "@/components/chart/chart-container";
import { ChartConfig } from "@/components/chart/config";
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip } from "recharts";
import { useTheme } from "@/theme-provider";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const chartColor = isDark ? "#c4a7e7" : "#575279";
  const gridColor = isDark ? "#6e6a86" : "#f4ede8";
  const textColor = isDark ? "#faf4ed" : "#4a4458";
  const tooltipBgColor = isDark ? "#635f8e" : "#fffaf3";
  const tooltipBorderColor = isDark ? "#6e6a86" : "#f4ede8";
  const cursorColor = isDark ? "#c4a7e7" : "#575279";

  return (
    <>
      <h1 className="text-xl font-semibold text-slate-600 tracking-tight dark:text-lavenderMoon-text">Accounts</h1>
      <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
        {totalBalanceByDateArray && totalBalanceByDateArray.length > 0 ? (
          <AreaChart data={totalBalanceByDateArray}>
            <defs>
              <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              stroke={textColor}
              tick={{ fill: textColor }}
            />
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={gridColor}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: tooltipBgColor,
                border: `1px solid ${tooltipBorderColor}`,
                borderRadius: "6px",
                color: textColor,
              }}
              cursor={{ stroke: isDark ? "#9893a5" : "#797593", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke={isDark ? "#9893a5" : "#797593"}
              fillOpacity={1}
              fill="url(#colorNetWorth)"
            />
          </AreaChart>
        ) : (
          <h1 className="text-lavenderDawn-text dark:text-lavenderMoon-text">No data</h1>
        )}
      </ChartContainer>
    </>
  );
};

export default NetWorthChart;
