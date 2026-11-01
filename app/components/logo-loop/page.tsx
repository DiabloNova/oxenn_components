"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Code2, Layers3, MousePointer2, Orbit, Sparkles } from "lucide-react";
import LogoLoop from "@/components/logo-loop/LogoLoop";
import styles from "./page.module.css";

const technologyLogos = [
  { node: <Code2 size={34} strokeWidth={1.8} />, title: "React", href: "https://react.dev", hoverColor: "#61dafb", ariaLabel: "React" },
  { node: <Orbit size={34} strokeWidth={1.8} />, title: "Next.js", href: "https://nextjs.org", hoverColor: "#a1a1aa", ariaLabel: "Next.js" },
  { node: <Code2 size={34} strokeWidth={1.8} />, title: "TypeScript", href: "https://www.typescriptlang.org", hoverColor: "#3178c6", ariaLabel: "TypeScript" },
  { node: <Layers3 size={34} strokeWidth={1.8} />, title: "Tailwind CSS", href: "https://tailwindcss.com", hoverColor: "#38bdf8", ariaLabel: "Tailwind CSS" },
  { node: <Sparkles size={34} strokeWidth={1.8} />, title: "Vercel", href: "https://vercel.com", hoverColor: "#ffffff", ariaLabel: "Vercel" },
];

const imageLogos = [
  { src: "/logo-loop/oxenn-mark.svg", alt: "Oxenn", title: "Oxenn", href: "https://oxenn.ai" },
  { src: "/logo-loop/forme-mark.svg", alt: "Forme", title: "Forme", href: "https://github.com/DiabloNova/oxenn_components" },
  { src: "/logo-loop/oxenn-mark.svg", alt: "Oxenn Labs", title: "Oxenn Labs" },
];

export default function LogoLoopPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}><ArrowLeft size={16} /> Component lab</Link>
        <span className={styles.mark}><Layers3 size={15} /> MOTION / 008</span>
        <a className={styles.source} href="https://reactbits.dev/animations/logo-loop" target="_blank" rel="noreferrer">React Bits docs <ArrowUpRight size={14} /></a>
      </header>

      <section className={styles.intro}>
        <span className={styles.kicker}>CONTINUOUS MARQUEE / 008</span>
        <h1>Keep good<br /><em>company.</em></h1>
        <p>A seamless, kinetic logo marquee for technology stacks, partners, and image marks. Explore its direction, curvature, focus lens, and drag interaction.</p>
      </section>

      <section className={styles.preview} aria-label="LogoLoop component demonstrations">
        <div className={styles.previewHeader}>
          <div><span className={styles.index}>01 / LINEAR MARQUEE</span><h2>Technology, in motion.</h2></div>
          <span className={styles.hint}><MousePointer2 size={13} /> Hover to pause · Drag to explore</span>
        </div>
        <div className={styles.logoStage}>
          <LogoLoop logos={technologyLogos} speed={78} direction="left" logoHeight={42} gap={64} hoverSpeed={0} scaleOnHover ariaLabel="Technology partners" />
        </div>
        <div className={styles.caption}><span>SEAMLESS LOOP</span><span>HOVER COLOR · DRAG · REDUCED MOTION</span></div>
      </section>

      <section className={styles.examples}>
        <article className={styles.example}>
          <div className={styles.exampleHeading}><span className={styles.index}>02 / ARC LAYOUT</span><h2>A softer orbit.</h2><p>Curved geometry with a subtle center focus.</p></div>
          <div className={styles.arcStage}>
            <LogoLoop logos={technologyLogos} speed={46} direction="left" logoHeight={32} gap={46} layout="arc" bend={0.48} focus={0.22} magnify={0.08} fadeOut fadeOutWidth={0.16} ariaLabel="Curved technology logo loop" />
          </div>
        </article>
        <article className={styles.example}>
          <div className={styles.exampleHeading}><span className={styles.index}>03 / VERTICAL LOOP</span><h2>Another direction.</h2><p>Vertical motion with perspective and image marks.</p></div>
          <div className={styles.verticalStage}>
            <LogoLoop logos={imageLogos} direction="up" speed={54} logoHeight={42} gap={38} tiltX={6} tiltY={-16} focus={0.12} fadeOut fadeOutWidth={0.14} draggable ariaLabel="Oxenn brand marks" />
          </div>
        </article>
      </section>

      <section className={styles.details}>
        <div><span>01 / CONTENT</span><p>React nodes or image assets, with optional links, labels, and hover colors</p></div>
        <div><span>02 / MOTION</span><p>Continuous, stepped, draggable, vertical, and scroll-boosted movement</p></div>
        <div><span>03 / GEOMETRY</span><p>Line, wave, arc, and orbit layouts with focus and magnification effects</p></div>
      </section>
      <footer className={styles.footer}><span>LOGO LOOP</span><span>REACT · CSS · INTERACTION</span></footer>
    </main>
  );
}
