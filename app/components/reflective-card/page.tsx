"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Moon, MousePointer2, Sun } from "lucide-react";
import ReflectiveCard from "@/components/reflective-card/ReflectiveCard";
import styles from "./page.module.css";

export default function ReflectiveCardPage() {
  const [lightMode, setLightMode] = useState(true);
  return (
    <main className={styles.page} data-theme={lightMode ? "light" : "dark"}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}><ArrowLeft size={16} /> Component lab</Link>
        <span className={styles.mark}>MATERIAL / 005</span>
        <a className={styles.source} href="https://reactbits.dev/components/reflective-card" target="_blank" rel="noreferrer">React Bits docs <ArrowUpRight size={14} /></a>
      </header>
      <section className={styles.intro}>
        <span className={styles.kicker}>INTERACTIVE MATERIAL / 005</span>
        <h1>Light becomes<br /><em>identity.</em></h1>
        <p>A real-time reflective identity card rendered with WebGL2. Move your pointer across the surface to tilt the plate, shift its highlights, and reveal its metallic finish.</p>
      </section>
      <section className={styles.preview} aria-label="Reflective card interactive preview">
        <div className={styles.previewMeta}>
          <span>LIVE PREVIEW · WEBGL2</span>
          <span className={styles.hint}><MousePointer2 size={13} /> Move · Tilt · Explore</span>
          <button className={styles.themeButton} type="button" onClick={() => setLightMode(value => !value)} aria-pressed={lightMode}>
            {lightMode ? <Moon size={16} /> : <Sun size={16} />}{lightMode ? "Dark finish" : "Light finish"}
          </button>
        </div>
        <div className={styles.stage}>
          <div className={styles.cardWrap}>
            <ReflectiveCard name="DiabloNova" role="Senior Developer" badge="Verified" status="Active" idLabel="OXENN DIGITAL ID" idValue="OX-8901 2345" theme={lightMode ? "light" : "dark"} width={340} height={460} webcam={false} tint="#ffffff" metalness={1} roughness={0.3} blurStrength={6} shine={1} glare={0.5} grayscale={1} warp={0.6} warpScale={1} bevel={3} tiltStrength={12} radius={24} enableTilt intro />
          </div>
          <span className={styles.stageLabel}><span /> REFLECTIVE SURFACE ACTIVE</span>
        </div>
      </section>
      <section className={styles.details}>
        <div><span>01 / MATERIAL</span><p>Metalness, roughness, tint, bevel, and surface warp controls</p></div>
        <div><span>02 / INTERACTION</span><p>Pointer-driven tilt, responsive glare, and an eased intro animation</p></div>
        <div><span>03 / RENDERING</span><p>WebGL2 reflections with reduced-motion and context-loss handling</p></div>
      </section>
      <footer className={styles.footer}><span>REFLECTIVE CARD</span><span>REACT · WEBGL2 · CSS</span></footer>
    </main>
  );
}
