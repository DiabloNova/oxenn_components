"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Maximize2,
  Minimize2,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import FluidGlass from "@/components/fluid-glass/FluidGlass";
import styles from "./page.module.css";

type GlassShape = "lens" | "blob" | "cube" | "pill" | "torus" | "prism" | "diamond";
type InteractionMode = "follow" | "static" | "drag";

const SHAPES: GlassShape[] = ["lens", "blob", "cube", "pill", "torus", "prism", "diamond"];

export default function FluidGlassPage() {
  const [shape, setShape] = useState<GlassShape>("pill");
  const [interaction, setInteraction] = useState<InteractionMode>("follow");
  const [size, setSize] = useState(180);
  const [refraction, setRefraction] = useState(0.6);
  const [dispersion, setDispersion] = useState(0.4);
  const [frost, setFrost] = useState(0);
  const [tint, setTint] = useState(0.25);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const probe = document.createElement("canvas");
    const context = probe.getContext("webgl2");
    const supported = Boolean(context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    setWebglAvailable(supported);
  }, []);

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

  const handleShapeChange = (nextShape: string) => {
    if (SHAPES.includes(nextShape as GlassShape)) setShape(nextShape as GlassShape);
  };
  const isReady = webglAvailable === true;

  return (
    <main className={[styles.page, isFullscreen ? styles.fullscreenPage : ""].filter(Boolean).join(" ")}>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.shell}>
        {!isFullscreen && (
          <header className={styles.header}>
            <Link href="/" className={styles.back}>
              <ArrowLeft size={16} /> Component lab
            </Link>
            <span className={styles.mark}>
              <Sparkles size={14} /> OPTICS / 004
            </span>
            <a className={styles.source} href="https://reactbits.dev/animations/fluid-glass" target="_blank" rel="noreferrer">
              React Bits source <ArrowUpRight size={14} />
            </a>
          </header>
        )}

        {!isFullscreen && (
          <section className={styles.intro}>
            <span className={styles.kicker}>INTERACTIVE MATERIAL STUDY / 004</span>
            <h1>Reality,<br /><em>reframed.</em></h1>
            <p>
              A living glass lens that bends the image beneath it, tracks your
              movement, and changes its geometry with a touch. Move across the
              canvas or tap the lens to morph its shape.
            </p>
          </section>
        )}

        <div className={[styles.workspace, isFullscreen ? styles.fullscreenWorkspace : ""].filter(Boolean).join(" ")}>
          <section className={[styles.preview, isFullscreen ? styles.fullscreenPreview : ""].filter(Boolean).join(" ")} aria-label="Fluid Glass live preview">
            <div className={styles.previewMeta}>
              <div className={styles.previewStatus}>
                <span className={styles.liveDot} />
                <span>{isReady ? "LIVE WEBGL RENDER" : "INITIALIZING OPTICS ENGINE"}</span>
                <span className={styles.engineTag}>WEBGL 2</span>
              </div>
              <div className={styles.previewActions}>
                {!isFullscreen && (
                  <span className={styles.interactionHint}>
                    <MousePointer2 size={13} /> MOVE · CLICK TO MORPH
                  </span>
                )}
                <button
                  className={styles.iconButton}
                  type="button"
                  onClick={() => setIsFullscreen((current) => !current)}
                  aria-label={isFullscreen ? "Exit fullscreen preview" : "Expand preview"}
                  title={isFullscreen ? "Exit fullscreen (Esc)" : "Expand preview"}
                >
                  {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
                </button>
              </div>
            </div>

            <div className={styles.stage}>
              {isReady ? (
                <FluidGlass
                  text="AEO/ GEO/ SEO"
                  src="/fluid-glass-hero.svg"
                  shape={shape}
                  shapes={SHAPES}
                  size={size}
                  refraction={refraction}
                  dispersion={dispersion}
                  interaction={interaction}
                  frost={frost}
                  color="#ffffff"
                  tint={tint}
                  reflection={1}
                  shadow={0.5}
                  elevation={0.4}
                  smoothness={0.5}
                  wobble={0.5}
                  spin={0.3}
                  idle
                  morphOnClick
                  intro
                  position={[0.5, 0.52]}
                  onShapeChange={handleShapeChange}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                />
              ) : (
                <div className={styles.staticFallback} aria-live="polite">
                  <div className={styles.fallbackOrb} aria-hidden="true" />
                  <span className={styles.fallbackEyebrow}>
                    {webglAvailable === false ? "WEBGL 2 UNAVAILABLE" : "PREPARING RENDERER"}
                  </span>
                  <h2>AEO / GEO / SEO</h2>
                  <p>
                    {webglAvailable === false
                      ? "This browser or device does not expose WebGL 2. The showcase is shown in a static preview instead."
                      : "Warming up the optical surface…"}
                  </p>
                </div>
              )}
              <div className={styles.stageCaption}>
                <span>01 — REAL-TIME REFRACTION</span>
                <span>LOCAL MEDIA · NO EXTERNAL REQUESTS</span>
              </div>
            </div>
          </section>

          {!isFullscreen && (
            <aside className={styles.controls} aria-label="Fluid Glass controls">
              <div className={styles.controlsHeader}>
                <div>
                  <span className={styles.controlEyebrow}>TUNE THE MATERIAL</span>
                  <h2>Optical controls</h2>
                </div>
                <span className={styles.controlIcon}><Sparkles size={17} /></span>
              </div>

              <label className={styles.field}>
                <span className={styles.fieldTop}>
                  <span>Geometry</span><span className={styles.fieldValue}>{shape.toUpperCase()}</span>
                </span>
                <select value={shape} onChange={(event) => setShape(event.target.value as GlassShape)}>
                  {SHAPES.map((item) => <option value={item} key={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}
                </select>
              </label>

              <label className={styles.field}>
                <span className={styles.fieldTop}>
                  <span>Interaction</span><span className={styles.fieldValue}>{interaction.toUpperCase()}</span>
                </span>
                <select value={interaction} onChange={(event) => setInteraction(event.target.value as InteractionMode)}>
                  <option value="follow">Follow pointer</option>
                  <option value="static">Static · click to morph</option>
                  <option value="drag">Drag and release</option>
                </select>
              </label>

              <div className={styles.rangeField}>
                <label className={styles.fieldTop} htmlFor="fluid-size"><span>Lens size</span><output className={styles.fieldValue}>{size}px</output></label>
                <input id="fluid-size" type="range" min="120" max="280" step="5" value={size} onChange={(event) => setSize(Number(event.target.value))} />
              </div>
              <div className={styles.rangeField}>
                <label className={styles.fieldTop} htmlFor="fluid-refraction"><span>Refraction</span><output className={styles.fieldValue}>{refraction.toFixed(2)}</output></label>
                <input id="fluid-refraction" type="range" min="0" max="2" step="0.05" value={refraction} onChange={(event) => setRefraction(Number(event.target.value))} />
              </div>
              <div className={styles.rangeField}>
                <label className={styles.fieldTop} htmlFor="fluid-dispersion"><span>Chromatic dispersion</span><output className={styles.fieldValue}>{dispersion.toFixed(2)}</output></label>
                <input id="fluid-dispersion" type="range" min="0" max="1" step="0.05" value={dispersion} onChange={(event) => setDispersion(Number(event.target.value))} />
              </div>
              <div className={styles.rangeField}>
                <label className={styles.fieldTop} htmlFor="fluid-frost"><span>Frost</span><output className={styles.fieldValue}>{frost.toFixed(2)}</output></label>
                <input id="fluid-frost" type="range" min="0" max="1" step="0.05" value={frost} onChange={(event) => setFrost(Number(event.target.value))} />
              </div>
              <div className={styles.rangeField}>
                <label className={styles.fieldTop} htmlFor="fluid-tint"><span>Glass tint</span><output className={styles.fieldValue}>{tint.toFixed(2)}</output></label>
                <input id="fluid-tint" type="range" min="0" max="1" step="0.05" value={tint} onChange={(event) => setTint(Number(event.target.value))} />
              </div>

              <div className={styles.controlsFoot}>
                <span><Check size={13} /> Reduced-motion aware</span>
                <span>PIXEL BUDGETED</span>
              </div>
            </aside>
          )}
        </div>

        {!isFullscreen && (
          <>
            <section className={styles.notes}>
              <div><span>01 / SHAPE LANGUAGE</span><p>Seven morphable 3D forms — lens, blob, cube, pill, torus, prism and diamond.</p></div>
              <div><span>02 / OPTICAL MODEL</span><p>Refraction, Fresnel reflection, dispersion, soft frost and cast shadows.</p></div>
              <div><span>03 / RUNTIME</span><p>WebGL 2, responsive pixel budgeting, context recovery and visibility-aware rendering.</p></div>
            </section>
            <footer className={styles.footer}>
              <span>FLUID GLASS / REACT BITS</span><span>REACT · WEBGL 2 · CSS</span>
            </footer>
          </>
        )}
      </div>
    </main>
  );
}
