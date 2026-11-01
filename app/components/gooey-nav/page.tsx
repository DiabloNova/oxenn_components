"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MousePointer2, Moon, Sun } from "lucide-react";
import GooeyNav from "@/components/gooey-nav/GooeyNav";
import styles from "./page.module.css";

const items = [
  { label: "Home", href: "#" },
  { label: "Work", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

export default function GooeyNavPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeItem, setActiveItem] = useState("Home");
  const isLight = theme === "light";

  return (
    <main className={styles.page} data-theme={theme}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          <ArrowLeft size={16} /> Component lab
        </Link>
        <span className={styles.mark}>NAVIGATION / GOOEY INTERACTION</span>
        <a className={styles.source} href="https://reactbits.dev" target="_blank" rel="noreferrer">
          React Bits <ArrowUpRight size={14} />
        </a>
      </header>

      <section className={styles.intro}>
        <span className={styles.kicker}>FLUID NAVIGATION / INTERACTIVE UI</span>
        <h1>Let it <em>flow.</em></h1>
        <p>
          A soft, liquid active state that breaks into particles and reforms
          around the destination you choose. Move across the links to preview
          the hover response, then select an item.
        </p>
      </section>

      <section className={styles.preview} aria-label="Gooey navigation preview">
        <div className={styles.previewMeta}>
          <span className={styles.previewState}>LIVE COMPONENT</span>
          <span className={styles.interactionHint}><MousePointer2 size={13} /> Hover · Select · Explore</span>
          <button
            className={styles.themeButton}
            type="button"
            onClick={() => setTheme((current) => current === "light" ? "dark" : "light")}
            aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
            <span>{isLight ? "Dark theme" : "Light theme"}</span>
          </button>
        </div>
        <div className={styles.stage}>
          <div className={styles.navWrap}>
            <GooeyNav
              items={items}
              initialActiveIndex={0}
              theme={theme}
              size="md"
              frame
              particleCount={15}
              spread={56}
              animationTime={600}
              timeVariance={300}
              gooeyness={0.5}
              wobble={0.5}
              hoverEffect
              ariaLabel="Gooey navigation demo"
              onChange={(_index: number, item: (typeof items)[number]) => setActiveItem(item.label)}
            />
          </div>
          <div className={styles.selection}>
            <span className={styles.selectionDot} />
            <span>ACTIVE DESTINATION</span>
            <strong>{activeItem}</strong>
          </div>
        </div>
      </section>

      <section className={styles.details}>
        <div><span>01 / MOTION</span><p>Particle-based liquid transition between destinations</p></div>
        <div><span>02 / RENDERING</span><p>WebGL2 shader with a clipped CSS fallback</p></div>
        <div><span>03 / ACCESSIBILITY</span><p>Semantic links, visible keyboard focus, reduced-motion support</p></div>
      </section>
      <footer className={styles.bottomNote}>
        <span>GOOEY NAV</span><span>REACT · WEBGL2 · CSS</span>
      </footer>
    </main>
  );
}
