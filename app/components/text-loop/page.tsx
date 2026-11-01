'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Repeat2, Sparkles } from 'lucide-react';
import TextLoop from '@/components/text-loop/TextLoop';
import styles from './page.module.css';

export default function TextLoopPage() {
  const [shape, setShape] = useState<'line' | 'wave' | 'arch' | 'circle' | 'infinity'>('line');
  const [ribbon, setRibbon] = useState(true);
  const [draggable, setDraggable] = useState(true);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}><ArrowLeft size={16} /> Component lab</Link>
        <span className={styles.mark}><Sparkles size={15} /> MOTION / TEXT LOOP</span>
        <a className={styles.source} href="https://reactbits.dev/" target="_blank" rel="noreferrer">
          React Bits <ArrowUpRight size={14} />
        </a>
      </header>

      <section className={styles.intro}>
        <span className={styles.kicker}>KINETIC TYPOGRAPHY / 008</span>
        <h1>Words in<br /><em>motion.</em></h1>
        <p>A continuous typographic ribbon for expressive brand moments. Change its path, pause the motion, or drag the loop to explore its movement.</p>
      </section>

      <section className={styles.showcase} aria-label="Text Loop interactive demo">
        <div className={styles.showcaseTop}>
          <div><span className={styles.eyebrow}>LIVE PREVIEW</span><h2>OXENN / AI DISCOVERY</h2></div>
          <span className={styles.counter}>008 <i>/</i> 008</span>
        </div>
        <div className={styles.stage}>
          <div className={styles.stageGlow} aria-hidden="true" />
          <TextLoop
            text=" OXENN ✦ AI ✦ SEO ✦ AEO ✦ GEO "
            shape={shape}
            speed={90}
            direction="forward"
            separator="✦"
            curviness={126}
            tilt={0}
            fontSize={46}
            fontWeight={800}
            letterSpacing={2}
            uppercase
            ribbon={ribbon}
            ribbonColor="#5227FF"
            ribbonWidth={86}
            edgeFade={0.3}
            cross={false}
            crossAngle={16}
            draggable={draggable}
            scrollBoost={0.3}
            outline={false}
            pauseOnHover
            outlineWidth={1.5}
          />
          <span className={styles.stageHint}>HOVER TO PAUSE{draggable ? ' · DRAG TO CONTROL' : ''}</span>
        </div>
        <div className={styles.toolbar}>
          <div className={styles.shapeControls} role="group" aria-label="Text path shape">
            {(['line', 'wave', 'arch', 'circle', 'infinity'] as const).map((item) => (
              <button key={item} type="button" className={shape === item ? styles.active : ''} aria-pressed={shape === item} onClick={() => setShape(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className={styles.toggles}>
            <button type="button" className={ribbon ? styles.active : ''} aria-pressed={ribbon} onClick={() => setRibbon((value) => !value)}>Ribbon</button>
            <button type="button" className={draggable ? styles.active : ''} aria-pressed={draggable} onClick={() => setDraggable((value) => !value)}><Repeat2 size={14} /> Drag</button>
          </div>
        </div>
      </section>

      <section className={styles.details}>
        <div><span>01 / PATH</span><p>Line, wave, arch, circle, infinity, or a custom SVG path.</p></div>
        <div><span>02 / MOTION</span><p>Hover pause, drag momentum, scroll boost, and reduced-motion support.</p></div>
        <div><span>03 / STYLE</span><p>Ribbon color, typography, edge fade, outline, and crossing paths.</p></div>
      </section>
      <footer className={styles.bottomNote}><span>TEXT LOOP / 008</span><span>REACT · SVG · GSAP · CSS MODULES</span></footer>
    </main>
  );
}
