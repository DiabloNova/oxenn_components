import Sidebar from "@/components/sidebar/Sidebar";
import { ArrowUpRight, CircleCheck, Command, Layers3, MoveUpRight } from "lucide-react";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.frame}>
        <header className={styles.topbar}>
          <a className={styles.wordmark} href="#" aria-label="Forme home"><span className={styles.logo}><Command size={17} /></span> forme<span className={styles.dot}>.</span></a>
          <div className={styles.topMeta}><span className={styles.liveDot} /> COMPONENT LAB <span className={styles.version}>v1.0</span></div>
          <a className={styles.github} href="https://github.com/DiabloNova/oxenn_components" target="_blank" rel="noreferrer">View repository <ArrowUpRight size={15}/></a>
        </header>
        <section className={styles.intro}>
          <div className={styles.eyebrow}><span /> NAVIGATION SYSTEM / 001</div>
          <h1>A little less<br/><em>in the way.</em></h1>
          <p>A quiet, considered sidebar that opens into your workspace. Built to feel effortless, down to the last interaction.</p>
          <div className={styles.instructions}><span className={styles.mouseIcon}><MoveUpRight size={15}/></span> Tap the sparkle or arrow to expand the menu</div>
        </section>
        <section className={styles.stage} aria-label="Interactive sidebar demo">
          <div className={styles.stageTop}><span>LIVE PREVIEW</span><span className={styles.stageState}><CircleCheck size={13}/> INTERACTIVE</span></div>
          <div className={styles.demoSurface}>
            <div className={styles.gridPattern} aria-hidden="true" />
            <Sidebar />
            <div className={styles.demoHint}><Layers3 size={17}/><span>Workspace navigation</span></div>
          </div>
          <div className={styles.stageFoot}><span>01 / COLLAPSED BY DEFAULT</span><span>HOVER · CLICK · EXPLORE</span></div>
        </section>
        <footer className={styles.footer}><span>DESIGNED FOR FOCUS.</span><span>Next.js · React · TypeScript <MoveUpRight size={13}/></span></footer>
      </div>
    </main>
  );
}
