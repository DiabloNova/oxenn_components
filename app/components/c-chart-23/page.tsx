import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Radar } from "lucide-react";
import { Pattern } from "@/components/c-chart-23/Chart23";
import styles from "./page.module.css";

export default function CChart23Page() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          <ArrowLeft size={16} /> Component lab
        </Link>
        <span className={styles.mark}>
          <Radar size={15} /> CHART / REUI
        </span>
        <a
          className={styles.source}
          href="https://reui.io/components/chart/c-chart-23"
          target="_blank"
          rel="noreferrer"
        >
          ReUI reference <ArrowUpRight size={14} />
        </a>
      </header>

      <section className={styles.intro}>
        <span className={styles.kicker}>DATA VISUALIZATION / RADAR</span>
        <h1>
          Map your team’s
          <br />
          <em>strengths.</em>
        </h1>
        <p>
          A responsive radar chart for comparing proficiency across a set of
          skills, with a gradient fill, subtle glow, and focused tooltips.
        </p>
      </section>

      <section className={styles.showcase} aria-label="C Chart 23 preview">
        <div className={styles.previewMeta}>
          <span>LIVE PREVIEW</span>
          <span>RECHARTS · RADAR</span>
        </div>
        <div className={styles.previewBody}>
          <Pattern />
        </div>
      </section>

      <section className={styles.details}>
        <div>
          <span>01 / VISUALIZATION</span>
          <p>Polar axes, radar grid, and a gradient-filled proficiency area</p>
        </div>
        <div>
          <span>02 / FEEDBACK</span>
          <p>Accessible chart layer and contextual values on hover</p>
        </div>
        <div>
          <span>03 / PORTABILITY</span>
          <p>Standalone Recharts implementation without shadcn UI dependencies</p>
        </div>
      </section>

      <footer className={styles.bottomNote}>
        <span>C CHART 23</span>
        <span>REUI · RECHARTS · REACT</span>
      </footer>
    </main>
  );
}
