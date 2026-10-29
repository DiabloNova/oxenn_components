import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, MousePointer2, Waves } from "lucide-react";
import GradientWaves from "@/components/gradient-waves/GradientWaves";
import styles from "./page.module.css";

export default function GradientWavesPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}><ArrowLeft size={16} /> Component lab</Link>
        <span className={styles.mark}><Waves size={15} /> BACKGROUND / 003</span>
        <a className={styles.source} href="https://reactbits.dev/backgrounds/gradient-waves" target="_blank" rel="noreferrer">React Bits docs <ArrowUpRight size={14} /></a>
      </header>
      <section className={styles.intro}>
        <span className={styles.kicker}>INTERACTIVE BACKGROUND / 003</span>
        <h1>Light in<br /><em>motion.</em></h1>
        <p>Silken gradient waves, soft luminous crests, and a responsive surface that shifts with your pointer. Click the canvas to send a swell across the water.</p>
      </section>
      <section className={styles.preview} aria-label="Interactive GradientWaves preview">
        <div className={styles.previewMeta}><span>LIVE PREVIEW</span><span><MousePointer2 size={13} /> Move · Click · Explore</span></div>
        <div className={styles.canvas}>
          <GradientWaves
            horizonColor="#8b5cf6"
            waveColor="#e879f9"
            crestColor="#f5d0fe"
            speed={0.4}
            amplitude={2.5}
            relief={1}
            lightAngle={120}
            mouseInteraction
            swellOnClick
            lightMode
          />
          <div className={styles.canvasOverlay}>
            <span className={styles.pill}><span /> CANVAS ACTIVE</span>
            <h2>Made of softer things.</h2>
            <p>Move your pointer across the waves, then click anywhere to create a swell.</p>
          </div>
        </div>
      </section>
      <section className={styles.details}>
        <div><span>01 / PALETTE</span><p>Violet horizon · fuchsia wave · pearl crest</p></div>
        <div><span>02 / INTERACTION</span><p>Pointer parallax and click-triggered swell</p></div>
        <div><span>03 / PERFORMANCE</span><p>Canvas rendering, responsive sizing, reduced-motion support</p></div>
      </section>
      <footer className={styles.bottomNote}><span>GRADIENT WAVES</span><span>REACT · CANVAS · CSS</span></footer>
    </main>
  );
}
