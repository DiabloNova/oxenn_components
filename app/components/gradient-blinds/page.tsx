"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Maximize2,
  Minimize2,
  Moon,
  MousePointer2,
  Sun,
  Waves,
} from "lucide-react";
import GradientBlinds from "@/components/gradient-blinds/GradientBlinds";
import styles from "./page.module.css";

type BackgroundTheme = "dark" | "light";

export default function GradientBlindsPage() {
  const [theme, setTheme] = useState<BackgroundTheme>("dark");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isLight = theme === "light";
  const ThemeIcon = isLight ? Moon : Sun;
  const FullscreenIcon = isFullscreen ? Minimize2 : Maximize2;

  useEffect(() => {
    if (!isFullscreen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsFullscreen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isFullscreen]);

  return (
    <main className={`${styles.page} ${isFullscreen ? styles.fullscreenPage : ""}`} data-theme={theme}>
      {!isFullscreen && (
        <>
          <header className={styles.header}>
            <Link href="/" className={styles.back}><ArrowLeft size={16} /> Component lab</Link>
            <span className={styles.mark}><Waves size={15} /> BACKGROUND / 004</span>
            <a className={styles.source} href="https://reactbits.dev/backgrounds/gradient-blinds" target="_blank" rel="noreferrer">
              React Bits docs <ArrowUpRight size={14} />
            </a>
          </header>
          <section className={styles.intro}>
            <span className={styles.kicker}>INTERACTIVE BACKGROUND / 004</span>
            <h1>Light through<br /><em>the blinds.</em></h1>
            <p>
              Satin gradient slats respond to your pointer with a moving spotlight,
              subtle sway, and ripples. Move across the canvas and click to explore.
            </p>
          </section>
        </>
      )}

      <section className={`${styles.preview} ${isFullscreen ? styles.fullscreenPreview : ""}`} aria-label="Interactive GradientBlinds preview">
        <div className={`${styles.previewMeta} ${isFullscreen ? styles.fullscreenMeta : ""}`}>
          <span className={styles.previewState}>{isFullscreen ? "FULLSCREEN PREVIEW" : "LIVE PREVIEW"}</span>
          {!isFullscreen && <span className={styles.interactionHint}><MousePointer2 size={13} /> Move · Click · Explore</span>}
          <div className={styles.previewActions}>
            <button className={styles.iconButton} type="button"
              onClick={() => setTheme(current => current === "dark" ? "light" : "dark")}
              aria-label={isLight ? "Switch to dark background" : "Switch to light background"}>
              <ThemeIcon size={17} /><span>{isLight ? "Dark background" : "Light background"}</span>
            </button>
            <button className={styles.iconButton} type="button"
              onClick={() => setIsFullscreen(current => !current)}
              aria-label={isFullscreen ? "Exit fullscreen preview" : "View fullscreen preview"}>
              <FullscreenIcon size={17} /><span>{isFullscreen ? "Exit fullscreen" : "Fullscreen"}</span>
            </button>
          </div>
        </div>
        <div className={`${styles.canvas} ${isFullscreen ? styles.fullscreenCanvas : ""}`}>
          <GradientBlinds
            gradientColors={["#8b8788", "#215ab6"]}
            angle={20}
            blindCount={16}
            blindMinWidth={60}
            spotlightRadius={0.5}
            shine={0.4}
            relief={0.5}
            glow={0.4}
            sway={0.35}
            hoverTilt={0.6}
            clickEffect="ripple"
            noise={0.28}
            spotlightSoftness={1}
            spotlightOpacity={1}
            shineDirection="left"
            lightColor="#ffffff"
            speed={1}
            perspective={0}
            gradientSpeed={0}
            distortAmount={0}
            mirrorGradient={false}
            mouseDampening={0.15}
            idle="drift"
            intro
            lightMode={isLight}
            style={{ width: "100%", height: "100%" }}
          />
          {!isFullscreen && (
            <div className={styles.canvasOverlay}>
              <span className={styles.pill}><span /> CANVAS ACTIVE</span>
              <h2>{isLight ? "A softer kind of daylight." : "Sculpted by the light."}</h2>
              <p>Move your pointer to guide the spotlight, then click to send a ripple.</p>
            </div>
          )}
        </div>
      </section>

      {!isFullscreen && (
        <>
          <section className={styles.details}>
            <div><span>01 / PALETTE</span><p>Stone grey · deep electric blue</p></div>
            <div><span>02 / INTERACTION</span><p>Pointer spotlight, animated sway, click ripple</p></div>
            <div><span>03 / PERFORMANCE</span><p>WebGL2 rendering, responsive sizing, reduced-motion support</p></div>
          </section>
          <footer className={styles.bottomNote}><span>GRADIENT BLINDS</span><span>REACT · WEBGL2 · CSS</span></footer>
        </>
      )}
    </main>
  );
}
