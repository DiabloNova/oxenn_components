"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Grid3X3, Moon, Sun } from "lucide-react";
import GridMotion from "@/components/grid-motion/GridMotion";
import styles from "./page.module.css";

const items = [
  "https://images.unsplash.com/photo-1705032033999-efa3082e1a4e?w=640&q=75&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1721407964262-f9864b562453?w=640&q=75&auto=format&fit=crop",
  "Motion in every direction",
  <div key="custom" className={styles.tileNote}><span>O / 01</span><strong>Shape<br />the flow.</strong></div>,
  "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=640&q=75&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=640&q=75&auto=format&fit=crop",
  "A moving canvas",
  <div key="custom-two" className={styles.tileNote}><span>O / 02</span><strong>Explore<br />the grid.</strong></div>,
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=640&q=75&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=640&q=75&auto=format&fit=crop",
];

export default function GridMotionPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const isLight = theme === "light";
  const ThemeIcon = isLight ? Moon : Sun;

  return (
    <main className={styles.page} data-theme={theme}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}><ArrowLeft size={16} /> Component lab</Link>
        <span className={styles.mark}><Grid3X3 size={15} /> BACKGROUND / 005</span>
        <a className={styles.source} href="https://reactbits.dev/backgrounds/grid-motion" target="_blank" rel="noreferrer">
          React Bits docs <ArrowUpRight size={14} />
        </a>
      </header>

      <section className={styles.intro}>
        <span className={styles.kicker}>INTERACTIVE BACKGROUND / 005</span>
        <h1>A grid in<br /><em>perpetual motion.</em></h1>
        <p>
          A layered field of images, words, and custom content. Move your pointer
          to guide the spotlight and reveal the details moving beneath the surface.
        </p>
      </section>

      <section className={styles.showcase} aria-label="Interactive Grid Motion preview">
        <div className={styles.showcaseTop}>
          <div><span className={styles.eyebrow}>LIVE PREVIEW</span><h2>OXENN / VISUAL PLAYGROUND</h2></div>
          <button className={styles.themeButton} type="button" onClick={() => setTheme(current => current === "dark" ? "light" : "dark")}>
            <ThemeIcon size={16} /> {isLight ? "Light theme" : "Dark theme"}
          </button>
        </div>
        <div className={styles.stage}>
          <GridMotion
            items={items}
            rows={7}
            aspectRatio={1.3}
            gap={17}
            radius={24}
            angle={-29}
            tilt={35}
            speed={28}
            direction="alternate"
            parallax={0.75}
            spotlight={0.6}
            dim={0.28}
            fade={0.7}
            grayscale={false}
            theme={theme}
          />
          <div className={styles.stageCaption}><span>MOVE YOUR POINTER</span><span>GRID MOTION / 005</span></div>
        </div>
      </section>

      <section className={styles.details}>
        <div><span>01 / CONTENT</span><p>Images, text strings, and custom React elements in one grid.</p></div>
        <div><span>02 / INTERACTION</span><p>Pointer spotlight, layered parallax, and continuous row movement.</p></div>
        <div><span>03 / CONTROL</span><p>Adjustable tilt, direction, spacing, fade, theme, and reduced-motion support.</p></div>
      </section>
      <footer className={styles.bottomNote}><span>GRID MOTION / 005</span><span>REACT · CSS · MOTION</span></footer>
    </main>
  );
}
