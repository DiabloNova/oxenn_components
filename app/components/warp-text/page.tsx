"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MousePointer2, Sun, Moon, Waves } from "lucide-react";
import WarpText from "@/components/warp-text/WarpText";
import styles from "./page.module.css";

export default function WarpTextPage() {
  const [lightMode, setLightMode] = useState(false);
  const [lens, setLens] = useState<"bulge" | "pinch" | "swirl">("bulge");

  return (
    <main className={styles.page} data-theme={lightMode ? "light" : "dark"}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}><ArrowLeft size={16} /> Component lab</Link>
        <span className={styles.mark}><Waves size={15} /> TYPOGRAPHY / 009</span>
        <a className={styles.source} href="https://reactbits.dev/text-animations/warp-text" target="_blank" rel="noreferrer">React Bits docs <ArrowUpRight size={14} /></a>
      </header>

      <section className={styles.intro}>
        <span className={styles.kicker}>INTERACTIVE TYPOGRAPHY / 009</span>
        <h1>Words with<br /><em>a little gravity.</em></h1>
        <p>WarpText bends live typography through a WebGL2 lens. Move your pointer across the word, switch the lens profile, and click to send a ripple through the surface.</p>
      </section>

      <section className={styles.preview} aria-label="Interactive WarpText preview">
        <div className={styles.previewMeta}>
          <span>LIVE PREVIEW · WEBGL2</span>
          <span className={styles.hint}><MousePointer2 size={13} /> Move · Click · Explore</span>
          <div className={styles.controls}>
            <label className={styles.lensLabel} htmlFor="warp-lens">Lens</label>
            <select id="warp-lens" value={lens} onChange={event => setLens(event.target.value as "bulge" | "pinch" | "swirl")}>
              <option value="bulge">Bulge</option>
              <option value="pinch">Pinch</option>
              <option value="swirl">Swirl</option>
            </select>
            <button className={styles.themeButton} type="button" onClick={() => setLightMode(value => !value)}>
              {lightMode ? <Moon size={16} /> : <Sun size={16} />}{lightMode ? "Dark canvas" : "Light canvas"}
            </button>
          </div>
        </div>
        <div className={styles.canvas}>
          <WarpText
            text="OXENN"
            color={lightMode ? "#13233d" : "#f3f7ff"}
            warpStrength={0.08}
            warpScale={1.7}
            speed={0.55}
            lens={lens}
            pointerInfluence={0.42}
            pointerStrength={0.38}
            refraction={0.018}
            chromatic={0.35}
            idleDrift={0}
            ripple
            clickRipple
            intro
            fontSize={116}
            fontWeight={800}
            style={{ height: "100%" }}
            fontFamily="inherit"
            letterSpacing="-0.06em"
            lineHeight={0.9}
          />
          <div className={styles.canvasLabel}><span /> WARP FIELD ACTIVE</div>
        </div>
      </section>

      <section className={styles.details}>
        <div><span>01 / LENS</span><p>Bulge, pinch, and swirl profiles shape pointer-driven distortion.</p></div>
        <div><span>02 / REFRACTION</span><p>Chromatic separation and refractive sampling add depth to the text surface.</p></div>
        <div><span>03 / PERFORMANCE</span><p>WebGL2 rendering pauses off-screen and responds to reduced-motion preferences.</p></div>
      </section>

      <footer className={styles.footer}><span>WARP TEXT</span><span>REACT · OGL · WEBGL2</span></footer>
    </main>
  );
}
