import React, { useState, useMemo } from "react";
import { ChartContainer } from "@/components/chart/chart-container";
import { ChartConfig } from "@/components/chart/config";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "@/theme-provider";
import { formatCurrency } from "@/lib/utils";
import { Info, ChevronDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

const TIME_RANGES = [
  { label: "1 month", value: "1m" },
  { label: "3 months", value: "3m" },
  { label: "6 months", value: "6m" },
  { label: "Year to date", value: "ytd" },
  { label: "1 year", value: "1y" },
  { label: "All time", value: "all" },
] as const;

type TimeRange = typeof TIME_RANGES[number]["value"];

const chartConfig = {
  netWorth: {
    label: "Net Worth",
    color: "#575279",
  },
} satisfies ChartConfig;

interface NetWorthChartProps {
  totalBalanceByDateArray: { date: string; balance: number }[];
}

const NetWorthChart: React.FC<NetWorthChartProps> = ({
  totalBalanceByDateArray,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [timeRange, setTimeRange] = useState<TimeRange>("1m");
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);
  
  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case "1m":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3m":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6m":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "ytd":
        startDate.setMonth(0);
        startDate.setDate(1);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
        return totalBalanceByDateArray;
    }
    
    return totalBalanceByDateArray.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= now;
    });
  }, [timeRange, totalBalanceByDateArray]);
  
  // Calculate current net worth and change using filtered data
  const currentNetWorth = filteredData[filteredData.length - 1]?.balance || 0;
  const previousNetWorth = filteredData[filteredData.length - 2]?.balance || 0;
  const netWorthChange = currentNetWorth - previousNetWorth;
  const percentageChange = previousNetWorth !== 0 ? (netWorthChange / Math.abs(previousNetWorth)) * 100 : 0;

  // Chart styling
  const chartColor = isDark ? "#575279" : "#575279";
  const gridColor = isDark ? "#6e6a86" : "#f4ede8";
  const textColor = isDark ? "#faf4ed" : "#4a4458";
  const tooltipBgColor = isDark ? "#1c1c1c" : "#fffaf3";
  const tooltipBorderColor = isDark ? "#2a2a2a" : "#f4ede8";

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentValue = payload[0].value;
      const currentDate = new Date(label);
      
      // Find the previous data point
      const currentIndex = filteredData.findIndex(item => item.date === label);
      const previousValue = currentIndex > 0 ? filteredData[currentIndex - 1].balance : currentValue;
      
      // Calculate change
      const change = currentValue - previousValue;
      const changePercentage = previousValue !== 0 ? ((change / Math.abs(previousValue)) * 100) : 0;
      
      // Format date range (current date - 14 days)
      const previousDate = new Date(currentDate);
      previousDate.setDate(previousDate.getDate() - 14);
      const dateRange = `${previousDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric'
      })} - ${currentDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric'
      })}`;

      return (
        <div className="bg-lavenderDawn-base dark:bg-lavenderMoon-base p-4 rounded-lg border border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow shadow-lg min-w-[280px]">
          <div className="text-lavenderDawn-text/50 dark:text-lavenderMoon-text/50 text-xs mb-2">{dateRange}</div>
          <div className="h-px bg-lavenderDawn-highlightLow dark:bg-lavenderMoon-highlightLow mb-2"></div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-lavenderDawn-text dark:text-lavenderMoon-text text-sm font-medium">
                {formatCurrency(currentValue)}
              </span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10 text-lavenderDawn-iris dark:text-lavenderMoon-iris">
                {change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span className="text-xs font-medium">{formatCurrency(Math.abs(change))} ({changePercentage.toFixed(2)}%)</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <h2 className="text-xs font-medium text-lavenderDawn-text/50 dark:text-lavenderMoon-text/50 tracking-wider uppercase">
              Net Worth
            </h2>
            <div className="group relative">
              <Info className="w-3 h-3 text-lavenderDawn-text/30 dark:text-lavenderMoon-text/30 cursor-help" />
              <div className="fixed ml-2 w-[300px] hidden group-hover:block z-[9999]" style={{ top: 'var(--tooltip-y)', left: 'var(--tooltip-x)' }}>
                <div className="bg-lavenderDawn-base dark:bg-lavenderMoon-base text-lavenderDawn-text/70 dark:text-lavenderMoon-text/70 text-xs p-3 rounded-lg shadow-xl border border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow">
                  This may not show your correct net worth if you haven't added all assets and liabilities.
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-medium tracking-tight text-lavenderDawn-text dark:text-lavenderMoon-text">
              {formatCurrency(currentNetWorth)}
            </span>
            <span className={`text-xs ${netWorthChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {netWorthChange >= 0 ? '↑' : '↓'} {formatCurrency(Math.abs(netWorthChange))} ({percentageChange.toFixed(1)}%)
            </span>
            <span className="text-xs text-lavenderDawn-text/40 dark:text-lavenderMoon-text/40">
              {TIME_RANGES.find(r => r.value === timeRange)?.label} change
            </span>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)}
            className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-xs text-lavenderDawn-text/70 dark:text-lavenderMoon-text/70 bg-lavenderDawn-highlightLow/30 dark:bg-lavenderMoon-highlightLow/30 rounded-md hover:bg-lavenderDawn-highlightLow/50 dark:hover:bg-lavenderMoon-highlightLow/50 transition-colors"
          >
            {TIME_RANGES.find(r => r.value === timeRange)?.label}
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {isTimeRangeOpen && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setIsTimeRangeOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-36 py-1 bg-lavenderDawn-base dark:bg-lavenderMoon-base rounded-md border border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow shadow-lg z-50">
                {TIME_RANGES.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => {
                      setTimeRange(range.value);
                      setIsTimeRangeOpen(false);
                    }}
                    className={`w-full cursor-pointer px-3 py-1.5 text-left text-xs hover:bg-lavenderDawn-highlightLow/30 dark:hover:bg-lavenderMoon-highlightLow/30 transition-colors ${
                      timeRange === range.value 
                        ? 'text-lavenderDawn-text dark:text-lavenderMoon-text bg-lavenderDawn-highlightLow/20 dark:bg-lavenderMoon-highlightLow/20' 
                        : 'text-lavenderDawn-text/70 dark:text-lavenderMoon-text/70'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        {filteredData && filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
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
                tickLine={{ stroke: gridColor }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric'
                  });
                }}
                interval={(() => {
                  const dataLength = filteredData.length;
                  switch (timeRange) {
                    case "1m":
                      return Math.floor(dataLength / 6); // Show ~6 ticks for 1 month
                    case "3m":
                      return Math.floor(dataLength / 8); // Show ~8 ticks for 3 months
                    case "6m":
                      return Math.floor(dataLength / 10); // Show ~10 ticks for 6 months
                    case "ytd":
                    case "1y":
                      return Math.floor(dataLength / 12); // Show ~12 ticks for 1 year
                    case "all":
                      return Math.floor(dataLength / 12); // Show ~12 ticks for all time
                    default:
                      return "preserveStartEnd";
                  }
                })()}
                minTickGap={30}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                stroke={textColor}
                tick={{ fill: textColor }}
                tickLine={{ stroke: gridColor }}
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => {
                  if (value === 0) return '$0';
                  if (Math.abs(value) >= 1000) {
                    return `$${(value / 1000).toFixed(0)}k`;
                  }
                  return formatCurrency(value);
                }}
                padding={{ top: 20 }}
              />
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={gridColor}
                opacity={0.5}
              />
              <Tooltip 
                content={<CustomTooltip />}
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
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-lavenderDawn-text dark:text-lavenderMoon-text">No data available</span>
          </div>
        )}
      </ChartContainer>
    </div>
  );
};

export default NetWorthChart;
