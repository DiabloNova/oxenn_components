"use client";

import * as React from "react";
import styles from "./finance-bento.module.css";

export interface FinanceBentoData {
  /** Month-end balances by asset class, oldest first; monetary values use the base currency. */
  history: { date: string; fiat: number; stocks: number; crypto: number }[];
  /** Available cash in the base currency. Omit this value to hide the Free Cash KPI. */
  availableCash?: number;
  payments: { name: string; date: string; amount: number }[];
  goals: { name: string; progress: number; target: number }[];
  /** Six months of income and spending, in thousands; first row is the latest year. */
  cashflow: { months: string[]; income: number[][]; spending: number[][] };
  /** Each asset includes its share, numeric 24h percentage change (e.g. 3.1 or -0.8), and daily OHLC candles. */
  crypto: { name: string; symbol: string; share: number; change: number; ohlc: number[][] }[];
  /** Weekly trading volume, in thousands. */
  stocks: { days: string[]; values: number[] };
}

export interface FinanceBentoProps {
  data: FinanceBentoData;
  /** Currency in which all monetary values in data are supplied. Defaults to USD. */
  baseCurrency?: Currency;
  /** Multipliers from baseCurrency to each additional display currency. The base currency is always available at 1. */
  currencyRates?: Partial<Record<Currency, number>>;
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

const COLORS = { fiat: "#ffffff", stocks: "#a9b2ff", crypto: "#ffb37a" };
const PERIODS: Period[] = ["1M", "3M", "1Y", "All"];

function totalOf(item: FinanceBentoData["history"][number]) {
  return item.fiat + item.stocks + item.crypto;
}

function formatMoney(value: number, currency: Currency, compact = false, exchangeRate = 1) {
  const converted = value * exchangeRate;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(converted);
}

function monthSpan(start: string, end: string): number | null {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return null;
  return Math.max(
    0,
    (endDate.getUTCFullYear() - startDate.getUTCFullYear()) * 12
      + endDate.getUTCMonth() - startDate.getUTCMonth(),
  );
}

function formatMonthSpan(months: number) {
  return months + (months === 1 ? " month" : " months");
}

function formatPercentChange(value: number) {
  return Number.isFinite(value) ? (value > 0 ? "+" : "") + value.toFixed(1) + "%" : "—";
}

function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { month: "short", year: "2-digit", timeZone: "UTC" });
}

function pointList(values: number[], width: number, height: number, min?: number, max?: number) {
  if (!values.length) return "";
  const low = min ?? Math.min(...values);
  const high = max ?? Math.max(...values);
  const span = high - low || 1;
  return values.map((value, index) => {
    const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
    const y = height - 12 - ((value - low) / span) * (height - 24);
    return x + "," + y;
  }).join(" ");
}

function stackedAreaPath(
  topValues: number[],
  bottomValues: number[],
  width: number,
  height: number,
  maxValue: number,
) {
  if (!topValues.length) return "";
  const y = (value: number) => height - 12 - (value / (maxValue || 1)) * (height - 24);
  const x = (index: number) => topValues.length === 1 ? width / 2 : (index / (topValues.length - 1)) * width;
  const top = topValues.map((value, index) => [x(index), y(value)] as const);
  const bottom = bottomValues.map((value, index) => [x(index), y(value)] as const).reverse();
  const first = top[0];
  return "M" + top.map((point) => point[0] + "," + point[1]).join(" L")
    + " L" + bottom.map((point) => point[0] + "," + point[1]).join(" L")
    + " L" + first[0] + "," + first[1] + " Z";
}

function cashflowPath(values: number[], index: number, width: number, height: number, max: number) {
  const points = values.map((value, i) => {
    const x = values.length < 2 ? width / 2 : 12 + (i / (values.length - 1)) * (width - 24);
    const y = index === 0
      ? height / 2 - 10 - (value / max) * (height / 2 - 28)
      : height / 2 + 10 + (value / max) * (height / 2 - 28);
    return x + "," + y;
  });
  return points.join(" ");
}

function Sparkline({ values, label }: { values: number[]; label: string }) {
  const rising = values.length > 1 && values[values.length - 1] >= values[0];
  return (
    <svg className={styles.sparkline} viewBox="0 0 100 34" role="img" aria-label={label}>
      <polyline points={pointList(values, 100, 34)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {values.length > 0 && <circle cx={values.length === 1 ? 50 : 100} cy={Number(pointList(values, 100, 34).split(" ").at(-1)?.split(",")[1] ?? 17)} r="2.5" fill={rising ? "#e8ff1f" : "#fff"} />}
    </svg>
  );
}

export function FinanceBento({
  data,
  baseCurrency = "USD",
  currencyRates = {},
  title = "Overview",
  subtitle = "",
  avatar,
  avatarAlt = "Profile",
  credit = true,
  className = "",
  style,
}: FinanceBentoProps) {
  const [period, setPeriod] = React.useState<Period>("1Y");
  const [currency, setCurrency] = React.useState<Currency>(baseCurrency);
  const supportedCurrencies: Currency[] = [
    baseCurrency,
    ...Object.entries(currencyRates)
      .filter(([code, rate]) => code !== baseCurrency && typeof rate === "number" && Number.isFinite(rate) && rate > 0)
      .map(([code]) => code as Currency),
  ];
  const activeCurrency = supportedCurrencies.includes(currency) ? currency : baseCurrency;
  const exchangeRate = activeCurrency === baseCurrency ? 1 : currencyRates[activeCurrency] ?? 1;
  const money = (value: number, compact = false) => formatMoney(value, activeCurrency, compact, exchangeRate);
  const gradientId = React.useId().replace(/:/g, "");
  const hasAvailableCash = typeof data.availableCash === "number" && Number.isFinite(data.availableCash);
  const kpiWithoutCashClass = hasAvailableCash ? "" : styles.kpiNoCash;
  const history = data.history ?? [];
  const current = history[history.length - 1];
  const total = current ? totalOf(current) : 0;
  const periodCount = period === "1M" ? 2 : period === "3M" ? 4 : 13;
  const visibleHistory = period === "All" ? history : history.slice(-periodCount);
  const periodStartTotal = visibleHistory[0] ? totalOf(visibleHistory[0]) : total;
  const periodSpanMonths = visibleHistory.length > 1
    ? monthSpan(visibleHistory[0].date, visibleHistory[visibleHistory.length - 1].date)
    : null;
  const hasComparableHistory = periodSpanMonths !== null && periodSpanMonths > 0 && periodStartTotal !== 0;
  const change = hasComparableHistory ? ((total - periodStartTotal) / periodStartTotal) * 100 : null;
  const selectedMonths = period === "1M" ? 1 : period === "3M" ? 3 : period === "1Y" ? 12 : null;
  const displayedPeriod = period === "All"
    ? "all time"
    : periodSpanMonths === null || periodSpanMonths <= 0
      ? "not enough data"
      : periodSpanMonths === selectedMonths
        ? period
        : formatMonthSpan(periodSpanMonths);
  const returnFoot = period === "All"
    ? (hasComparableHistory ? "Since first record" : "Not enough data to calculate return")
    : (hasComparableHistory ? "Over the last " + displayedPeriod : "Not enough data to calculate return");
  const maxTotal = Math.max(1, ...visibleHistory.map(totalOf));
  const fiatValues = visibleHistory.map((item) => item.fiat);
  const stockValues = visibleHistory.map((item) => item.fiat + item.stocks);
  const totalValues = visibleHistory.map(totalOf);
  const invested = total > 0 ? ((current?.stocks ?? 0) + (current?.crypto ?? 0)) / total : 0;
  const allocation = current && total > 0
    ? [
        { label: "Stocks", value: current.stocks, color: COLORS.stocks },
        { label: "Crypto", value: current.crypto, color: COLORS.crypto },
        { label: "Fiat", value: current.fiat, color: COLORS.fiat },
      ]
    : [];
  const cashflowMonths = data.cashflow?.months ?? [];
  const income = data.cashflow?.income ?? [];
  const spending = data.cashflow?.spending ?? [];
  const cashflowMax = Math.max(1, ...income.flat(), ...spending.flat());
  const latestIncome = income[0] ?? [];
  const latestSpending = spending[0] ?? [];
  const payments = data.payments ?? [];
  const goals = data.goals ?? [];
  const crypto = data.crypto ?? [];
  const stockDays = data.stocks?.days ?? [];
  const stockValuesWeekly = data.stocks?.values ?? [];

  return (
    <section className={[styles.dashboard, className].filter(Boolean).join(" ")} style={style} aria-label="Personal finance dashboard">
      <header className={styles.header}>
        <div className={styles.heading}>
          <h1>{title}<span>{subtitle}</span></h1>
        </div>
        <div className={styles.controls}>
          <div className={styles.segment} role="group" aria-label="History period">
            {PERIODS.map((item) => (
              <button key={item} type="button" aria-pressed={period === item} onClick={() => setPeriod(item)}>{item}</button>
            ))}
          </div>
          <div className={styles.segment} role="group" aria-label="Display currency">
            {supportedCurrencies.map((item) => (
              <button key={item} type="button" aria-pressed={activeCurrency === item} onClick={() => setCurrency(item)}>{item}</button>
            ))}
          </div>
          {avatar ? <img className={styles.avatar} src={avatar} alt={avatarAlt} /> : null}
        </div>
      </header>

      <div className={styles.grid}>
        <article className={[styles.card, styles.netWorth].join(" ")}>
          <div className={styles.cardHead}>
            <div><span className={styles.eyebrow}>NET WORTH</span><div className={styles.heroValue}>{money(total)}</div></div>
            <div className={styles.changeBlock}>
              <strong className={change === null ? undefined : change >= 0 ? styles.positive : styles.negative}>
                {change === null ? "—" : (change >= 0 ? "↗ " : "↘ ") + Math.abs(change).toFixed(1) + "%"}
              </strong>
              <span>{displayedPeriod === "not enough data" ? displayedPeriod : displayedPeriod + " change"}</span>
            </div>
          </div>
          <div className={styles.legend}>
            {allocation.map((item) => <span key={item.label}><i style={{ background: item.color }} />{item.label}</span>)}
          </div>
          <svg className={styles.netChart} viewBox="0 0 760 220" preserveAspectRatio="none" role="img" aria-label="Stacked net worth history">
            <defs>
              <linearGradient id={gradientId + "fiat"} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".72" /><stop offset="1" stopColor="#fff" stopOpacity=".05" /></linearGradient>
              <linearGradient id={gradientId + "stocks"} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={COLORS.stocks} stopOpacity=".9" /><stop offset="1" stopColor={COLORS.stocks} stopOpacity=".08" /></linearGradient>
              <linearGradient id={gradientId + "crypto"} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={COLORS.crypto} stopOpacity=".9" /><stop offset="1" stopColor={COLORS.crypto} stopOpacity=".08" /></linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((tick) => <line key={tick} x1="0" x2="760" y1={220 - tick * 196} y2={220 - tick * 196} className={styles.chartGridline} />)}
            <path d={stackedAreaPath(fiatValues, fiatValues.map(() => 0), 760, 220, maxTotal)} fill={"url(#" + gradientId + "fiat)"} />
            <path d={stackedAreaPath(stockValues, fiatValues, 760, 220, maxTotal)} fill={"url(#" + gradientId + "stocks)"} />
            <path d={stackedAreaPath(totalValues, stockValues, 760, 220, maxTotal)} fill={"url(#" + gradientId + "crypto)"} />
            <polyline points={pointList(totalValues, 760, 220, 0, maxTotal)} fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth="2" />
          </svg>
          <div className={styles.chartLabels}><span>{visibleHistory[0] ? dateLabel(visibleHistory[0].date) : "—"}</span><span>{visibleHistory[visibleHistory.length - 1] ? dateLabel(visibleHistory[visibleHistory.length - 1].date) : "—"}</span></div>
        </article>

        <article className={[styles.card, styles.allocation].join(" ")}>
          <div className={styles.cardHead}><h2>Allocation</h2><span className={styles.pill}>Target 60/40</span></div>
          <div className={styles.gaugeWrap}>
            <svg viewBox="0 0 300 170" role="img" aria-label={Math.round(invested * 100) + " percent invested"}>
              {Array.from({ length: 49 }, (_, index) => {
                const angle = 180 + (index / 48) * 180;
                const radians = angle * Math.PI / 180;
                const inner = 112;
                const outer = 132;
                const x1 = 150 + Math.cos(radians) * inner;
                const y1 = 150 + Math.sin(radians) * inner;
                const x2 = 150 + Math.cos(radians) * outer;
                const y2 = 150 + Math.sin(radians) * outer;
                const active = index / 48 <= invested;
                return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={active ? (index / 48 <= (allocation[0]?.value ?? 0) / (total || 1) ? COLORS.stocks : COLORS.crypto) : "#ffffff38"} strokeWidth="3" strokeLinecap="round" />;
              })}
              <text x="150" y="105" textAnchor="middle" className={styles.gaugeValue}>{Math.round(invested * 100)}%</text>
              <text x="150" y="128" textAnchor="middle" className={styles.gaugeLabel}>invested</text>
            </svg>
          </div>
          <div className={styles.allocationList}>
            {allocation.map((item) => <div key={item.label}><i style={{ background: item.color }} /><span>{item.label}</span><b>{Math.round((item.value / (total || 1)) * 100)}%</b><strong>{money(item.value, true)}</strong></div>)}
          </div>
        </article>

        <article className={[styles.card, styles.kpi, styles.returnCard, kpiWithoutCashClass].filter(Boolean).join(" ")}>
          <span className={styles.eyebrow}>PORTFOLIO RETURN</span>
          <strong className={styles.kpiValue}>{change === null ? "—" : (change >= 0 ? "+" : "") + change.toFixed(1) + "%"}</strong>
          <span className={styles.kpiFoot}>{returnFoot}</span>
        </article>
        {hasAvailableCash && (
          <article className={[styles.card, styles.kpi, styles.glassCard, kpiWithoutCashClass].filter(Boolean).join(" ")}>
            <span className={styles.eyebrow}>FREE CASH</span>
            <strong className={styles.kpiValue}>{money(data.availableCash, true)}</strong>
            <span className={styles.kpiFoot}>Available balance</span>
          </article>
        )}
        <article className={[styles.card, styles.kpi, styles.glassCard, kpiWithoutCashClass].filter(Boolean).join(" ")}>
          <span className={styles.eyebrow}>NEXT PAYMENTS</span>
          <strong className={styles.kpiValue}>{money(payments.reduce((sum, item) => sum + item.amount, 0), true)}</strong>
          <span className={styles.kpiFoot}>{payments.length} scheduled payments</span>
        </article>
        <article className={[styles.card, styles.kpi, styles.glassCard, kpiWithoutCashClass].filter(Boolean).join(" ")}>
          <span className={styles.eyebrow}>SAVINGS GOALS</span>
          <strong className={styles.kpiValue}>{goals.length} active</strong>
          <span className={styles.kpiFoot}>{goals.filter((goal) => goal.progress >= 1).length} completed</span>
        </article>

        <article className={[styles.card, styles.cashflow].join(" ")}>
          <div className={styles.cardHead}>
            <div><h2>Cash flow</h2><span className={styles.cardSub}>Income above · spending below</span></div>
            <div className={styles.verticalLegend}><span><i className={styles.incomeDot} />Income</span><span><i className={styles.spendingDot} />Spending</span></div>
          </div>
          <svg className={styles.flowChart} viewBox="0 0 520 220" preserveAspectRatio="none" role="img" aria-label="Income and spending over six months">
            <line x1="12" x2="508" y1="110" y2="110" className={styles.chartGridline} />
            {income.slice(0, 3).map((series, index) => <polyline key={"i" + index} points={cashflowPath(series, 0, 520, 220, cashflowMax)} fill="none" stroke="#fff" strokeOpacity={[1, 0.48, 0.25][index]} strokeWidth={index === 0 ? 2.5 : 1.6} strokeLinecap="round" strokeLinejoin="round" />)}
            {spending.slice(0, 3).map((series, index) => <polyline key={"s" + index} points={cashflowPath(series, 1, 520, 220, cashflowMax)} fill="none" stroke="#ffd0e6" strokeOpacity={[1, 0.48, 0.25][index]} strokeWidth={index === 0 ? 2.5 : 1.6} strokeLinecap="round" strokeLinejoin="round" />)}
          </svg>
          <div className={styles.monthLabels}>{cashflowMonths.map((month) => <span key={month}>{month}</span>)}</div>
          <div className={styles.netCash}>Net {money(latestIncome.reduce((sum, value, index) => sum + (value - (latestSpending[index] ?? 0)), 0) * 1000 / Math.max(1, latestIncome.length), true)} / month</div>
        </article>

        <article className={[styles.card, styles.cryptoCard].join(" ")}>
          <div className={styles.cardHead}><h2>Crypto</h2><span className={styles.pill}>7 days</span></div>
          <div className={styles.cryptoTotal}>{money(current?.crypto ?? 0, true)}</div>
          <div className={styles.cryptoBar}>{crypto.map((coin) => <span key={coin.symbol} style={{ width: Math.max(0, coin.share) * 100 + "%" }} />)}</div>
          <div className={styles.cryptoShares}>{crypto.map((coin) => <span key={coin.symbol}>{coin.symbol} {Math.round(coin.share * 100)}%</span>)}</div>
          <div className={styles.cryptoList}>
            {crypto.map((coin) => {
              const closes = (coin.ohlc ?? []).map((candle) => candle[3]).filter((value) => Number.isFinite(value));
              return <div className={styles.cryptoRow} key={coin.symbol}>
                <div className={styles.assetName}><strong>{coin.name}</strong><span>{coin.symbol} · 7d</span></div>
                <Sparkline values={closes} label={coin.name + " seven day price trend"} />
                <div className={styles.assetValue}><strong>{money((current?.crypto ?? 0) * coin.share, true)}</strong><span className={coin.change > 0 ? styles.positive : coin.change < 0 ? styles.negative : undefined}>{formatPercentChange(coin.change)}</span></div>
              </div>;
            })}
          </div>
        </article>

        <article className={[styles.card, styles.stocksCard].join(" ")}>
          <div className={styles.cardHead}><h2>Stocks</h2><span className={styles.pill}>This week</span></div>
          <div className={styles.stocksTotal}>{money(current?.stocks ?? 0, true)}</div>
          <span className={styles.cardSub}>Weekly trading volume</span>
          <div className={styles.stockBars}>
            {stockDays.map((day, index) => {
              const value = stockValuesWeekly[index] ?? 0;
              const max = Math.max(1, ...stockValuesWeekly);
              return <div className={styles.stockBarGroup} key={day}>
                <div className={styles.stockTrack}><i style={{ height: (value / max) * 100 + "%" }} /></div>
                <span>{day}</span>
              </div>;
            })}
          </div>
          <div className={styles.stockNote}>Volume shown in thousands</div>
        </article>

        <article className={[styles.card, styles.paymentsCard].join(" ")}>
          <div className={styles.cardHead}><h2>Next payments</h2><span className={styles.pill}>{payments.length} items</span></div>
          <div className={styles.paymentList}>
            {payments.map((payment, index) => <div className={styles.paymentRow} key={payment.name + payment.date}>
              <span className={styles.paymentIcon}>{payment.name.slice(0, 1).toUpperCase()}</span>
              <span className={styles.paymentName}><strong>{payment.name}</strong><small>{payment.date}</small></span>
              <strong>{money(payment.amount)}</strong>
            </div>)}
            {payments.length === 0 && <p className={styles.empty}>No upcoming payments</p>}
          </div>
        </article>

        <article className={[styles.card, styles.goalsCard, kpiWithoutCashClass].filter(Boolean).join(" ")}>
          <div className={styles.cardHead}><h2>Goals</h2><span className={styles.pill}>{goals.length} active</span></div>
          <div className={styles.goalList}>
            {goals.map((goal) => <div className={styles.goal} key={goal.name}>
              <div><strong>{goal.name}</strong><span>{Math.round(Math.max(0, goal.progress) * 100)}% <small>of {money(goal.target, true)}</small></span></div>
              <div className={styles.progressTrack}><i style={{ width: Math.min(100, Math.max(0, goal.progress * 100)) + "%" }} /></div>
            </div>)}
            {goals.length === 0 && <p className={styles.empty}>No active goals</p>}
          </div>
        </article>
      </div>
      {credit && <div className={styles.credit}>Finance overview <span>·</span> Illustrative demo data</div>}
    </section>
  );
}

export default FinanceBento;
