"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ChartLine } from "lucide-react";
import { LineChart02 } from "@/components/charts/LineChart02";
import styles from "./page.module.css";

export default function ChartsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}><ArrowLeft size={15} /> Component lab</Link>
        <span className={styles.mark}><ChartLine size={15} /> DATA VISUALIZATION / 009</span>
        <a className={styles.source} href="https://recharts.org/" target="_blank" rel="noreferrer">
          Recharts docs <ArrowUpRight size={14} />
        </a>
      </header>

      <section className={styles.intro}>
        <span className={styles.kicker}>DATA VISUALIZATION / 009</span>
        <h1>See the shape<br /><em>of change.</em></h1>
        <p>A responsive multi-series area chart with a compact legend, formatted axes, and contextual hover details.</p>
      </section>

      <section className={styles.preview} aria-label="Area chart preview">
        <div className={styles.previewTop}>
          <div>
            <span className={styles.eyebrow}>AUDIENCE OVERVIEW</span>
            <h2>Active users</h2>
          </div>
          <span className={styles.period}>JAN — DEC 2026</span>
        </div>
        <LineChart02 />
        <div className={styles.previewFoot}>
          <span>MONTHLY PERFORMANCE</span>
          <span>HOVER TO INSPECT DATA</span>
        </div>
      </section>

      <section className={styles.details}>
        <div><span>01 / RESPONSIVE</span><p>Scales to its parent container with compact axis labels on smaller screens</p></div>
        <div><span>02 / MULTI-SERIES</span><p>Three data series with a soft area fill and differentiated line treatments</p></div>
        <div><span>03 / TOOLTIP</span><p>Formatted values and date labels provide context on every data point</p></div>
      </section>

      <footer className={styles.bottomNote}><span>AREA CHART / 009</span><span>REACT · RECHARTS · TYPESCRIPT</span></footer>
    </main>
  );
}
