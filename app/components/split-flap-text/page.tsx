'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Clapperboard, Moon, Sun } from 'lucide-react';
import SplitFlapText from '@/components/split-flap-text/SplitFlapText';
import styles from './page.module.css';

const PHRASES = ['BUILD FASTER', 'SHIP CLEANER', 'DELIGHT USERS'];

export default function SplitFlapTextPage() {
  const [minimal, setMinimal] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [loop, setLoop] = useState(true);

  return (
    <main className={styles.page} data-theme={lightMode ? 'light' : 'dark'}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}><ArrowLeft size={16} /> Component lab</Link>
        <span className={styles.mark}><Clapperboard size={15} /> TYPOGRAPHY / 008</span>
        <a className={styles.source} href="https://reactbits.dev/" target="_blank" rel="noreferrer">
          React Bits <ArrowUpRight size={14} />
        </a>
      </header>

      <section className={styles.intro}>
        <span className={styles.kicker}>KINETIC TYPOGRAPHY / 008</span>
        <h1>Words in<br /><em>motion.</em></h1>
        <p>A mechanical split-flap display for headlines, status messages, and expressive interface moments. Each character flips independently in a cascading sequence.</p>
      </section>

      <section className={styles.showcase} aria-label="Split Flap Text interactive demo">
        <div className={styles.showcaseTop}>
          <div>
            <span className={styles.eyebrow}>LIVE DISPLAY / AUTOMATIC CYCLE</span>
            <h2>Make every letter count.</h2>
          </div>
          <button className={styles.themeButton} type="button" onClick={() => setLightMode((value) => !value)} aria-label={lightMode ? 'Switch to dark theme' : 'Switch to light theme'}>
            {lightMode ? <Moon size={16} /> : <Sun size={16} />}
            {lightMode ? 'Dark' : 'Light'}
          </button>
        </div>

        <div className={styles.display}>
          <span className={styles.displayLabel}>SYSTEM MESSAGE <i /> TRANSMITTING</span>
          <div className={styles.displayCenter}>
            <SplitFlapText
              words={PHRASES}
              flipDuration={0.12}
              stagger={0.06}
              cycleDelay={2400}
              charset="alphanumeric"
              flipsPerChar={8}
              order="left"
              align="left"
              tileStyle={minimal ? 'minimal' : 'board'}
              tileColor={lightMode ? '#e2e8f0' : '#111827'}
              textColor={lightMode ? '#0f172a' : '#f8fafc'}
              glare={0}
              depth={0.5}
              tileRadius={8}
              gap={6}
              fontSize="clamp(15px, 4.2vw, 52px)"
              loop={loop}
              padTo={12}
              intro
            />
          </div>
          <span className={styles.displayFoot}><span>FLAP MECHANISM ONLINE</span><span>3 MESSAGES / LOOP {loop ? 'ON' : 'OFF'}</span></span>
        </div>

        <div className={styles.toolbar}>
          <button type="button" className={styles.toolButton} onClick={() => setMinimal((value) => !value)} aria-pressed={minimal}>
            {minimal ? 'Board tiles' : 'Minimal tiles'}
          </button>
          <button type="button" className={styles.toolButton + (loop ? ' ' + styles.active : '')} onClick={() => setLoop((value) => !value)} aria-pressed={loop}>
            Loop {loop ? 'on' : 'off'}
          </button>
        </div>
      </section>

      <section className={styles.details}>
        <div><span>01 / CHARACTER</span><p>Independent tile animation with randomized glyph sequences before each final character.</p></div>
        <div><span>02 / CASCADE</span><p>Left, right, center, or randomized reveal order with configurable stagger and timing.</p></div>
        <div><span>03 / ACCESSIBILITY</span><p>Screen-reader text announces the current phrase, with reduced-motion support built in.</p></div>
      </section>
      <footer className={styles.bottomNote}><span>SPLIT FLAP TEXT / 008</span><span>REACT · TYPESCRIPT · CSS</span></footer>
    </main>
  );
}
