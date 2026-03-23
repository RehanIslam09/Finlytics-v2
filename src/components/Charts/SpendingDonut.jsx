/* ============================================
   FILE: src/components/Charts/SpendingDonut.jsx
   ============================================ */

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import useCurrency from '../../hooks/useCurrency';

const COLORS = [
  '#00f5ff',
  '#ff4444',
  '#00ff88',
  '#ffaa00',
  '#8877ff',
  '#ff66cc',
  '#44ffcc',
  '#ff8844',
];

function SpendingDonut() {
  const { transactionsByCategory, totalExpenses } = useFinance();
  const { formatCurrency } = useCurrency();
  const [hovered, setHovered] = useState(null);

  const data = Object.entries(transactionsByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  const hovColor =
    hovered !== null ? COLORS[hovered % COLORS.length] : '#00f5ff';

  return (
    <div
      style={{ display: 'flex', height: '100%', gap: 16, alignItems: 'center' }}
    >
      {/* Donut — left 55% */}
      <div
        style={{
          position: 'relative',
          flex: '0 0 52%',
          height: '100%',
          minHeight: 0,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="50%"
              outerRadius="76%"
              paddingAngle={2}
              strokeWidth={0}
              isAnimationActive
              animationBegin={200}
              animationDuration={900}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  opacity={hovered === null || hovered === i ? 1 : 0.3}
                  style={{
                    filter:
                      hovered === i
                        ? `drop-shadow(0 0 8px ${COLORS[i % COLORS.length]})`
                        : 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center overlay — swaps content on hover, never conflicts with Recharts tooltip */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {hovered !== null ? (
            <>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.57rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: hovColor,
                  opacity: 0.8,
                  marginBottom: 3,
                }}
              >
                {data[hovered]?.name}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: hovColor,
                }}
              >
                {formatCurrency(data[hovered]?.value ?? 0)}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.6rem',
                  color: 'rgba(232,232,240,0.38)',
                  marginTop: 3,
                }}
              >
                {totalExpenses > 0
                  ? `${((data[hovered]?.value / totalExpenses) * 100).toFixed(1)}%`
                  : '—'}
              </span>
            </>
          ) : (
            <>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.57rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(232,232,240,0.35)',
                  marginBottom: 3,
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#e8e8f0',
                }}
              >
                {formatCurrency(totalExpenses)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend — right side */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        {data.map((entry, i) => {
          const pct =
            totalExpenses > 0
              ? ((entry.value / totalExpenses) * 100).toFixed(1)
              : '0';
          const isHov = hovered === i;
          return (
            <div
              key={entry.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '3px 6px',
                borderRadius: 4,
                cursor: 'pointer',
                background: isHov
                  ? `${COLORS[i % COLORS.length]}14`
                  : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: COLORS[i % COLORS.length],
                  boxShadow: isHov
                    ? `0 0 6px ${COLORS[i % COLORS.length]}`
                    : 'none',
                  transition: 'box-shadow 0.15s',
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.64rem',
                  color: isHov ? '#e8e8f0' : 'rgba(232,232,240,0.48)',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s',
                }}
              >
                {entry.name}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.6rem',
                  flexShrink: 0,
                  color: isHov
                    ? COLORS[i % COLORS.length]
                    : 'rgba(232,232,240,0.28)',
                  transition: 'color 0.15s',
                }}
              >
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SpendingDonut;
