"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/sidebar/Sidebar";
import { ArrowUpRight, CircleCheck, Command, Droplets, Layers3, Menu, MoveUpRight, Waves, X } from "lucide-react";
import styles from "./page.module.css";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className={styles.page}>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.frame}>
        <header className={styles.topbar}>
          <Link className={styles.wordmark} href="/" aria-label="Forme home"><span className={styles.logo}><Command size={17} /></span> forme<span className={styles.dot}>.</span></Link>
          <div className={styles.topMeta}><span className={styles.liveDot} /> COMPONENT LAB <span className={styles.version}>v1.0</span></div>
          <a className={styles.github} href="https://github.com/DiabloNova/oxenn_components" target="_blank" rel="noreferrer">View repository <ArrowUpRight size={15}/></a>
          <button className={styles.menuButton} type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
          {menuOpen && <nav className={styles.menuPanel} id="site-navigation" aria-label="Site navigation">
            <Link href="/" onClick={() => setMenuOpen(false)}><Command size={16} /> Component lab home</Link>
            <Link href="/components/floating-bottom-nav" onClick={() => setMenuOpen(false)}><Layers3 size={16} /> Floating bottom navigation <ArrowUpRight size={14} /></Link>
            <Link href="/components/gradient-waves" onClick={() => setMenuOpen(false)}><Waves size={16} /> Gradient Waves <ArrowUpRight size={14} /></Link>
            <Link href="/components/fluid-glass" onClick={() => setMenuOpen(false)}><Droplets size={16} /> Fluid Glass <ArrowUpRight size={14} /></Link>
            <a href="https://github.com/DiabloNova/oxenn_components" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}><ArrowUpRight size={16} /> GitHub repository</a>
          </nav>}
        </header>
        <section className={styles.intro}>
          <div className={styles.eyebrow}><span /> NAVIGATION SYSTEM / 001</div>
          <h1>A little less<br/><em>in the way.</em></h1>
          <p>A quiet, considered sidebar that opens into your workspace. Built to feel effortless, down to the last interaction.</p>
          <div className={styles.instructions}><span className={styles.mouseIcon}><MoveUpRight size={15}/></span> Tap the sparkle or arrow to expand the menu</div>
        </section>
        <section className={styles.stage} aria-label="Interactive sidebar demo">
          <div className={styles.stageTop}><span>LIVE PREVIEW</span><span className={styles.stageState}><CircleCheck size={13}/> INTERACTIVE</span></div>
          <div className={styles.demoSurface}>
            <div className={styles.gridPattern} aria-hidden="true" />
            <Sidebar />
            <div className={styles.demoHint}><Layers3 size={17}/><span>Workspace navigation</span></div>
          </div>
          <div className={styles.stageFoot}><span>01 / COLLAPSED BY DEFAULT</span><span>HOVER · CLICK · EXPLORE</span></div>
        </section>
        <footer className={styles.footer}><span>DESIGNED FOR FOCUS.</span><span>Next.js · React · TypeScript <MoveUpRight size={13}/></span></footer>
      </div>
    </main>
  );
}
