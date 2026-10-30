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
import GradientWaves from "@/components/gradient-waves/GradientWaves";
import styles from "./page.module.css";

type BackgroundTheme = "dark" | "light";

export default function GradientWavesPage() {
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

  const waveSettings = isLight
    ? {
        horizonColor: "#2563eb",
        waveColor: "#38bdf8",
        crestColor: "#e0f2fe",
        speed: 0.5,
        amplitude: 1.8,
        relief: 1,
        lightAngle: 150,
        mouseInteraction: true,
        swellOnClick: true,
        lightMode: true,
        waveScale: 0.9,
        waveRatio: 0.9,
        swell: 25,
        turbulence: 28,
        tilt: 64,
        zoom: 1,
        height: 5.5,
        fogDepth: 15,
        sheen: 0,
        brightness: 1,
        opacity: 1,
        grain: 0.2,
        quality: "medium" as const,
        intro: true,
        parallaxStrength: 0.5,
        mouseStrength: 0.6,
        paused: false,
      }
    : {
        horizonColor: "#8b5cf6",
        waveColor: "#79d3f9",
        crestColor: "#f5d0fe",
        speed: 0.4,
        amplitude: 2.5,
        relief: 1,
        lightAngle: 120,
        mouseInteraction: true,
        swellOnClick: true,
        lightMode: false,
        waveScale: 0.6,
        waveRatio: 0.9,
        swell: 35,
        turbulence: 20,
        tilt: 64,
        zoom: 1,
        height: 5.5,
        fogDepth: 15,
        sheen: 0,
        brightness: 1,
        opacity: 1,
        grain: 0.2,
        quality: "medium" as const,
        intro: true,
        parallaxStrength: 0.5,
        mouseStrength: 0.6,
        paused: false,
      };

  return (
    <main
      className={`${styles.page} ${isFullscreen ? styles.fullscreenPage : ""}`}
      data-theme={theme}
    >
      {!isFullscreen && (
        <>
          <header className={styles.header}>
            <Link href="/" className={styles.back}>
              <ArrowLeft size={16} /> Component lab
            </Link>
            <span className={styles.mark}>
              <Waves size={15} /> BACKGROUND / 003
            </span>
            <a
              className={styles.source}
              href="https://reactbits.dev/backgrounds/gradient-waves"
              target="_blank"
              rel="noreferrer"
            >
              React Bits docs <ArrowUpRight size={14} />
            </a>
          </header>
          <section className={styles.intro}>
            <span className={styles.kicker}>INTERACTIVE BACKGROUND / 003</span>
            <h1>
              Light in
              <br />
              <em>motion.</em>
            </h1>
            <p>
              Silken gradient waves, soft luminous crests, and a responsive
              surface that shifts with your pointer. Click the canvas to send
              a swell across the water.
            </p>
          </section>
        </>
      )}

      <section
        className={`${styles.preview} ${isFullscreen ? styles.fullscreenPreview : ""}`}
        aria-label="Interactive GradientWaves preview"
      >
        <div
          className={`${styles.previewMeta} ${isFullscreen ? styles.fullscreenMeta : ""}`}
        >
          <span className={styles.previewState}>
            {isFullscreen ? "FULLSCREEN PREVIEW" : "LIVE PREVIEW"}
          </span>
          {!isFullscreen && (
            <span className={styles.interactionHint}>
              <MousePointer2 size={13} /> Move · Click · Explore
            </span>
          )}
          <div className={styles.previewActions}>
            <button
              className={styles.iconButton}
              type="button"
              onClick={() =>
                setTheme((current) => (current === "dark" ? "light" : "dark"))
              }
              aria-label={isLight ? "Switch to dark background" : "Switch to light background"}
              title={isLight ? "Switch to dark background" : "Switch to light background"}
            >
              <ThemeIcon size={17} />
              <span>{isLight ? "Dark background" : "Light background"}</span>
            </button>
            <button
              className={styles.iconButton}
              type="button"
              onClick={() => setIsFullscreen((current) => !current)}
              aria-label={isFullscreen ? "Exit fullscreen preview" : "View fullscreen preview"}
              title={isFullscreen ? "Exit fullscreen (Esc)" : "View fullscreen"}
            >
              <FullscreenIcon size={17} />
              <span>{isFullscreen ? "Exit fullscreen" : "Fullscreen"}</span>
            </button>
          </div>
        </div>

        <div className={`${styles.canvas} ${isFullscreen ? styles.fullscreenCanvas : ""}`}>
          <GradientWaves
            {...waveSettings}
            backgroundColor="transparent"
            style={{ width: "100%", height: "100%" }}
          />
          {!isFullscreen && (
            <div className={styles.canvasOverlay}>
              <span className={styles.pill}>
                <span /> CANVAS ACTIVE
              </span>
              <h2>{isLight ? "A brighter kind of motion." : "Made of softer things."}</h2>
              <p>
                Move your pointer across the waves, then click anywhere to
                create a swell.
              </p>
            </div>
          )}
        </div>
      </section>

      {!isFullscreen && (
        <>
          <section className={styles.details}>
            <div>
              <span>01 / PALETTE</span>
              <p>
                {isLight
                  ? "Blue horizon · sky-blue wave · ice-blue crest"
                  : "Violet horizon · sky-blue wave · pearl crest"}
              </p>
            </div>
            <div>
              <span>02 / INTERACTION</span>
              <p>Pointer parallax and click-triggered swell</p>
            </div>
            <div>
              <span>03 / PERFORMANCE</span>
              <p>WebGL2 rendering, responsive sizing, reduced-motion support</p>
            </div>
          </section>
          <footer className={styles.bottomNote}>
            <span>GRADIENT WAVES</span>
            <span>REACT · WEBGL2 · CSS</span>
          </footer>
        </>
      )}
    </main>
  );
}
