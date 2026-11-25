"use client";

import FinanceBento, { type FinanceBentoData } from "@/components/ui/finance-bento";

const history = Array.from({ length: 36 }, (_, i) => {
  const t = i / 35;
  const date = new Date(Date.UTC(2023, 10 + i, 1)).toISOString();
  return {
    date,
    fiat: 14000 + t * 7000 + Math.sin(i * 0.9) * 900,
    stocks: 12000 + t * 19000 + Math.sin(i * 0.55) * 1600,
    crypto: Math.max(2500, 4000 + t * 12000 + Math.sin(i * 0.8 + 1) * 3200),
  };
});

const data: FinanceBentoData = {
  history,
  payments: [
    { name: "Rent", date: "Nov 1", amount: 1800 },
    { name: "Index fund · auto-buy", date: "Nov 3", amount: 500 },
    { name: "Insurance", date: "Nov 9", amount: 96 },
  ],
  goals: [
    { name: "House deposit", progress: 0.42, target: 60000 },
    { name: "Japan, spring", progress: 0.76, target: 6000 },
  ],
  cashflow: {
    months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    income: [[2.4, 3.6, 5.4, 6.4, 5.0, 3.4], [2, 3, 4.4, 5.2, 4.2, 2.8], [1.6, 2.4, 3.4, 4, 3.3, 2.2]],
    spending: [[1.2, 2.2, 3.8, 4.6, 3.4, 1.8], [1, 1.8, 3, 3.8, 2.8, 1.5], [0.8, 1.4, 2.4, 3, 2.2, 1.2]],
  },
  crypto: [
    { name: "Bitcoin", symbol: "BTC", share: 0.62, change: "+3.1%", ohlc: [] },
    { name: "Ethereum", symbol: "ETH", share: 0.26, change: "−0.8%", ohlc: [] },
    { name: "Solana", symbol: "SOL", share: 0.12, change: "+6.4%", ohlc: [] },
  ],
  stocks: { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], values: [2.1, 1.2, 3.4, 1.9, 4.6] },
};

export default function FinanceBentoDemoPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#08090c", padding: "clamp(14px, 3vw, 36px)" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <FinanceBento data={data} title="Overview" subtitle="Illustrative demo data · Updated today" credit />
      </div>
    </main>
  );
}
