import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ChartDataPoint {
  date: string;
  value: number;
  pnl: number;
}

interface PortfolioChartProps {
  transactions: Array<{
    type: "buy" | "sell";
    totalCost: number;
    date: string;
  }>;
  currentValue: number;
  totalInvested: number;
}

const PERIODS = ["7D", "30D", "All"] as const;

export default function PortfolioChart({ transactions, currentValue, totalInvested }: PortfolioChartProps) {
  const { language } = useLanguage();
  const [period, setPeriod] = useState<typeof PERIODS[number]>("All");
  const en = language === "en";

  const chartData = useMemo(() => {
    if (transactions.length === 0) return [];

    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const now = Date.now();
    const periodMs = period === "7D" ? 7 * 86400000 : period === "30D" ? 30 * 86400000 : now - new Date(sorted[0].date).getTime() + 86400000;
    const startTime = now - periodMs;

    // Build cumulative investment timeline
    const points: ChartDataPoint[] = [];
    let cumInvested = 0;

    sorted.forEach((tx) => {
      const txTime = new Date(tx.date).getTime();
      if (txTime < startTime) {
        cumInvested += tx.type === "buy" ? tx.totalCost : -tx.totalCost;
        return;
      }
      cumInvested += tx.type === "buy" ? tx.totalCost : -tx.totalCost;
      points.push({
        date: new Date(tx.date).toLocaleDateString(),
        value: cumInvested,
        pnl: 0,
      });
    });

    // Add current state
    points.push({
      date: en ? "Now" : "Maintenant",
      value: currentValue,
      pnl: currentValue - totalInvested,
    });

    return points;
  }, [transactions, currentValue, totalInvested, period, en]);

  if (chartData.length < 2) return null;

  const pnl = currentValue - totalInvested;
  const isPositive = pnl >= 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {en ? "Portfolio Evolution" : "Évolution Portfolio"}
        </p>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                period === p ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === "All" ? (en ? "All" : "Tout") : p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? "hsl(145, 65%, 45%)" : "hsl(0, 72%, 55%)"} stopOpacity={0.3} />
                <stop offset="100%" stopColor={isPositive ? "hsl(145, 65%, 45%)" : "hsl(0, 72%, 55%)"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "hsl(215, 12%, 50%)" }}
              interval="preserveStartEnd"
            />
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 11%)",
                border: "1px solid hsl(220, 14%, 18%)",
                borderRadius: "12px",
                fontSize: "11px",
                color: "hsl(210, 20%, 95%)",
              }}
              formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, en ? "Value" : "Valeur"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "hsl(145, 65%, 45%)" : "hsl(0, 72%, 55%)"}
              strokeWidth={2}
              fill="url(#portfolioGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
