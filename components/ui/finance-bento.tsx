"use client";

import * as React from "react";
import "./finance-bento.css";

export interface FinanceBentoData {
  history: { date: string; fiat: number; stocks: number; crypto: number }[];
  payments: { name: string; date: string; amount: number }[];
  goals: { name: string; progress: number; target: number }[];
  cashflow: { months: string[]; income: number[][]; spending: number[][] };
  crypto: { name: string; symbol: string; share: number; change: string; ohlc: number[][] }[];
  stocks: { days: string[]; values: number[] };
}

export interface FinanceBentoProps {
  data: FinanceBentoData;
  title?: string;
  subtitle?: string;
  avatar?: string;
  avatarAlt?: string;
  credit?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

type Period = "1M" | "3M" | "1Y" | "All";
type Currency = "USD" | "EUR";

const money = (value: number, currency: Currency, compact = false) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value * (currency === "EUR" ? 0.92 : 1));

function points(values: number[], width = 600, height = 180) {
  if (!values.length) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values.map((v, i) => {
    const x = values.length === 1 ? width / 2 : (i / (values.length - 1)) * width;
    const y = height - 12 - ((v - min) / span) * (height - 24);
    return `${x},${y}`;
  }).join(" ");
}

export function FinanceBento({
  data,
  title = "Overview",
  subtitle = "",
  avatar,
  avatarAlt = "Profile",
  credit = false,
  className = "",
  style,
}: FinanceBentoProps) {
  const [period, setPeriod] = React.useState<Period>("1Y");
  const [currency, setCurrency] = React.useState<Currency>("USD");

  const history = data.history ?? [];
  const current = history.at(-1);
  const previous = history.at(-2) ?? current;
  const total = current ? current.fiat + current.stocks + current.crypto : 0;
  const priorTotal = previous ? previous.fiat + previous.stocks + previous.crypto : total;
  const change = priorTotal ? ((total - priorTotal) / priorTotal) * 100 : 0;
  const visibleHistory = period === "All" ? history : history.slice(-(period === "1M" ? 2 : period === "3M" ? 4 : 12));
  const allocation = current && total > 0
    ? [
        { name: "Stocks", value: current.stocks, color: "#a9b2ff" },
        { name: "Crypto", value: current.crypto, color: "#ffb37a" },
        { name: "Fiat", value: current.fiat, color: "#ffffff" },
      ]
    : [];
  const income = data.cashflow.income[0] ?? [];
  const spending = data.cashflow.spending[0] ?? [];
  const maxCashflow = Math.max(1, ...income, ...spending);

  return (
    <section className={`finance-bento ${className}`} style={style} aria-label="Personal finance overview">
      <header className="fb-header">
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="fb-controls" aria-label="Dashboard controls">
          <div className="fb-segment" aria-label="History period">
            {(["1M", "3M", "1Y", "All"] as Period[]).map((item) => (
              <button key={item} type="button" aria-pressed={period === item} onClick={() => setPeriod(item)}>{item}</button>
            ))}
          </div>
          <div className="fb-segment" aria-label="Currency">
            {(["USD", "EUR"] as Currency[]).map((item) => (
              <button key={item} type="button" aria-pressed={currency === item} onClick={() => setCurrency(item)}>{item}</button>
            ))}
          </div>
          {avatar && <img className="fb-avatar" src={avatar} alt={avatarAlt} />}
        </div>
      </header>

      <div className="fb-grid">
        <article className="fb-card fb-networth">
          <div className="fb-card-head"><div><span className="fb-eyebrow">TOTAL PORTFOLIO</span><div className="fb-value">{money(total, currency)}</div></div><span className={change >= 0 ? "fb-positive" : "fb-negative"}>{change >= 0 ? "↗" : "↘"} {Math.abs(change).toFixed(1)}%</span></div>
          <div className="fb-legend">{allocation.map((item) => <span key={item.name}><i style={{ background: item.color }} />{item.name}</span>)}</div>
          <svg className="fb-chart" viewBox="0 0 600 180" role="img" aria-label="Portfolio value trend">
            <defs><linearGradient id="fb-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#a9b2ff" stopOpacity=".42"/><stop offset="100%" stopColor="#a9b2ff" stopOpacity="0"/></linearGradient></defs>
            <polyline points={points(visibleHistory.map((h) => h.fiat + h.stocks + h.crypto))} fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points={`0,180 ${points(visibleHistory.map((h) => h.fiat + h.stocks + h.crypto))} 600,180`} fill="url(#fb-area)" />
          </svg>
          <div className="fb-chart-labels"><span>{visibleHistory[0]?.date.slice(0, 7) ?? ""}</span><span>{visibleHistory.at(-1)?.date.slice(0, 7) ?? ""}</span></div>
        </article>

        <article className="fb-card fb-allocation">
          <div className="fb-eyebrow">ASSET ALLOCATION</div>
          <div className="fb-donut" style={{ background: `conic-gradient(${allocation.map((item, i) => `${item.color} ${allocation.slice(0, i).reduce((s, x) => s + x.value / (total || 1) * 100, 0)}% ${allocation.slice(0, i + 1).reduce((s, x) => s + x.value / (total || 1) * 100, 0)}%`).join(", ")})` }}>
            <div><strong>{total ? Math.round(((current?.stocks ?? 0) + (current?.crypto ?? 0)) / total * 100) : 0}%</strong><span>invested</span></div>
          </div>
          <div className="fb-allocation-list">{allocation.map((item) => <div key={item.name}><i style={{ background: item.color }} /><span>{item.name}</span><b>{total ? Math.round(item.value / total * 100) : 0}%</b><strong>{money(item.value, currency, true)}</strong></div>)}</div>
        </article>

        <article className="fb-card fb-kpi fb-kpi-accent"><span className="fb-eyebrow">PORTFOLIO RETURN</span><strong>{change >= 0 ? "+" : ""}{change.toFixed(1)}%</strong><small>Compared with previous period</small></article>
        <article className="fb-card fb-kpi"><span className="fb-eyebrow">FREE CASH</span><strong>{money((current?.fiat ?? 0) * .42, currency, true)}</strong><small>Available balance estimate</small></article>
        <article className="fb-card fb-kpi"><span className="fb-eyebrow">UPCOMING PAYMENTS</span><strong>{money(data.payments.reduce((sum, p) => sum + p.amount, 0), currency, true)}</strong><small>{data.payments.length} scheduled payments</small></article>
        <article className="fb-card fb-kpi"><span className="fb-eyebrow">SAVINGS GOALS</span><strong>{data.goals.length} active</strong><small>{data.goals.filter((g) => g.progress >= 1).length} completed</small></article>

        <article className="fb-card fb-cashflow">
          <div className="fb-card-head"><div><span className="fb-eyebrow">CASH FLOW</span><h2>Income vs spending</h2></div><span className="fb-pill">6 months</span></div>
          <div className="fb-bars">{data.cashflow.months.map((month, i) => <div className="fb-bar-group" key={month}><div className="fb-bar-pair"><i style={{ height: `${(income[i] ?? 0) / maxCashflow * 100}%` }} /><i style={{ height: `${(spending[i] ?? 0) / maxCashflow * 100}%` }} /></div><span>{month}</span></div>)}</div>
          <div className="fb-legend"><span><i className="fb-income" />Income</span><span><i className="fb-spending" />Spending</span></div>
        </article>

        <article className="fb-card fb-list-card">
          <div className="fb-card-head"><div><span className="fb-eyebrow">CRYPTO</span><h2>Digital assets</h2></div><span className="fb-pill">7 days</span></div>
          {data.crypto.map((coin) => <div className="fb-row" key={coin.symbol}><div><b>{coin.name}</b><small>{coin.symbol}</small></div><strong>{Math.round(coin.share * 100)}%</strong><span className={coin.change.startsWith("+") ? "fb-positive" : "fb-negative"}>{coin.change}</span></div>)}
        </article>

        <article className="fb-card fb-list-card">
          <div className="fb-card-head"><div><span className="fb-eyebrow">PAYMENTS & GOALS</span><h2>Upcoming activity</h2></div></div>
          {data.payments.slice(0, 3).map((payment) => <div className="fb-row" key={payment.name}><div><b>{payment.name}</b><small>{payment.date}</small></div><strong>{money(payment.amount, currency)}</strong></div>)}
          {data.goals.slice(0, 2).map((goal) => <div className="fb-goal" key={goal.name}><div><b>{goal.name}</b><span>{Math.round(goal.progress * 100)}%</span></div><div className="fb-progress"><i style={{ width: `${Math.min(100, Math.max(0, goal.progress * 100))}%` }} /></div></div>)}
        </article>
      </div>
      {credit && <div className="fb-credit">Finance overview · Demo data</div>}
    </section>
  );
}

export default FinanceBento;
