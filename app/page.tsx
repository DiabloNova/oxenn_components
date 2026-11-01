"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/sidebar/Sidebar";
import {
  ArrowUpRight,
  Blocks,
  CircleCheck,
  Command,
  Disc3,
  Droplets,
  GitBranch,
  Layers3,
  Menu,
  Mountain,
  MoveUpRight,
  Radar,
  Sparkles,
  Waves,
  X,
} from "lucide-react";
import { componentRegistry } from "@/generated/component-registry";
import styles from "./page.module.css";

const navigationIcons = {
  Blocks,
  Disc3,
  Droplets,
  GitBranch,
  Layers3,
  Mountain,
  Radar,
  Sparkles,
  Waves,
} as const;

type NavigationIconName = keyof typeof navigationIcons;

function getNavigationIcon(iconName: string) {
  if (Object.prototype.hasOwnProperty.call(navigationIcons, iconName)) {
    return navigationIcons[iconName as NavigationIconName];
  }
  return Blocks;
}

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
            {componentRegistry.filter((item) => item.navigation).map((item) => {
              const Icon = getNavigationIcon(item.icon);
              return (
                <Link key={item.slug} href={item.href} onClick={() => setMenuOpen(false)}>
                  <Icon size={16} /> {item.title} <ArrowUpRight size={14} />
                </Link>
              );
            })}
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
