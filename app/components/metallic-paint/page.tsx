"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, RotateCcw, Sparkles, Waves } from "lucide-react";
import MetallicPaint from "@/components/metallic-paint/MetallicPaint";
import styles from "./page.module.css";
export default function MetallicPaintPage() {
 const [speed,setSpeed]=useState(1),[density,setDensity]=useState(2),[dispersion,setDispersion]=useState(.3),[lightMode,setLightMode]=useState(false);
 const reset=()=>{setSpeed(1);setDensity(2);setDispersion(.3);setLightMode(false);};
 return <main className={styles.page}><div className={styles.frame}>
 <header className={styles.header}><Link href="/" className={styles.back}><ArrowLeft size={16}/> Component lab</Link><span className={styles.mark}><Sparkles size={14}/> MATERIAL STUDY / 011</span><a className={styles.source} href="https://reactbits.dev/animations/metallic-paint" target="_blank" rel="noreferrer">React Bits <ArrowUpRight size={14}/></a></header>
 <section className={styles.hero}><div className={styles.copy}><span className={styles.kicker}>LIQUID METAL / WEBGL2</span><h1>Make it<br/><em>metallic.</em></h1><p>A living chrome finish for logos and typography. Light rolls across the silhouette, bends at its edges, and responds to pointer movement.</p><div className={styles.meta}><span><Waves size={14}/> WebGL2 shader</span><span><Sparkles size={14}/> Pointer reactive</span></div></div><div className={styles.logoStage}><MetallicPaint imageSrc="/metallic-paint-logo.svg" style={{width:"100%",height:"100%"}} speed={speed} density={density} dispersion={dispersion} lightMode={lightMode}/></div></section>
 <section className={styles.textStage}><span className={styles.sectionLabel}>TYPE / LIQUID CHROME</span><div className={styles.typePaint}><MetallicPaint text="OXENN" style={{width:"100%",height:190}} speed={speed} density={density} dispersion={dispersion} lightMode={lightMode}/></div></section>
 <section className={styles.controls} aria-label="Metallic paint controls"><div className={styles.controlHead}><div><strong>Shader controls</strong><small>Changes update both live previews</small></div><button type="button" onClick={reset}><RotateCcw size={13}/> Reset</button></div>
 <label>Flow speed <output>{speed.toFixed(1)}×</output><input type="range" min="0" max="2" step=".1" value={speed} onChange={e=>setSpeed(Number(e.target.value))}/></label>
 <label>Reflection density <output>{density.toFixed(1)}</output><input type="range" min=".5" max="8" step=".5" value={density} onChange={e=>setDensity(Number(e.target.value))}/></label>
 <label>Color dispersion <output>{dispersion.toFixed(2)}</output><input type="range" min="0" max="1" step=".05" value={dispersion} onChange={e=>setDispersion(Number(e.target.value))}/></label>
 <label className={styles.toggle}><input type="checkbox" checked={lightMode} onChange={e=>setLightMode(e.target.checked)}/> Light mode</label></section>
 <section className={styles.usage}><div><span className={styles.sectionLabel}>QUICK START</span><h2>One component.<br/><em>Infinite finishes.</em></h2><p>Pass a transparent SVG or text. The component derives the silhouette and renders the animated metallic surface with WebGL2.</p></div><pre><code>{'import MetallicPaint from "@/components/metallic-paint/MetallicPaint";\n\n<div style={{ width: "100%", height: 500 }}>\n  <MetallicPaint imageSrc="/metallic-paint-logo.svg" />\n</div>'}</code></pre></section>
 <footer className={styles.footer}><Link href="/"><ArrowLeft size={14}/> Back to component lab</Link><span>REACT · GLSL · WEBGL2</span><a href="https://github.com/DiabloNova/oxenn_components" target="_blank" rel="noreferrer">SOURCE <ArrowUpRight size={13}/></a></footer>
 </div></main>;
}