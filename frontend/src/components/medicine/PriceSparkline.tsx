import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";

export default function PriceSparkline({ data }: { data: { day: string; price: number }[] }) {
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#01696F" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#01696F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" stroke="#7A7974" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#7A7974" fontSize={11} tickLine={false} axisLine={false} domain={[70, 100]} width={32} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }}
            formatter={(v) => [`₹${v}`, "Price"]}
          />
          <Area type="monotone" dataKey="price" stroke="#01696F" strokeWidth={2.5} fill="url(#trendFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Re-export base imports so tree-shaker keeps them in case unused above
export { LineChart, Line };
