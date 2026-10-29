import FloatingBottomNavDemo from "./FloatingBottomNavDemo";
import { ArrowLeft, Check, Command, MousePointer2 } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

export default function FloatingBottomNavPage() {
  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <header className={styles.header}>
        <Link href="/" className={styles.back}><ArrowLeft size={16} /> Component lab</Link>
        <span className={styles.mark}><Command size={15} /> OXENN COMPONENTS</span>
        <span className={styles.status}><Check size={13} /> LIVE INTERACTION</span>
      </header>
      <section className={styles.intro}>
        <span className={styles.kicker}>NAVIGATION / 002</span>
        <h1>Float above<br /><em>the ordinary.</em></h1>
        <p>A tactile bottom dock with a soft glass shell, a confident coral action, and a little motion that makes every tap feel intentional.</p>
      </section>
      <section className={styles.preview} aria-label="Interactive floating bottom navigation preview">
        <div className={styles.previewMeta}><span>INTERACTIVE PREVIEW</span><span><MousePointer2 size={13} /> Select an item · Try the plus</span></div>
        <div className={styles.canvas}>
          <div className={styles.halo} aria-hidden="true" />
          <div className={styles.canvasLabel}>A little space for what matters.</div>
          <div className={styles.canvasSub}>Choose a destination or capture a task without leaving the dock.</div>
        </div>
      </section>
      <div className={styles.bottomNote}><span>GLASS · DEPTH · MOTION</span><span>RESPONSIVE BY DESIGN</span></div>
      <FloatingBottomNavDemo />
    </main>
  );
}
