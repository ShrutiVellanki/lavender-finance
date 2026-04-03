import { useState, useMemo } from "react";
import { Insight } from "@/services/ai-insights";
import { Sparkles, TrendingDown, AlertTriangle, TrendingUp, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/Card";

const ICON_MAP: Record<Insight["type"], React.ReactNode> = {
  saving: <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
  trend: <TrendingDown className="w-4 h-4 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />,
  tip: <Lightbulb className="w-4 h-4 text-lavenderDawn-foam dark:text-lavenderMoon-foam" />,
};

const BG_MAP: Record<Insight["type"], string> = {
  saving: "bg-emerald-500/10 dark:bg-emerald-400/10",
  warning: "bg-amber-500/10 dark:bg-amber-400/10",
  trend: "bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10",
  tip: "bg-lavenderDawn-foam/10 dark:bg-lavenderMoon-foam/10",
};

interface AIInsightsPanelProps {
  insights: Insight[];
}

export function AIInsightsPanel({ insights }: AIInsightsPanelProps) {
  const [expanded, setExpanded] = useState(true);

  const sortedInsights = useMemo(() => {
    const priority: Record<Insight["type"], number> = { warning: 0, trend: 1, saving: 2, tip: 3 };
    return [...insights].sort((a, b) => priority[a.type] - priority[b.type]);
  }, [insights]);

  if (sortedInsights.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-lavenderDawn-iris to-lavenderDawn-foam dark:from-lavenderMoon-iris dark:to-lavenderMoon-foam flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <CardTitle>AI Insights</CardTitle>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10 text-lavenderDawn-iris dark:text-lavenderMoon-iris uppercase tracking-wider">
            Beta
          </span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Collapse insights" : "Expand insights"}
          aria-expanded={expanded}
          className="w-7 h-7 rounded-md flex items-center justify-center text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:text-lavenderDawn-text dark:hover:text-lavenderMoon-text hover:bg-lavenderDawn-highlightLow dark:hover:bg-lavenderMoon-highlightLow transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sortedInsights.map((insight) => (
              <div
                key={insight.id}
                className={`rounded-lg p-3.5 ${BG_MAP[insight.type]} border border-transparent hover:border-lavenderDawn-highlightMed/50 dark:hover:border-lavenderMoon-highlightMed/50 transition-colors`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">{ICON_MAP[insight.type]}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-[13px] font-medium text-lavenderDawn-text dark:text-lavenderMoon-text leading-snug">
                        {insight.title}
                      </h4>
                      {insight.metric && (
                        <span className="text-xs font-semibold tabular-nums text-lavenderDawn-text dark:text-lavenderMoon-text shrink-0">
                          {insight.metric}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed text-lavenderDawn-subtle dark:text-lavenderMoon-subtle">
                      {insight.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
