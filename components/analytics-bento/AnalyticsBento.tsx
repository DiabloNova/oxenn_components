"use client";

import * as React from "react";

type Point = { label: string; value: number };
export type AnalyticsBentoProps = React.JSX.IntrinsicElements["div"] & {
  currency?: string;
  revenue: { label: string; value: number; delta: string; note?: React.ReactNode; caption?: string; series: Point[] };
  sessions: { label: string; value: number; delta: string; note?: React.ReactNode; desktop: number[][]; mobile: number[][]; labels?: { desktop: string; mobile: string; prior: string; current: string } };
  categories: {
    title: string;
    groups: { id: string; name: string; color: string; ink?: "dark" | "light" }[];
    periods: { label: string; total: number; delta: string; compare: string }[];
    items: { name: string; group: string; values: number[] }[];
    table?: { columns: string[]; rows: { label: string; values: string[] }[] };
  };
  seasonality: {
    title: string; axis?: string[];
    years: { label: string; values: number[]; stats: { label: string; value: number; delta: string; note: string }[]; rows: { label: string; value: string }[] }[];
  };
  colors?: { revenue?: [string, string]; desktop?: [string, string]; mobile?: [string, string]; radar?: string };
  fontFamily?: string; monoFamily?: string; credit?: boolean;
};

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const DEFAULT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function Metric({ label, value, delta, currency = "" }: { label: string; value: number; delta: string; currency?: string }) {
  return <div><div className="text-sm text-muted-foreground">{label}</div><div className="mt-2 flex flex-wrap items-baseline gap-2 text-3xl font-semibold tabular-nums">{currency}{fmt(value)}<span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">↗ {delta}</span></div></div>;
}
function Panel({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <section className={`min-w-0 overflow-hidden rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6 ${className}`}>{children}</section>;
}
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const points = values.map((v, i) => [i / Math.max(1, values.length - 1) * 100, 42 - (v - Math.min(...values)) / (Math.max(...values) - Math.min(...values) || 1) * 34]);
  const path = points.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  return <svg viewBox="0 0 100 48" preserveAspectRatio="none" className="h-28 w-full overflow-visible" role="img" aria-label="Revenue trend"><path d={path} fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/><path d={`${path} L100,48 L0,48 Z`} fill={color} opacity=".1"/></svg>;
}
function Bars({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(1, ...values);
  return <div className="flex h-32 items-end gap-1.5" role="img" aria-label="Hourly sessions"><div className="flex h-full flex-1 items-end gap-1.5">{values.map((v, i) => <div key={i} title={`${i}:00 · ${fmt(v)}`} className="min-w-0 flex-1 rounded-t-md" style={{ height: `${Math.max(3, v / max * 100)}%`, background: color, opacity: .35 + .65 * (i / Math.max(1, values.length - 1)) }}/>)}</div></div>;
}
export function AnalyticsBento({
  currency = "$", revenue, sessions, categories, seasonality, colors = {},
  fontFamily = "Geist, ui-sans-serif, system-ui, sans-serif",
  monoFamily = "'Geist Mono', ui-monospace, monospace", credit = true, className = "", style, ...rest
}: AnalyticsBentoProps) {
  const [period, setPeriod] = React.useState(0);
  const [year, setYear] = React.useState(0);
  const currentYear = seasonality.years[Math.min(year, seasonality.years.length - 1)];
  const activePeriod = categories.periods[Math.min(period, categories.periods.length - 1)];
  const groupMap = new Map(categories.groups.map(g => [g.id, g]));
  const total = categories.items.reduce((sum, item) => sum + (item.values[period] ?? 0), 0);
  const desktop = sessions.desktop[0] ?? [];
  const mobile = sessions.mobile[0] ?? [];
  const months = seasonality.axis ?? DEFAULT_MONTHS;
  const revColor = colors.revenue?.[1] ?? "var(--ab-rev-b, #12b863)";
  const monoStyle: React.CSSProperties = { fontFamily: monoFamily, fontVariantNumeric: "tabular-nums" };
  return <div className={`ab-root w-full text-foreground ${className}`} style={{ fontFamily, ...style }} {...rest}>
    <div className="grid grid-cols-12 gap-4">
      <Panel className="col-span-12 lg:col-span-5"><div className="flex h-full flex-col justify-between gap-5 sm:flex-row"><div className="shrink-0"><Metric label={revenue.label} value={revenue.value} delta={revenue.delta} currency={currency}/>{revenue.note && <div className="mt-2 text-sm text-muted-foreground">{revenue.note}</div>}{revenue.caption && <div className="mt-3 text-xs text-muted-foreground">{revenue.caption}</div>}</div><div className="min-w-0 flex-1 self-end"><Sparkline values={revenue.series.map(p => p.value)} color={revColor}/><div className="flex justify-between text-xs text-muted-foreground"><span>{revenue.series[0]?.label}</span><span>{revenue.series.at(-1)?.label}</span></div></div></div></Panel>
      <Panel className="col-span-12 lg:col-span-7"><div className="flex h-full flex-col justify-between gap-5 sm:flex-row"><div className="shrink-0"><Metric label={sessions.label} value={sessions.value} delta={sessions.delta}/>{sessions.note && <div className="mt-2 text-sm text-muted-foreground">{sessions.note}</div>}<div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground"><span>● {sessions.labels?.desktop ?? "Desktop"}</span><span>● {sessions.labels?.mobile ?? "Mobile"}</span></div></div><div className="min-w-0 flex-1 space-y-3"><div><div className="mb-1 text-xs text-muted-foreground">{sessions.labels?.desktop ?? "Desktop"}</div><Bars values={desktop} color={colors.desktop?.[1] ?? "#3c2cff"}/></div><div><div className="mb-1 text-xs text-muted-foreground">{sessions.labels?.mobile ?? "Mobile"}</div><Bars values={mobile} color={colors.mobile?.[1] ?? "#FF3DA5"}/></div></div></div></Panel>
      <Panel className="col-span-12 lg:col-span-7"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">{categories.title}</h2><div className="flex flex-wrap gap-3 text-xs text-muted-foreground">{categories.groups.map(g => <span key={g.id} className="inline-flex items-center gap-1.5"><i className="size-2 rounded-sm" style={{ background: g.color }}/>{g.name}</span>)}</div></div><div className="my-5 grid grid-cols-3 gap-2">{categories.periods.map((p, i) => <button key={p.label} type="button" aria-pressed={period === i} onClick={() => setPeriod(i)} className={`rounded-xl p-2 text-left hover:bg-muted ${period === i ? "bg-muted" : ""}`}><span className="text-xs font-semibold">{p.label}</span><div className="mt-1 text-xl font-semibold" style={monoStyle}>{currency}{fmt(p.total)}</div><span className="text-xs text-emerald-600">{p.delta}</span><span className="mt-1 block text-xs text-muted-foreground">{p.compare}</span></button>)}</div><div className="grid min-h-[260px] grid-cols-2 gap-2 sm:grid-cols-3">{categories.items.map(item => { const value = item.values[period] ?? 0; const group = groupMap.get(item.group); return <div key={item.name} className="flex min-h-24 flex-col justify-between rounded-2xl p-3" style={{ background: group?.color ?? "var(--muted)", color: group?.ink === "light" ? "#fff" : group?.ink === "dark" ? "#111" : "var(--foreground)", flexGrow: Math.max(1, value), flexBasis: "28%" }}><span className="text-xs font-semibold">{item.name}</span><strong className="text-xl tabular-nums">{fmt(value)}</strong><span className="text-xs opacity-75">{total ? (value / total * 100).toFixed(1) : "0"}%</span></div>; })}</div>{categories.table && <div className="mt-5 overflow-x-auto"><table className="w-full text-sm"><thead><tr>{categories.table.columns.map((col, i) => <th key={col} className={`border-b border-border pb-2 text-xs text-muted-foreground ${i ? "text-right" : "text-left"}`}>{col}</th>)}</tr></thead><tbody>{categories.table.rows.map(row => <tr key={row.label}><td className="border-b border-border py-2 text-muted-foreground">{row.label}</td>{row.values.map((v, i) => <td key={i} className="border-b border-border py-2 text-right" style={monoStyle}>{v}</td>)}</tr>)}</tbody></table></div>}</Panel>
      <Panel className="col-span-12 lg:col-span-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">{seasonality.title}</h2><div className="inline-flex rounded-xl bg-muted p-1">{seasonality.years.map((y, i) => <button key={y.label} type="button" onClick={() => setYear(i)} aria-pressed={year === i} className={`rounded-lg px-3 py-1.5 text-xs ${year === i ? "bg-background shadow-sm" : "text-muted-foreground"}`}>{y.label}</button>)}</div></div><div className="mx-auto my-5 grid max-w-sm grid-cols-4 gap-2">{currentYear.values.map((v, i) => <div key={i} className="rounded-xl p-2 text-center" style={{ background: `color-mix(in srgb, ${colors.radar ?? "#12b863"} ${Math.max(12, v / Math.max(1, ...currentYear.values) * 75)}%, transparent)` }}><div className="text-xs text-muted-foreground">{months[i] ?? i + 1}</div><div className="mt-1 text-sm font-semibold tabular-nums">{fmt(v)}</div></div>)}</div><div className="grid grid-cols-2 gap-3">{currentYear.stats.map(s => <div key={s.label}><div className="text-xs text-muted-foreground">{s.label}</div><div className="mt-1 text-2xl font-semibold tabular-nums" style={monoStyle}>{currency}{fmt(s.value)}</div><div className="mt-1 text-xs text-emerald-600">↗ {s.delta} <span className="text-muted-foreground">{s.note}</span></div></div>)}</div><div className="mt-4">{currentYear.rows.map(row => <div key={row.label} className="flex justify-between border-t border-border py-2 text-sm"><span className="text-muted-foreground">{row.label}</span><span style={monoStyle}>{row.value}</span></div>)}</div></Panel>
    </div>{credit && <div className="mt-5 text-right text-xs text-muted-foreground">by <a href="https://vasnev.art" target="_blank" rel="noopener noreferrer" className="font-medium underline">vasnev.art ↗</a></div>}
    <style>{`.ab-root{--ab-rev-b:#12b863}.dark .ab-root{--ab-rev-b:#3BF08C}`}</style>
  </div>;
}
export default AnalyticsBento;
