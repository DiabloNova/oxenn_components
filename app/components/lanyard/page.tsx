"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, IdCard, MousePointer2, Sparkles } from "lucide-react";
import Lanyard from "@/components/lanyard/Lanyard";
import styles from "./page.module.css";

export default function LanyardPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}><ArrowLeft size={16} /> Component lab</Link>
        <span className={styles.mark}><IdCard size={15} /> INTERACTIVE OBJECT / 006</span>
        <a className={styles.source} href="https://reactbits.dev/animations/lanyard" target="_blank" rel="noreferrer">React Bits docs <ArrowUpRight size={14} /></a>
      </header>
      <section className={styles.intro}>
        <span className={styles.kicker}>PHYSICS-BASED 3D COMPONENT / 006</span>
        <h1>Carry your<br /><em>identity.</em></h1>
        <p>A tactile 3D identity badge suspended from a woven lanyard. Drag it, let it swing, or tap the card to reveal its reverse side.</p>
      </section>
      <section className={styles.preview} aria-label="Interactive Lanyard preview">
        <div className={styles.previewMeta}>
          <span><Sparkles size={13} /> LIVE PREVIEW · THREE.JS</span>
          <span className={styles.hint}><MousePointer2 size={13} /> Drag · Release · Tap to flip</span>
        </div>
        <div className={styles.stage}>
          <div className={styles.stageGlow} />
          <Lanyard
            frontImage="/lanyard-front.jpg"
            backImage="/lanyard-back.svg"
            imageFit="cover"
            cardColor="#f5f5f2"
            orientation="portrait"
            finish="glossy"
            cornerRadius={0.3}
            size={0.72}
            anchor="center"
            strapLength={0.48}
            strapColor="#45484b"
            strapWidth={0.65}
            metal="graphite"
            gravity={1}
            damping={0.58}
            elasticity={0.5}
            breeze={0.2}
            interactive
            intro
            style={{ width: "100%", height: "100%" }}
          />
          <span className={styles.stageLabel}>OXENN / PERSONAL ID</span>
        </div>
      </section>
      <section className={styles.details}>
        <div><span>01 / PHYSICS</span><p>Elastic band simulation with damping, gravity, and subtle ambient breeze</p></div>
        <div><span>02 / INTERACTION</span><p>Pointer and touch drag, momentum, and tap-to-flip behavior</p></div>
        <div><span>03 / MATERIALS</span><p>Glossy card finish, graphite hardware, and woven strap shading</p></div>
      </section>
      <footer className={styles.footer}><span>LANYARD</span><span>REACT · THREE.JS · WEBGL</span></footer>
    </main>
  );
}
