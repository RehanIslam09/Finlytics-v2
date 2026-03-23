// ============================================================
// FILE: src/pages/Analytics.jsx
// FIXED: useCurrency destructured + empty state added
// ============================================================

import { useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import {
  format,
  parseISO,
  getDay,
  eachMonthOfInterval,
  subMonths,
} from 'date-fns';
import {
  MdTrendingUp,
  MdTrendingDown,
  MdShowChart,
  MdDonutLarge,
  MdCalendarToday,
  MdRadar,
  MdRestaurant,
  MdDirectionsCar,
  MdHome,
  MdShoppingBag,
  MdMovie,
  MdFitnessCenter,
  MdElectricalServices,
  MdSubscriptions,
  MdAdd,
} from 'react-icons/md';
import { useFinance } from '../context/FinanceContext';
import useCurrency from '../hooks/useCurrency';
import './Analytics.css';

const EMERALD = '#00ff88';
const TEAL = '#00d4aa';
const CYAN = '#00f5ff';
const AMBER = '#ffaa00';
const ROSE = '#ff4466';
const VIOLET = '#8877ff';
const EMERALD_DIM = '#00aa55';

const CATEGORY_CONFIG = {
  Food: { color: '#ff6b35', icon: MdRestaurant },
  Travel: { color: '#00d4ff', icon: MdDirectionsCar },
  Rent: { color: '#8877ff', icon: MdHome },
  Shopping: { color: '#ff2a6d', icon: MdShoppingBag },
  Entertainment: { color: '#bf5af2', icon: MdMovie },
  Health: { color: '#30d158', icon: MdFitnessCenter },
  Utilities: { color: '#ffd60a', icon: MdElectricalServices },
  Subscriptions: { color: '#ff9f0a', icon: MdSubscriptions },
};

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="anx-tooltip">
      <p className="anx-tooltip__label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="anx-tooltip__row" style={{ color: p.color }}>
          <span>{p.name}</span>
          <span>{formatter ? formatter(p.value) : p.value}</span>
        </p>
      ))}
    </div>
  );
}

function SectionHeader({ eyebrow, title, accent }) {
  return (
    <div className="anx-section-header" data-anx-reveal>
      <div
        className="anx-section-bar"
        style={{ background: accent, boxShadow: `0 0 10px ${accent}80` }}
      />
      <div>
        <p className="anx-section-eyebrow" style={{ color: accent }}>
          {eyebrow}
        </p>
        <h2 className="anx-section-title">{title}</h2>
      </div>
    </div>
  );
}

function HeatmapCell({ value, max, day, hour }) {
  const intensity = max > 0 ? value / max : 0;
  const alpha = intensity === 0 ? 0.04 : 0.1 + intensity * 0.85;
  return (
    <div
      className="anx-heatmap-cell"
      style={{
        background: `rgba(0,255,136,${alpha})`,
        borderColor:
          intensity > 0.6
            ? `rgba(0,255,136,${alpha * 0.6})`
            : 'rgba(255,255,255,0.04)',
      }}
      title={`${DAYS_SHORT[day]} ${hour}:00 — ₹${Math.round(value).toLocaleString('en-IN')}`}
    />
  );
}

// ── Empty state ────────────────────────────────────────────
function AnalyticsEmpty() {
  return (
    <motion.div
      className="anx-empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="anx-empty__glyph">◈</div>
      <h2 className="anx-empty__title">No data to analyse yet</h2>
      <p className="anx-empty__sub">
        Add transactions to unlock spending charts, category radar, net worth
        trajectory, and heatmap intelligence.
      </p>
      <Link to="/transactions/new" className="anx-empty__cta">
        <MdAdd size={14} /> Add your first transaction
      </Link>
      <div className="anx-empty__features">
        {[
          'Income vs Expense chart',
          'Net worth trajectory',
          'Category radar',
          'Spending heatmap',
          '6 key insights',
        ].map((f) => (
          <span key={f} className="anx-empty__feature">
            {f}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────
export default function Analytics() {
  const {
    transactions,
    totalIncome,
    totalExpenses,
    netBalance,
    transactionsByCategory,
    monthlyData,
  } = useFinance();

  // ── FIXED: destructure formatCurrency properly ──
  const { formatCurrency } = useCurrency();

  const pageRef = useRef(null);
  const gsapRef = useRef(null);

  // ── Derived data ─────────────────────────────────────────
  const barData = useMemo(() => {
    if (monthlyData?.length) return monthlyData;
    const now = new Date();
    const months = eachMonthOfInterval({ start: subMonths(now, 5), end: now });
    return months.map((m) => {
      const label = format(m, 'MMM');
      const txs = transactions.filter((t) => {
        const d = parseISO(t.date);
        return (
          d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear()
        );
      });
      return {
        month: label,
        income: txs
          .filter((t) => t.type === 'income')
          .reduce((s, t) => s + t.amount, 0),
        expenses: txs
          .filter((t) => t.type === 'expense')
          .reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactions, monthlyData]);

  const areaData = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
    let running = 0;
    const points = sorted.map((t) => {
      running += t.type === 'income' ? t.amount : -t.amount;
      return {
        date: format(parseISO(t.date), 'dd MMM'),
        net: Math.round(running),
      };
    });
    const map = new Map();
    points.forEach((p) => map.set(p.date, p.net));
    return Array.from(map.entries()).map(([date, net]) => ({ date, net }));
  }, [transactions]);

  const radarData = useMemo(() => {
    const total =
      Object.values(transactionsByCategory).reduce((s, v) => s + v, 0) || 1;
    return Object.entries(CATEGORY_CONFIG).map(([name]) => ({
      category: name,
      value: Math.round(((transactionsByCategory[name] || 0) / total) * 100),
      fullMark: 100,
    }));
  }, [transactionsByCategory]);

  const { heatmapGrid, heatmapMax } = useMemo(() => {
    const grid = Array.from({ length: 7 }, () => Array(24).fill(0));
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const d = parseISO(t.date);
        grid[getDay(d)][d.getHours()] += t.amount;
      });
    const max = Math.max(...grid.flat());
    return { heatmapGrid: grid, heatmapMax: max };
  }, [transactions]);

  const topDayIdx = useMemo(() => {
    const totals = heatmapGrid.map((row) => row.reduce((s, v) => s + v, 0));
    return totals.indexOf(Math.max(...totals));
  }, [heatmapGrid]);

  const totalTx = transactions.length;
  const avgTx = totalTx > 0 ? totalExpenses / totalTx : 0;
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const topCatEntry = Object.entries(transactionsByCategory).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const recurringAmt = transactions
    .filter((t) => t.recurring && t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  // ── GSAP ─────────────────────────────────────────────────
  useEffect(() => {
    if (transactions.length === 0) return;
    let ctx;
    const initGsap = async () => {
      if (!window.gsap) {
        await Promise.all([
          new Promise((res) => {
            const s = document.createElement('script');
            s.src =
              'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
            s.onload = res;
            document.head.appendChild(s);
          }),
          new Promise((res) => {
            const s = document.createElement('script');
            s.src =
              'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
            s.onload = res;
            document.head.appendChild(s);
          }),
        ]);
      }
      const { gsap } = window;
      const { ScrollTrigger } = window;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const heroTitle = document.querySelector('.anx-hero__title');
        if (heroTitle) {
          const text = heroTitle.textContent;
          heroTitle.innerHTML = text
            .split('')
            .map((c) =>
              c === ' ' ? ' ' : `<span class="anx-char">${c}</span>`,
            )
            .join('');
          gsap.fromTo(
            '.anx-char',
            { opacity: 0, y: 30, rotateX: -60 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.6,
              stagger: 0.03,
              ease: 'back.out(1.4)',
              delay: 0.2,
            },
          );
        }
        gsap.fromTo(
          '.anx-hero__sub',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, delay: 0.6, ease: 'power3.out' },
        );
        gsap.fromTo(
          '[data-anx-kpi]',
          { opacity: 0, y: 32, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.5,
          },
        );
        document.querySelectorAll('[data-anx-reveal]').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            },
          );
        });
        document.querySelectorAll('[data-anx-chart]').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 50, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            },
          );
          const scan = el.querySelector('.anx-chart-scan');
          if (scan)
            gsap.fromTo(
              scan,
              { left: '-5%', opacity: 0.8 },
              {
                left: '105%',
                opacity: 0,
                duration: 1.2,
                ease: 'power2.inOut',
                delay: 0.4,
                scrollTrigger: {
                  trigger: el,
                  start: 'top 80%',
                  toggleActions: 'play none none none',
                },
              },
            );
        });
        document.querySelectorAll('[data-anx-bar]').forEach((el) => {
          const target = el.dataset.anxBar;
          gsap.fromTo(
            el,
            { width: 0 },
            {
              width: target,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 95%', // ← lower threshold, fires earlier
                toggleActions: 'play none none none',
              },
            },
          );
        });
        gsap.fromTo(
          '.anx-heatmap-cell',
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            stagger: { amount: 1.2, from: 'random' },
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: '.anx-heatmap-grid',
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          },
        );
        gsap.fromTo(
          '[data-anx-insight]',
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.anx-insights-grid',
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          },
        );
      }, pageRef);
    };
    initGsap();
    return () => {
      ctx?.revert();
    };
  }, [transactions]);

  const fmtY = (v) => (v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`);
  const fmtFull = (v) => `₹${Math.round(v).toLocaleString('en-IN')}`;

  // ── Empty state ───────────────────────────────────────────
  if (transactions.length === 0) {
    return (
      <div className="anx-page" ref={pageRef}>
        <div className="anx-scanlines" aria-hidden />
        <div className="anx-content">
          <AnalyticsEmpty />
        </div>
      </div>
    );
  }

  return (
    <div className="anx-page" ref={pageRef}>
      <div className="anx-scanlines" aria-hidden />
      <div className="anx-orb anx-orb--1" />
      <div className="anx-orb anx-orb--2" />
      <div className="anx-orb anx-orb--3" />

      <div className="anx-content">
        {/* Hero */}
        <div className="anx-hero">
          <div className="anx-hero__eyebrow">
            <span className="anx-eyebrow-dot" /> INTELLIGENCE REPORT
          </div>
          <h1 className="anx-hero__title">Financial Analytics</h1>
          <p className="anx-hero__sub">
            Every rupee decoded. Every pattern exposed. Every insight
            actionable.
          </p>
          <div className="anx-hero__strip">
            <div className="anx-strip-item">
              <span className="anx-strip-dot" style={{ background: EMERALD }} />
              <span>LIVE DATA</span>
            </div>
            <div className="anx-strip-sep" />
            <div className="anx-strip-item">
              <span>{totalTx} RECORDS</span>
            </div>
            <div className="anx-strip-sep" />
            <div className="anx-strip-item">
              <span>{format(new Date(), 'MMM yyyy').toUpperCase()}</span>
            </div>
            <div className="anx-strip-sep" />
            <div
              className="anx-strip-item"
              style={{ color: savingsRate >= 0 ? EMERALD : ROSE }}
            >
              <span>
                {savingsRate >= 0 ? '▲' : '▼'}{' '}
                {Math.abs(savingsRate).toFixed(1)}% SAVINGS
              </span>
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="anx-kpi-grid">
          {[
            {
              label: 'Total Income',
              accent: EMERALD,
              icon: MdTrendingUp,
              value: formatCurrency(totalIncome),
              sub: 'All time inflow',
            },
            {
              label: 'Total Expenses',
              accent: ROSE,
              icon: MdTrendingDown,
              value: formatCurrency(totalExpenses),
              sub: 'All time outflow',
            },
            {
              label: 'Net Balance',
              accent: CYAN,
              icon: MdShowChart,
              value: formatCurrency(Math.abs(netBalance)),
              sub: netBalance >= 0 ? 'Surplus' : 'Deficit',
            },
            {
              label: 'Savings Rate',
              accent: TEAL,
              icon: MdDonutLarge,
              value: `${savingsRate.toFixed(1)}%`,
              sub: savingsRate >= 20 ? 'Excellent' : 'Needs work',
            },
            {
              label: 'Avg Transaction',
              accent: AMBER,
              icon: MdCalendarToday,
              value: formatCurrency(avgTx),
              sub: `Over ${totalTx} transactions`,
            },
            {
              label: 'Recurring Cost',
              accent: VIOLET,
              icon: MdRadar,
              value: formatCurrency(recurringAmt),
              sub: 'Fixed monthly outflow',
            },
          ].map((k, i) => (
            <div
              key={k.label}
              className="anx-kpi"
              style={{ '--kpi-accent': k.accent }}
              data-anx-kpi
            >
              <div className="anx-kpi__icon">
                <k.icon size={14} />
              </div>
              <div className="anx-kpi__body">
                <span className="anx-kpi__label">{k.label}</span>
                <span className="anx-kpi__value" style={{ color: k.accent }}>
                  {k.value}
                </span>
                <span className="anx-kpi__sub">{k.sub}</span>
              </div>
              <div className="anx-kpi__bracket" />
            </div>
          ))}
        </div>

        {/* Chart 1 — Bar */}
        <SectionHeader
          eyebrow="01 — TEMPORAL ANALYSIS"
          title="Monthly Income vs Expenses"
          accent={EMERALD}
        />
        <div className="anx-chart-panel" data-anx-chart>
          <div className="anx-chart-scan" />
          <div className="anx-chart-inner anx-chart-inner--tall">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={4} barCategoryGap="28%">
                <defs>
                  <linearGradient id="barIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={EMERALD} stopOpacity={0.9} />
                    <stop
                      offset="100%"
                      stopColor={EMERALD_DIM}
                      stopOpacity={0.5}
                    />
                  </linearGradient>
                  <linearGradient id="barExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ROSE} stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#aa2233" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(255,255,255,0.04)"
                />
                <XAxis
                  dataKey="month"
                  tick={{
                    fill: 'rgba(255,255,255,0.35)',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono,monospace',
                    letterSpacing: 1,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={fmtY}
                  tick={{
                    fill: 'rgba(255,255,255,0.25)',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono,monospace',
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                />
                <Tooltip
                  content={<ChartTooltip formatter={fmtFull} />}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="url(#barIncome)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={44}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="url(#barExpense)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="anx-chart-legend">
            <span className="anx-legend-item">
              <span style={{ background: EMERALD }} /> Income
            </span>
            <span className="anx-legend-item">
              <span style={{ background: ROSE }} /> Expenses
            </span>
          </div>
        </div>

        {/* Chart 2 — Area */}
        <SectionHeader
          eyebrow="02 — WEALTH TRAJECTORY"
          title="Cumulative Net Worth"
          accent={CYAN}
        />
        <div className="anx-chart-panel anx-chart-panel--cyan" data-anx-chart>
          <div
            className="anx-chart-scan"
            style={{
              background: `linear-gradient(90deg,transparent,${CYAN}40,transparent)`,
            }}
          />
          <div className="anx-chart-inner anx-chart-inner--tall">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="areaNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CYAN} stopOpacity={0.35} />
                    <stop offset="60%" stopColor={CYAN} stopOpacity={0.08} />
                    <stop offset="100%" stopColor={CYAN} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(255,255,255,0.04)"
                />
                <XAxis
                  dataKey="date"
                  tick={{
                    fill: 'rgba(255,255,255,0.3)',
                    fontSize: 9,
                    fontFamily: 'JetBrains Mono,monospace',
                  }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickFormatter={fmtY}
                  tick={{
                    fill: 'rgba(255,255,255,0.25)',
                    fontSize: 9,
                    fontFamily: 'JetBrains Mono,monospace',
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                />
                <Tooltip content={<ChartTooltip formatter={fmtFull} />} />
                <ReferenceLine
                  y={0}
                  stroke="rgba(255,255,255,0.12)"
                  strokeDasharray="4 4"
                />
                <Area
                  type="monotone"
                  dataKey="net"
                  name="Net Worth"
                  stroke={CYAN}
                  strokeWidth={2.5}
                  fill="url(#areaNet)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: CYAN,
                    stroke: '#000',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3 + Category — two col */}
        <div className="anx-two-col">
          <div>
            <SectionHeader
              eyebrow="03 — SPENDING BALANCE"
              title="Category Radar"
              accent={VIOLET}
            />
            <div
              className="anx-chart-panel anx-chart-panel--violet"
              data-anx-chart
            >
              <div
                className="anx-chart-scan"
                style={{
                  background: `linear-gradient(90deg,transparent,${VIOLET}40,transparent)`,
                }}
              />
              <div className="anx-chart-inner anx-chart-inner--radar">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={radarData}
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                  >
                    <PolarGrid stroke="rgba(136,119,255,0.15)" />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{
                        fill: 'rgba(255,255,255,0.4)',
                        fontSize: 9,
                        fontFamily: 'JetBrains Mono,monospace',
                      }}
                    />
                    <Radar
                      name="Spending"
                      dataKey="value"
                      stroke={VIOLET}
                      fill={VIOLET}
                      fillOpacity={0.18}
                      strokeWidth={2}
                    />
                    <Tooltip
                      content={<ChartTooltip formatter={(v) => `${v}%`} />}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div>
            <SectionHeader
              eyebrow="04 — CATEGORY INTEL"
              title="Spending Breakdown"
              accent={AMBER}
            />
            <div className="anx-chart-panel" data-anx-chart>
              <div className="anx-cat-breakdown">
                {Object.entries(transactionsByCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, amount]) => {
                    const cfg = CATEGORY_CONFIG[name];
                    const Icon = cfg?.icon || MdRestaurant;
                    const color = cfg?.color || AMBER;
                    const pct =
                      totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                    return (
                      <div key={name} className="anx-cat-row" data-anx-insight>
                        <div
                          className="anx-cat-row__icon"
                          style={{ background: `${color}18`, color }}
                        >
                          <Icon size={13} />
                        </div>
                        <div className="anx-cat-row__body">
                          <div className="anx-cat-row__top">
                            <span className="anx-cat-row__name">{name}</span>
                            <span
                              className="anx-cat-row__amt"
                              style={{ color }}
                            >
                              ₹{Math.round(amount).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="anx-cat-row__track">
                            <div
                              className="anx-cat-row__fill"
                              style={{
                                background: color,
                                boxShadow: `0 0 8px ${color}60`,
                                width: `${pct}%`,
                              }}
                            />
                          </div>
                          <span className="anx-cat-row__pct">
                            {pct.toFixed(1)}% of expenses
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Chart 4 — Heatmap */}
        <SectionHeader
          eyebrow="05 — TEMPORAL HEAT"
          title="Spending Heatmap — Day × Hour"
          accent={EMERALD}
        />
        <div className="anx-chart-panel" data-anx-chart>
          <div className="anx-chart-scan" />
          <div className="anx-heatmap-wrap">
            <div className="anx-heatmap-hour-labels">
              {Array.from({ length: 24 }, (_, h) => (
                <span key={h}>
                  {h === 0
                    ? '12am'
                    : h === 12
                      ? '12pm'
                      : h < 12
                        ? `${h}am`
                        : `${h - 12}pm`}
                </span>
              ))}
            </div>
            <div className="anx-heatmap-rows">
              {heatmapGrid.map((row, dayIdx) => (
                <div key={dayIdx} className="anx-heatmap-row">
                  <span
                    className="anx-heatmap-day-label"
                    style={{
                      color: dayIdx === topDayIdx ? EMERALD : undefined,
                    }}
                  >
                    {DAYS_SHORT[dayIdx]}
                  </span>
                  <div className="anx-heatmap-grid">
                    {row.map((val, hour) => (
                      <HeatmapCell
                        key={hour}
                        value={val}
                        max={heatmapMax}
                        day={dayIdx}
                        hour={hour}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="anx-heatmap-legend">
              <span>Low</span>
              <div className="anx-heatmap-legend-track">
                {[0.05, 0.2, 0.4, 0.6, 0.8, 1].map((a, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      background: `rgba(0,255,136,${a})`,
                      borderRadius:
                        i === 0 ? '4px 0 0 4px' : i === 5 ? '0 4px 4px 0' : '0',
                    }}
                  />
                ))}
              </div>
              <span>High</span>
            </div>
          </div>
          {topDayIdx >= 0 && (
            <p className="anx-heatmap-insight">
              <span style={{ color: EMERALD }}>↑ Peak spending day:</span>&nbsp;
              {DAYS_SHORT[topDayIdx]} — plan ahead or set limits for this day
            </p>
          )}
        </div>

        {/* Insights */}
        <SectionHeader
          eyebrow="06 — KEY INTELLIGENCE"
          title="Top Insights"
          accent={TEAL}
        />
        <div className="anx-insights-grid">
          {[
            {
              accent: EMERALD,
              icon: MdTrendingUp,
              title: 'Best month',
              value:
                barData.reduce(
                  (max, m) =>
                    m.income - m.expenses > max.income - max.expenses ? m : max,
                  barData[0] || {},
                )?.month || '—',
              sub: 'Highest net surplus month',
            },
            {
              accent: ROSE,
              icon: MdTrendingDown,
              title: 'Biggest expense category',
              value: topCatEntry?.[0] || '—',
              sub: topCatEntry
                ? `₹${Math.round(topCatEntry[1]).toLocaleString('en-IN')} total`
                : 'No data',
            },
            {
              accent: CYAN,
              icon: MdShowChart,
              title: 'Net worth trend',
              value:
                areaData.length >= 2 &&
                areaData[areaData.length - 1].net > areaData[0].net
                  ? '↑ Growing'
                  : '↓ Declining',
              sub:
                areaData.length >= 2
                  ? `₹${areaData[0].net.toLocaleString('en-IN')} → ₹${areaData[areaData.length - 1].net.toLocaleString('en-IN')}`
                  : 'Add more transactions',
            },
            {
              accent: VIOLET,
              icon: MdRadar,
              title: 'Most balanced month',
              value:
                barData.reduce(
                  (min, m) =>
                    Math.abs(m.income - m.expenses) <
                    Math.abs(min.income - min.expenses)
                      ? m
                      : min,
                  barData[0] || {},
                )?.month || '—',
              sub: 'Income ≈ expenses',
            },
            {
              accent: AMBER,
              icon: MdCalendarToday,
              title: 'Peak spending day',
              value: topDayIdx >= 0 ? DAYS_SHORT[topDayIdx] : '—',
              sub: 'Most outflow on this day',
            },
            {
              accent: TEAL,
              icon: MdDonutLarge,
              title: 'Recurring burden',
              value:
                totalExpenses > 0
                  ? `${((recurringAmt / totalExpenses) * 100).toFixed(1)}%`
                  : '0%',
              sub: 'Of total expenses are fixed',
            },
          ].map((ins, i) => (
            <div
              key={i}
              className="anx-insight-card"
              style={{ '--ins-accent': ins.accent }}
              data-anx-insight
            >
              <div className="anx-insight-card__icon">
                <ins.icon size={16} />
              </div>
              <p className="anx-insight-card__title">{ins.title}</p>
              <p
                className="anx-insight-card__value"
                style={{ color: ins.accent }}
              >
                {ins.value}
              </p>
              <p className="anx-insight-card__sub">{ins.sub}</p>
              <div
                className="anx-insight-card__glow"
                style={{ background: ins.accent }}
              />
            </div>
          ))}
        </div>
        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
