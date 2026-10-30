"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Droplets,
  Layers3,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Waves,
} from "lucide-react";
import GlassSurface from "@/components/glass-surface/GlassSurface";
import styles from "./page.module.css";

const usageSnippet = [
  'import GlassSurface from "@/components/glass-surface/GlassSurface";',
  "",
  "<GlassSurface",
  "  width={496}",
  "  height={62}",
  "  borderRadius={57}",
  "  distortionScale={130}",
  "  displace={0.5}",
  "  backgroundOpacity={0.1}",
  ">",
  "  <span>Your content</span>",
  "</GlassSurface>",
].join(String.fromCharCode(10));

export default function GlassSurfacePage() {
  const backdropRef = useRef<HTMLImageElement>(null);
  const [distortion, setDistortion] = useState(130);
  const [blur, setBlur] = useState(17);
  const [saturation, setSaturation] = useState(1);
  const [frost, setFrost] = useState(0.1);

  const resetControls = () => {
    setDistortion(130);
    setBlur(17);
    setSaturation(1);
    setFrost(0.1);
  };

  return (
    <main className={styles.page}>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.frame}>
        <header className={styles.header}>
          <Link href="/" className={styles.back}>
            <ArrowLeft size={16} /> Component lab
          </Link>
          <span className={styles.mark}><Droplets size={15} /> SURFACE / 004</span>
          <a className={styles.source} href="https://reactbits.dev/" target="_blank" rel="noreferrer">
            React Bits <ArrowUpRight size={14} />
          </a>
        </header>

        <section className={styles.intro}>
          <div className={styles.copy}>
            <span className={styles.kicker}><span /> MATERIAL STUDY / 004</span>
            <h1>Glass,<br /><em>with depth.</em></h1>
            <p>
              A responsive glass surface with soft refraction, luminous edges,
              and a little distortion. Place it over imagery, shape it around a
              mark, or keep it beautifully simple.
            </p>
            <div className={styles.introMeta}>
              <span><Check size={13} /> SVG filter fallback</span>
              <span><Waves size={13} /> WebGL2 refraction</span>
            </div>
          </div>

          <div className={styles.heroSpec} role="group" aria-label="Glass surface component specification">
            <div className={styles.specOrb} aria-hidden="true" />
            <GlassSurface
              width="100%"
              height={142}
              borderRadius={28}
              borderWidth={0.1}
              brightness={55}
              opacity={0.92}
              blur={12}
              displace={0.45}
              backgroundOpacity={0.12}
              distortionScale={90}
              saturation={1.1}
              className={styles.heroGlass}
            >
              <div className={styles.heroGlassContent}>
                <span className={styles.heroOverline}>MATERIAL / 01</span>
                <strong>Clarity<br />is a feeling.</strong>
                <span className={styles.heroFoot}><Sparkles size={13} /> Light, shaped.</span>
              </div>
            </GlassSurface>
            <span className={styles.orbitLabel}>OPTICAL SURFACE <i /></span>
          </div>
        </section>

        <section className={styles.featureStage} aria-labelledby="refraction-title">
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.sectionIndex}>01 / LIVE REFRACTION</span>
              <h2 id="refraction-title">Let the background bend.</h2>
              <p>Move the glass across the artwork and tune the optical response.</p>
            </div>
            <span className={styles.liveTag}><i /> LIVE SURFACE</span>
          </div>

          <div className={styles.refractionScene}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={backdropRef}
              className={styles.backdrop}
              src="/glass-backdrop.svg"
              alt=""
              aria-hidden="true"
            />
            <div className={styles.sceneVignette} aria-hidden="true" />
            <div className={styles.sceneCaption}>
              <span>FORM / LIGHT / COLOR</span>
              <strong>Nothing stays<br />quite still.</strong>
              <small>OPTICAL STUDY — 01</small>
            </div>
            <GlassSurface
              backdrop={backdropRef}
              width="min(496px, calc(100% - 32px))"
              height={76}
              borderRadius={38}
              borderWidth={0.12}
              brightness={52}
              opacity={0.93}
              blur={blur}
              displace={0.5}
              backgroundOpacity={frost}
              saturation={saturation}
              distortionScale={distortion}
              redOffset={0}
              greenOffset={10}
              blueOffset={20}
              refraction
              renderer="webgl"
              className={styles.refractionGlass}
            >
              <div className={styles.glassMessage}>
                <span className={styles.messageIcon}><Sparkles size={17} /></span>
                <span><strong>Made of light.</strong><small>Refraction follows the surface.</small></span>
                <span className={styles.messageArrow}><ArrowUpRight size={18} /></span>
              </div>
            </GlassSurface>
            <span className={styles.sceneIndex}>GLASS / 004 <span>DRAG YOUR EYES</span></span>
          </div>

          <div className={styles.controlPanel}>
            <div className={styles.controlTitle}>
              <span className={styles.controlIcon}><SlidersHorizontal size={16} /></span>
              <div><strong>Optical controls</strong><small>Adjust the live surface</small></div>
              <button type="button" className={styles.resetButton} onClick={resetControls}>
                <RotateCcw size={13} /> Reset
              </button>
            </div>
            <div className={styles.controls}>
              <label className={styles.control}>
                <span>Distortion <output>{distortion}</output></span>
                <input type="range" min="0" max="220" step="5" value={distortion} onChange={(event) => setDistortion(Number(event.target.value))} />
              </label>
              <label className={styles.control}>
                <span>Blur <output>{blur}px</output></span>
                <input type="range" min="0" max="30" step="1" value={blur} onChange={(event) => setBlur(Number(event.target.value))} />
              </label>
              <label className={styles.control}>
                <span>Saturation <output>{saturation.toFixed(1)}×</output></span>
                <input type="range" min="0.5" max="1.8" step="0.1" value={saturation} onChange={(event) => setSaturation(Number(event.target.value))} />
              </label>
              <label className={styles.control}>
                <span>Frost <output>{Math.round(frost * 100)}%</output></span>
                <input type="range" min="0" max="0.3" step="0.01" value={frost} onChange={(event) => setFrost(Number(event.target.value))} />
              </label>
            </div>
          </div>
        </section>

        <section className={styles.examples} aria-labelledby="examples-title">
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.sectionIndex}>02 / COMPONENT VARIANTS</span>
              <h2 id="examples-title">One material. Many expressions.</h2>
              <p>Use the same component for a quiet panel, a floating action, or a custom silhouette.</p>
            </div>
          </div>

          <div className={styles.exampleGrid}>
            <article className={styles.exampleCard}>
              <div className={styles.exampleVisual + " " + styles.softScene}>
                <div className={styles.softGlow} aria-hidden="true" />
                <GlassSurface
                  width="min(100%, 340px)"
                  height={72}
                  borderRadius={24}
                  distortionScale={130}
                  displace={0.5}
                  backgroundOpacity={0.1}
                  className={styles.simpleGlass}
                >
                  <div className={styles.simpleContent}>
                    <span className={styles.simpleIcon}><Layers3 size={17} /></span>
                    <span><strong>Simple glass</strong><small>Soft frost · rounded edge</small></span>
                    <ArrowUpRight size={18} />
                  </div>
                </GlassSurface>
              </div>
              <div className={styles.exampleCopy}>
                <span>VARIANT / A</span>
                <h3>Frosted surface</h3>
                <p>A lightweight surface for cards, navigation, and floating controls.</p>
              </div>
            </article>

            <article className={styles.exampleCard}>
              <div className={styles.exampleVisual + " " + styles.shapeScene}>
                <div className={styles.shapeGlow} aria-hidden="true" />
                <GlassSurface
                  shape="/glass-mark.svg"
                  width={190}
                  height={190}
                  borderWidth={0.09}
                  brightness={56}
                  opacity={0.95}
                  blur={12}
                  className={styles.shapeGlass}
                >
                  <span className={styles.shapeFallback}><Droplets size={48} /></span>
                </GlassSurface>
              </div>
              <div className={styles.exampleCopy}>
                <span>VARIANT / B</span>
                <h3>Custom silhouette</h3>
                <p>Use a transparent image as the shape map to create a refractive outline.</p>
              </div>
            </article>
          </div>
        </section>

        <section className={styles.usage}>
          <div className={styles.usageText}>
            <span className={styles.sectionIndex}>03 / QUICK START</span>
            <h2>Drop it in.<br /><em>Shape the light.</em></h2>
            <p>GlassSurface is self-contained: import the component, pass your content, and tune the optical properties as needed.</p>
          </div>
          <div className={styles.codePanel}>
            <div className={styles.codeTop}><span><i /> GlassSurface.jsx</span><span>REACT / JSX</span></div>
            <pre><code>{usageSnippet}</code></pre>
          </div>
        </section>

        <footer className={styles.footer}>
          <Link href="/" className={styles.back}><ArrowLeft size={14} /> Back to component lab</Link>
          <span>REACT · CSS FILTERS · WEBGL2</span>
          <a href="https://github.com/DiabloNova/oxenn_components" target="_blank" rel="noreferrer">SOURCE <ArrowUpRight size={13} /></a>
        </footer>
      </div>
    </main>
  );
}