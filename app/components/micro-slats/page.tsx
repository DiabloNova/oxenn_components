"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MousePointer2, Pause, Play, Waves } from "lucide-react";
import MicroSlats, { type SwellPreset } from "@/components/micro-slats/MicroSlats";
import styles from "./page.module.css";

const presets: { id: SwellPreset; label: string; description: string }[] = [
  { id: "swell", label: "Swell", description: "Long, calm waves" },
  { id: "tide", label: "Tide", description: "Slow, low-chop water" },
  { id: "storm", label: "Storm", description: "Short, steep crests" },
  { id: "signal", label: "Signal", description: "A flat rhythmic wall" },
];

export default function MicroSlatsPage() {
  const [preset, setPreset] = useState<SwellPreset>("swell");
  const [paused, setPaused] = useState(false);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}><ArrowLeft size={16} /> Component lab</Link>
        <span className={styles.mark}><Waves size={15} /> BACKGROUND / 014</span>
        <a className={styles.source} href="https://vue-bits.dev/r/MicroSlats.json" target="_blank" rel="noreferrer">
          Upstream registry <ArrowUpRight size={14} />
        </a>
      </header>

      <section className={styles.intro}>
        <span className={styles.kicker}>INTERACTIVE WEBGL / 014</span>
        <h1>A sea of<br /><em>small things.</em></h1>
        <p>A field of tiny rounded slats, shaped by layered waves and a real fluid simulation. Move your pointer to stir the surface; click to send a splash through the current.</p>
      </section>

      <section className={styles.stage} aria-label="Interactive MicroSlats preview">
        <div className={styles.stageTop}>
          <span className={styles.live}><i /> LIVE CANVAS</span>
          <span className={styles.hint}><MousePointer2 size={13} /> MOVE · CLICK · EXPLORE</span>
        </div>
        <div className={styles.canvas}>
          <MicroSlats
            preset={preset}
            color="#A855F7"
            glintColor="#ffffff"
            backgroundColor="#120f17"
            slatWidth={10}
            slatHeight={25}
            gap={3}
            roundness={0.75}
            interactive
            cursorStrength={1}
            cursorSize={40}
            swirl={0}
            trail={1.4}
            lean={0}
            intro
            introDuration={1.5}
            paused={paused}
          />
          <div className={styles.canvasCaption}>
            <span>MICRO SLATS / {preset.toUpperCase()}</span>
            <strong>{presets.find((item) => item.id === preset)?.description}</strong>
          </div>
        </div>
        <div className={styles.controls}>
          <div className={styles.presetGroup} aria-label="Wave preset">
            {presets.map((item) => (
              <button key={item.id} type="button" className={preset === item.id ? styles.activePreset : styles.presetButton} onClick={() => {
                  setPreset(item.id);
                }} aria-pressed={preset === item.id}>
                {item.label}
              </button>
            ))}
          </div>
          <button type="button" className={styles.pauseButton} onClick={() => {
            setPaused((value) => !value);
          }} aria-pressed={paused}>
            {paused ? <Play size={15} /> : <Pause size={15} />}{paused ? "Resume" : "Pause"}
          </button>
        </div>
      </section>

      <section className={styles.details}>
        <div><span>01 / PRESETS</span><p>Swell · Tide · Storm · Signal</p></div>
        <div><span>02 / SIMULATION</span><p>OGL fluid solver with cursor splashes and persistent trails</p></div>
        <div><span>03 / PERFORMANCE</span><p>WebGL2, adaptive resolution, offscreen pause and reduced-motion support</p></div>
      </section>
      <footer className={styles.footer}><span>MICRO SLATS</span><span>REACT · TYPESCRIPT · OGL</span></footer>
    </main>
  );
}
