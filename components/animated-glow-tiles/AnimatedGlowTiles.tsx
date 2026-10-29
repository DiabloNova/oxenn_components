"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import styles from "./AnimatedGlowTiles.module.css";

type Tile = {
  id: string;
  label?: string;
  tone: "blue" | "green" | "pink" | "violet" | "olive";
  className: string;
};

const tiles: Tile[] = [
  { id: "engineering", label: "Engineering", tone: "blue", className: styles.engineering },
  { id: "systems", tone: "green", className: styles.systems },
  { id: "creative", tone: "pink", className: styles.creative },
  { id: "intelligence", tone: "violet", className: styles.intelligence },
  { id: "research", tone: "olive", className: styles.research },
];

export default function AnimatedGlowTiles() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [motionPaused, setMotionPaused] = useState(false);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch" || motionPaused) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setTilt({ x: (0.5 - y) * 4.5, y: (x - 0.5) * 5.5 });
  }

  function resetTilt() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <section className={styles.artwork} aria-label="Animated luminous engineering tiles">
      <div className={styles.topline}>
        <a className={styles.brand} href="#artwork" aria-label="Glow tiles artwork home">design<span> / </span>motion</a>
        <div className={styles.topActions}>
          <span className={styles.live}><span /> LIVE MOTION</span>
          <button
            className={styles.motionToggle}
            type="button"
            onClick={() => {
              setMotionPaused((paused) => !paused);
              resetTilt();
            }}
            aria-pressed={motionPaused}
          >
            {motionPaused ? "Resume motion" : "Pause motion"}
          </button>
        </div>
      </div>

      <div className={styles.heading}>
        <p className={styles.kicker}>INTERACTIVE STUDY / 004</p>
        <h1>Light, with a little<br /><em>more dimension.</em></h1>
        <p className={styles.description}>
          Soft-touch geometry, saturated light, and a slow atmospheric drift.
          Move your pointer across the scene to shift the perspective.
        </p>
      </div>

      <div
        id="artwork"
        ref={sceneRef}
        className={styles.scene}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        data-paused={motionPaused}
        style={{ "--tilt-x": `${tilt.x}deg`, "--tilt-y": `${tilt.y}deg` } as CSSProperties}
      >
        <div className={styles.ambientGlow} aria-hidden="true" />
        <div className={styles.sceneGrain} aria-hidden="true" />
        <div className={styles.tileField}>
          {tiles.map((tile) => (
            <article key={tile.id} className={`${styles.tile} ${tile.className}`} data-tone={tile.tone}>
              <div className={styles.tileTopShine} aria-hidden="true" />
              {tile.id === "systems" && (
                <div className={styles.codeTexture} aria-hidden="true">
                  01001 11001<br />11010 00110<br />00101 10110<br />10111 01001
                </div>
              )}
              {tile.label && <span className={styles.tileLabel}>{tile.label}</span>}
            </article>
          ))}
        </div>
        <div className={styles.sceneCaption}>
          <span>FIG. 01</span><span>CHROMATIC MATERIAL / SOFT LIGHT</span><span>MOVE TO EXPLORE ↗</span>
        </div>
      </div>

      <footer className={styles.footer}>
        <span>FORM STUDY <b>—</b> 2026</span>
        <span>CSS MOTION · POINTER PARALLAX · REDUCED MOTION READY</span>
      </footer>
    </section>
  );
}
