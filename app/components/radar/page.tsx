"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Crosshair,
  Moon,
  Pause,
  Play,
  Radar as RadarIcon,
  Sun,
} from "lucide-react";
import Radar from "@/components/radar/Radar";
import styles from "./page.module.css";

type RadarMode = "sweep" | "pulse";

export default function RadarPage() {
  const [mode, setMode] = useState<RadarMode>("sweep");
  const [paused, setPaused] = useState(false);
  const [lightMode, setLightMode] = useState(false);

  return (
    <main className={styles.page} data-theme={lightMode ? "light" : "dark"}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          <ArrowLeft size={16} /> Component lab
        </Link>
        <span className={styles.mark}>
          <RadarIcon size={15} /> BACKGROUND / 004
        </span>
        <a
          className={styles.source}
          href="https://reactbits.dev/backgrounds/radar"
          target="_blank"
          rel="noreferrer"
        >
          React Bits docs <ArrowUpRight size={14} />
        </a>
      </header>

      <section className={styles.intro}>
        <span className={styles.kicker}>INTERACTIVE BACKGROUND / 004</span>
        <h1>
          Scan the
          <br />
          <em>unknown.</em>
        </h1>
        <p>
          A perspective radar rendered with WebGL2. Watch the sweep reveal
          moving contacts, then move your pointer across the display to create
          a live signal return.
        </p>
      </section>

      <section className={styles.preview} aria-label="Interactive Radar preview">
        <div className={styles.previewMeta}>
          <span className={styles.previewState}>
            <span className={styles.liveDot} /> LIVE RADAR DISPLAY
          </span>
          <div className={styles.actions}>
            <button
              className={styles.control}
              type="button"
              onClick={() => setMode((current) => current === "sweep" ? "pulse" : "sweep")}
              aria-label={mode === "sweep" ? "Switch to pulse mode" : "Switch to sweep mode"}
            >
              <Crosshair size={15} />
              {mode === "sweep" ? "Sweep mode" : "Pulse mode"}
            </button>
            <button
              className={styles.control}
              type="button"
              onClick={() => setPaused((current) => !current)}
              aria-label={paused ? "Resume radar animation" : "Pause radar animation"}
            >
              {paused ? <Play size={15} /> : <Pause size={15} />}
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              className={styles.control}
              type="button"
              onClick={() => setLightMode((current) => !current)}
              aria-label={lightMode ? "Switch to dark display" : "Switch to light display"}
            >
              {lightMode ? <Moon size={15} /> : <Sun size={15} />}
              {lightMode ? "Dark display" : "Light display"}
            </button>
          </div>
        </div>

        <div className={styles.radarStage}>
          <div className={styles.stageGrid} aria-hidden="true" />
          <div className={styles.radarFrame}>
            <Radar
              color="#608268"
              backgroundColor="transparent"
              mode={mode}
              speed={0.55}
              trail={1}
              scale={1.4}
              ringCount={9}
              spokeCount={12}
              targets={16}
              clutter={0.6}
              mouseInteraction
              ticks
              glow={0.8}
              tilt={64}
              centerX={0.5}
              centerY={0.92}
              brightness={1.25}
              gridOpacity={0.45}
              lineWidth={1}
              grain={0.03}
              fade={0.1}
              opacity={1}
              intro
              lightMode={lightMode}
              paused={paused}
            />
          </div>
          <div className={styles.stageCaption}>
            <span>WEBGL2 · REAL-TIME SIGNAL SIMULATION</span>
            <span>MOVE POINTER TO INTERACT</span>
          </div>
        </div>
      </section>

      <section className={styles.details}>
        <div>
          <span>01 / RENDERING</span>
          <p>WebGL2 shaders with multi-pass bloom and adaptive resolution</p>
        </div>
        <div>
          <span>02 / RADAR MODES</span>
          <p>Sweeping rotation or expanding pulse with persistent signal echoes</p>
        </div>
        <div>
          <span>03 / INTERACTION</span>
          <p>Pointer heat response, moving contacts, and reduced-motion support</p>
        </div>
      </section>

      <footer className={styles.bottomNote}>
        <span>RADAR / 004</span>
        <span>REACT · WEBGL2 · CSS</span>
      </footer>
    </main>
  );
}
