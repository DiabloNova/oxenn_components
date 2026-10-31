'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Disc3, RotateCcw } from 'lucide-react';
import OptionWheel from '@/components/option-wheel/OptionWheel';
import styles from './page.module.css';

const GENRES = ['Ambient', 'House', 'Techno', 'Jazz', 'Lo-Fi', 'Synthwave'];

export default function OptionWheelPage() {
  const [selected, setSelected] = useState(2);
  const [side, setSide] = useState<'left' | 'right'>('left');
  const [loop, setLoop] = useState(false);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}><ArrowLeft size={16} /> Component lab</Link>
        <span className={styles.mark}><Disc3 size={15} /> INTERACTION / 007</span>
        <a className={styles.source} href="https://reactbits.dev/" target="_blank" rel="noreferrer">
          React Bits <ArrowUpRight size={14} />
        </a>
      </header>

      <section className={styles.intro}>
        <span className={styles.kicker}>INTERACTIVE SELECTOR / 007</span>
        <h1>Find your<br /><em>frequency.</em></h1>
        <p>A tactile, curved selector that turns a simple list into a kinetic interface. Scroll, drag, tap, or use the arrow keys to move through the collection.</p>
      </section>

      <section className={styles.showcase} aria-label="Option Wheel interactive demo">
        <div className={styles.showcaseTop}>
          <div>
            <span className={styles.eyebrow}>NOW PLAYING</span>
            <h2>{GENRES[selected]}</h2>
          </div>
          <span className={styles.counter}>{String(selected + 1).padStart(2, '0')} <i>/</i> {String(GENRES.length).padStart(2, '0')}</span>
        </div>
        <div className={styles.wheelStage}>
          <div className={styles.orbit} aria-hidden="true" />
          <div className={styles.stageGlow} aria-hidden="true" />
          <OptionWheel
            items={GENRES}
            defaultSelected={2}
            side={side}
            loop={loop}
            fontSize={2.65}
            spacing={1.45}
            curve={1.1}
            tilt={7}
            blur={1.35}
            fade={0.29}
            minOpacity={0.04}
            inset={48}
            onChange={(index) => setSelected(index)}
          />
          <span className={styles.stageHint}>SCROLL OR DRAG TO EXPLORE</span>
        </div>
        <div className={styles.toolbar}>
          <button type="button" className={styles.toolButton} onClick={() => setSide((current) => current === 'left' ? 'right' : 'left')}>
            <RotateCcw size={14} /> Mirror {side === 'left' ? 'right' : 'left'}
          </button>
          <button type="button" className={`${styles.toolButton}${loop ? ` ${styles.active}` : ''}`} aria-pressed={loop} onClick={() => setLoop((current) => !current)}>
            Loop {loop ? 'on' : 'off'}
          </button>
        </div>
      </section>

      <section className={styles.details}>
        <div><span>01 / INPUT</span><p>Mouse wheel, trackpad, touch drag, and keyboard navigation.</p></div>
        <div><span>02 / MOTION</span><p>Frame-rate independent easing with a configurable curved layout.</p></div>
        <div><span>03 / FEEDBACK</span><p>Selection callbacks, optional audio ticks, and accessible listbox semantics.</p></div>
      </section>
      <footer className={styles.bottomNote}><span>OPTION WHEEL / 007</span><span>REACT · TYPESCRIPT · CSS</span></footer>
    </main>
  );
}
