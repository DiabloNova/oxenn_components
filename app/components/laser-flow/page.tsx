"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import LaserFlow from "@/components/laser-flow/LaserFlow";
import styles from "./page.module.css";

export default function LaserFlowPage() {
  const surfaceRef = useRef(null);
  const [beamPosition, setBeamPosition] = useState(0.62);
  const [intensity, setIntensity] = useState(1.8);
  const [color, setColor] = useState("#3847ff");
  const [paused, setPaused] = useState(false);

  return (
    <main className={styles.page}>
      <div className={styles.frame}>
        <header className={styles.header}>
          <Link href="/" className={styles.back}><ArrowLeft size={16} /> Component lab</Link>
          <span className={styles.mark}><Sparkles size={14} /> LIGHT STUDY / 012</span>
          <a className={styles.source} href="https://reactbits.dev/backgrounds/laser-flow" target="_blank" rel="noreferrer">React Bits <ArrowUpRight size={14} /></a>
        </header>
        <section className={styles.hero}>
          <span className={styles.kicker}>WEBGL2 / INTERACTIVE LIGHT</span>
          <h1>Light that<br /><em>finds its flow.</em></h1>
          <p>A falling beam blooms across a surface, tracing its edges with luminous color. Move your pointer through the scene to shape the lens flare.</p>
        </section>
        <section className={styles.stage} aria-label="Interactive LaserFlow preview">
          <LaserFlow surfaceRef={surfaceRef} beamPosition={beamPosition} color={color} intensity={intensity} flare={1.5} spread={1.45} spill={0.8} fog={0.15} dust={0.7} streaks={1.2} dots={0.8} pulse={1} speed={1.2} seed={3} mouseInteraction intro paused={paused} />
          <div ref={surfaceRef} className={styles.surface}>
            <span className={styles.surfaceLabel}>OXENN / DIGITAL ATELIER</span>
            <strong>Beyond<br />the ordinary.</strong>
            <span className={styles.surfaceFoot}>A surface for light to land on <span>↗</span></span>
          </div>
          <div className={styles.stageNote}>MOVE POINTER <span>·</span> EXPLORE THE LIGHT</div>
        </section>
        <section className={styles.controls} aria-label="LaserFlow controls">
          <div className={styles.controlIntro}><span>01 / TUNE THE BEAM</span><p>Adjust the light source and watch the surface respond in real time.</p></div>
          <label className={styles.control}><span>Beam position <output>{Math.round(beamPosition * 100)}%</output></span><input type="range" min="0.1" max="0.9" step="0.01" value={beamPosition} onChange={(event) => setBeamPosition(Number(event.target.value))} /></label>
          <label className={styles.control}><span>Intensity <output>{intensity.toFixed(1)}</output></span><input type="range" min="0.4" max="3" step="0.1" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} /></label>
          <label className={styles.colorControl}><span>Beam color</span><input aria-label="Beam color" type="color" value={color} onChange={(event) => setColor(event.target.value)} /></label>
          <button className={styles.pause} type="button" onClick={() => setPaused((value) => !value)}>{paused ? "Resume motion" : "Pause motion"}</button>
        </section>
        <section className={styles.details}>
          <div><span>02 / RENDERING</span><p>WebGL2 fragment shader with adaptive resolution and transparent canvas output.</p></div>
          <div><span>03 / INTERACTION</span><p>Pointer-driven lens flare, surface-aware light spill, and an optional image reveal.</p></div>
          <div><span>04 / ACCESSIBILITY</span><p>Animation is reduced when the operating system requests reduced motion.</p></div>
        </section>
        <footer className={styles.footer}><Link href="/">← Back to component lab</Link><span>LASER FLOW / REACT · WEBGL2</span><a href="https://github.com/DiabloNova/oxenn_components" target="_blank" rel="noreferrer">SOURCE <ArrowUpRight size={13} /></a></footer>
      </div>
    </main>
  );
}
