"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mountain, MousePointer2, Sun, Moon } from "lucide-react";
import Topography from "@/components/topography/Topography";
import styles from "./page.module.css";

export default function TopographyPage() {
  const [lightMode, setLightMode] = useState(false);
  return (
    <main className={styles.page} data-theme={lightMode ? "light" : "dark"}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}><ArrowLeft size={16} /> Component lab</Link>
        <span className={styles.mark}><Mountain size={15} /> BACKGROUND / 004</span>
        <a className={styles.source} href="https://reactbits.dev/backgrounds/topography" target="_blank" rel="noreferrer">React Bits docs <ArrowUpRight size={14} /></a>
      </header>
      <section className={styles.intro}>
        <span className={styles.kicker}>INTERACTIVE BACKGROUND / 004</span>
        <h1>Contours of<br /><em>discovery.</em></h1>
        <p>A living topographic landscape rendered in WebGL2. Move across the terrain to reveal its contours, then click to send a pulse through the surface.</p>
      </section>
      <section className={styles.preview} aria-label="Interactive Topography preview">
        <div className={styles.previewMeta}>
          <span>LIVE PREVIEW · WEBGL2</span>
          <span className={styles.hint}><MousePointer2 size={13} /> Move · Click · Explore</span>
          <button className={styles.themeButton} type="button" onClick={() => setLightMode(value => !value)} aria-label={lightMode ? "Switch to dark mode" : "Switch to light mode"}>
            {lightMode ? <Moon size={16} /> : <Sun size={16} />}{lightMode ? "Dark terrain" : "Light terrain"}
          </button>
        </div>
        <div className={styles.canvas}>
          <Topography color={lightMode ? "#2563eb" : "#83a7ff"} lineCount={26} lineWidth={1.15} majorLines glow={lightMode ? 0.25 : 0.75} brightness={lightMode ? 0.9 : 1.15} fog={0.28} detail={0.5} elevation={1.1} speed={0.18} morph={0.16} mouseInteraction hoverEffect="lift" clickEffect="pulse" lightMode={lightMode} style={{ width: "100%", height: "100%" }} />
          <div className={styles.canvasLabel}><span /> TERRAIN ACTIVE</div>
        </div>
      </section>
      <section className={styles.details}>
        <div><span>01 / RENDERING</span><p>WebGL2 terrain mesh with luminous contour lines and bloom</p></div>
        <div><span>02 / INTERACTION</span><p>Pointer-driven terrain response and click-triggered pulses</p></div>
        <div><span>03 / ACCESSIBILITY</span><p>Responsive canvas, context recovery, reduced-motion support</p></div>
      </section>
      <footer className={styles.footer}><span>TOPOGRAPHY</span><span>REACT · WEBGL2 · CSS</span></footer>
    </main>
  );
}
