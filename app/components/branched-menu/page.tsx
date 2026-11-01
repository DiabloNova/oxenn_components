'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Braces,
  Download,
  GitBranch,
  Layers,
  Rocket,
  Settings2,
  Sparkles,
} from 'lucide-react';
import BranchedMenu from '@/components/branched-menu/BranchedMenu';
import styles from './page.module.css';

const MENU_ITEMS = [
  {
    label: 'Getting started',
    children: [
      { value: 'install', label: 'Installation', icon: <Download size={16} strokeWidth={1.8} /> },
      { value: 'quick', label: 'Quick start', icon: <Rocket size={16} strokeWidth={1.8} /> },
      { value: 'config', label: 'Configuration', icon: <Settings2 size={16} strokeWidth={1.8} /> },
      { value: 'theming', label: 'Theming', icon: <Sparkles size={16} strokeWidth={1.8} /> },
    ],
  },
  {
    label: 'Components',
    children: [
      { value: 'buttons', label: 'Buttons', icon: <Braces size={16} strokeWidth={1.8} /> },
      { value: 'typography', label: 'Typography', icon: <BookOpen size={16} strokeWidth={1.8} /> },
      { value: 'overlays', label: 'Overlays', icon: <Layers size={16} strokeWidth={1.8} /> },
      { value: 'toasts', label: 'Toasts' },
    ],
  },
];

export default function BranchedMenuPage() {
  const [selected, setSelected] = useState('quick');
  const [openSections, setOpenSections] = useState([0]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}><ArrowLeft size={16} /> Component lab</Link>
        <span className={styles.mark}><GitBranch size={15} /> NAVIGATION / 008</span>
        <a className={styles.source} href="https://reactbits.dev/" target="_blank" rel="noreferrer">
          React Bits <ArrowUpRight size={14} />
        </a>
      </header>

      <section className={styles.intro}>
        <span className={styles.kicker}>INTERACTIVE NAVIGATION / 008</span>
        <h1>Follow the<br /><em>right branch.</em></h1>
        <p>A compact tree menu with animated connector paths, expandable sections, and a clear active route. Open a branch, then choose a destination.</p>
      </section>

      <section className={styles.showcase} aria-label="Branched Menu interactive demo">
        <div className={styles.showcaseTop}>
          <div>
            <span className={styles.eyebrow}>LIVE NAVIGATION</span>
            <h2>Documentation</h2>
          </div>
          <span className={styles.status}><span /> INTERACTIVE</span>
        </div>

        <div className={styles.demoCanvas}>
          <div className={styles.canvasGlow} aria-hidden="true" />
          <div className={styles.menuPanel}>
            <div className={styles.panelTop}><span className={styles.panelMark}><GitBranch size={14} /> GUIDE / 01</span><span>DOCS</span></div>
            <BranchedMenu
              items={MENU_ITEMS}
              defaultOpen={openSections}
              defaultActive="quick"
              onSelect={(value) => setSelected(value)}
              color="#e8edf7"
              accentColor="#b6d5ff"
              lineColor="#354156"
              width={280}
              rowHeight={38}
              indent={48}
              trunk={14}
              radius={10}
              lineWidth={1.5}
              fontSize={14}
              drawDuration={420}
              foldDuration={320}
            />
          </div>
          <div className={styles.canvasNote}>
            <span className={styles.noteIcon}><Sparkles size={16} /></span>
            <div><strong>One clear path</strong><span>Each selection traces its route back to the section.</span></div>
          </div>
        </div>

        <div className={styles.selection}>
          <div><span className={styles.eyebrow}>CURRENT DESTINATION</span><strong>{MENU_ITEMS.flatMap((section) => section.children).find((item) => item.value === selected)?.label ?? selected}</strong></div>
          <code>{selected}</code>
        </div>
        <div className={styles.toolbar}>
          <button type="button" onClick={() => setOpenSections([0, 1])}>Expand sections</button>
          <button type="button" onClick={() => setOpenSections([])}>Collapse sections</button>
          <span>Click any section heading to toggle its branch</span>
        </div>
      </section>

      <section className={styles.details}>
        <div><span>01 / STRUCTURE</span><p>Nested sections and leaf destinations, supplied as plain data.</p></div>
        <div><span>02 / MOTION</span><p>SVG connector paths draw to the active item as the menu changes.</p></div>
        <div><span>03 / INTEGRATION</span><p>Selection and toggle callbacks keep navigation logic in your application.</p></div>
      </section>

      <footer className={styles.bottomNote}><span>BRANCHED MENU / 008</span><span>REACT · TYPESCRIPT · CSS MODULES</span></footer>
    </main>
  );
}
