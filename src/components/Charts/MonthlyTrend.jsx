/* ============================================
   FILE: src/components/Charts/MonthlyTrend.jsx
   ============================================ */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#0d0d14',
        border: '1px solid rgba(0,245,255,0.35)',
        padding: '10px 14px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.72rem',
        borderRadius: 4,
        minWidth: 160,
      }}
    >
      <p
        style={{
          color: 'rgba(232,232,240,0.5)',
          marginBottom: 6,
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </p>
      {payload.map((p) => (
        <p
          key={p.dataKey}
          style={{
            color: p.dataKey === 'income' ? '#00ff88' : '#ff4444',
            marginBottom: 3,
          }}
        >
          {p.dataKey === 'income' ? '▲' : '▼'}&nbsp; ₹
          {Number(p.value).toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  );
};

const CustomLegend = () => (
  <div
    style={{
      display: 'flex',
      gap: 20,
      justifyContent: 'flex-end',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.65rem',
      color: 'rgba(232,232,240,0.45)',
      marginBottom: 8,
    }}
  >
    <span style={{ color: '#00ff88' }}>▲ Income</span>
    <span style={{ color: '#ff4444' }}>▼ Expenses</span>
  </div>
);

function MonthlyTrend() {
  const { monthlyData, budget } = useFinance();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CustomLegend />
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={monthlyData}
            margin={{ top: 4, right: 8, left: -12, bottom: 0 }}
          >
            <CartesianGrid
              stroke="rgba(255,255,255,0.04)"
              strokeDasharray="0"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                fill: 'rgba(232,232,240,0.35)',
              }}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickLine={false}
            />

            <YAxis
              tick={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                fill: 'rgba(232,232,240,0.35)',
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }}
            />

            {budget?.monthlyBudget && (
              <ReferenceLine
                y={budget.monthlyBudget}
                stroke="rgba(255,170,0,0.45)"
                strokeDasharray="4 3"
                label={{
                  value: 'Budget',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  fill: 'rgba(255,170,0,0.55)',
                  position: 'insideTopRight',
                }}
              />
            )}

            <Line
              type="monotone"
              dataKey="income"
              stroke="#00ff88"
              strokeWidth={2}
              dot={{ r: 3, fill: '#00ff88', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#00ff88', strokeWidth: 0 }}
              style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,136,0.7))' }}
              isAnimationActive
              animationDuration={1000}
            />

            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ff4444"
              strokeWidth={2}
              dot={{ r: 3, fill: '#ff4444', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#ff4444', strokeWidth: 0 }}
              style={{ filter: 'drop-shadow(0 0 6px rgba(255,68,68,0.7))' }}
              isAnimationActive
              animationDuration={1000}
              animationBegin={200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MonthlyTrend;
