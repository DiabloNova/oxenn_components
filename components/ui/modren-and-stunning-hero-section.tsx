"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./modren-and-stunning-hero-section.module.css";

const PEEPS = [
  "381d6479-f5b5-49ca-82f3-474c87c62996",
  "9df39fca-20db-4273-bf7e-488d04a13321",
  "3c8ee64a-67b3-4a2c-84d5-c665c725e7c5",
  "3ccafa92-f479-4885-a6fb-0af92993b7f6",
  "735686b6-9bd5-4ab1-9fe6-59c50b5e2eb0",
  "3f775475-8920-4f55-b7c1-16bf192a0b1f",
  "b56ceaf5-7fb3-40a2-bb1a-d41c547c71ca",
  "4bd0452d-b321-4488-b57a-0c52dc73ceb1",
  "5d3553c5-a46f-4238-bcb5-02ff60b0f907",
  "6669baf9-e6d8-476b-abd4-e3d52517aee8",
  "2a2fffcb-9e4e-4610-a2ec-c2c334e29001",
  "742a5c0b-c77f-4ab3-96eb-dbca387f5ff8",
  "da0b3073-d6fd-46d2-a1f6-747fbfedf2b1",
  "d9738cd5-9685-47c4-9eab-e004c4d83776",
  "706557e0-8408-4b07-bcab-2968cf4c493e",
].map((id) => `https://floo.design/api/a/${id}.svg`);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className={styles.arrow} aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Component = () => {
  const crowdRef = useRef<HTMLDivElement>(null);
  const thingRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    return () => media.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    const crowd = crowdRef.current;
    if (!crowd) return;

    const things = ["checkout", "landing page", "mobile flow", "design system", "pricing page", "dashboard"];
    const output = thingRef.current;
    let ti = 0;
    let ci = things[0].length;
    let deleting = false;
    if (output) output.textContent = things[0];

    let typingInterval: ReturnType<typeof setInterval> | undefined;
    if (!reducedMotion && output) {
      typingInterval = setInterval(() => {
        const word = things[ti];
        if (!deleting) {
          ci++;
          if (ci > word.length) {
            deleting = true;
            ci = word.length + 8;
          }
        } else {
          ci--;
          if (ci < 0) {
            deleting = false;
            ti = (ti + 1) % things.length;
            ci = 0;
          }
        }
        output.textContent = word.slice(0, Math.max(0, Math.min(ci, word.length)));
      }, 70);
    }

    const people: Array<{
      wrapper: HTMLDivElement;
      element: HTMLDivElement;
      image: HTMLImageElement;
      t: number;
      dir: number;
      speed: number;
      x: number;
      depth: number;
    }> = [];
    let mx = 0;
    let tx = 0;
    let last = performance.now();
    let frame = 0;

    const place = (person: (typeof people)[number], anywhere = false) => {
      person.t = 31 + Math.random() * 54;
      const width = 146 + (person.t - 31.8) * 2.62;
      person.dir = Math.random() < 0.5 ? 1 : -1;
      person.speed = 108 / (9 + Math.random() * 27);
      person.x = anywhere ? -5 + Math.random() * 110 : person.dir > 0 ? -5 : 104;
      person.depth = (person.t - 31) / 54;
      person.wrapper.style.cssText = `top:${person.t.toFixed(2)}%;width:${width.toFixed(1)}px;height:${(width * 1.35).toFixed(1)}px;z-index:${Math.floor(person.t)};`;
      person.image.src = PEEPS[Math.floor(Math.random() * PEEPS.length)];
      person.image.style.filter = `blur(${Math.max(0.04, (78 - person.t) * 0.05).toFixed(2)}px)`;
      person.image.style.transform = `scaleX(${person.dir})`;
    };

    for (let i = 0; i < 64; i++) {
      const wrapper = document.createElement("div");
      wrapper.className = styles.person;
      const element = document.createElement("div");
      element.className = styles.personInner;
      const img = document.createElement("img");
      img.alt = "";
      img.draggable = false;
      img.decoding = "async";
      img.className = styles.personImage;
      element.appendChild(img);
      wrapper.appendChild(element);
      crowd.appendChild(wrapper);
      const person = { wrapper, element, image: img, t: 0, dir: 1, speed: 0, x: 0, depth: 0 };
      place(person, true);
      people.push(person);
    }

    const handlePointerMove = (event: PointerEvent) => {
      tx = event.clientX / window.innerWidth - 0.5;
    };
    window.addEventListener("pointermove", handlePointerMove);

    const animate = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      mx += (tx - mx) * 0.06;
      people.forEach((person) => {
        if (!reducedMotion) {
          person.x += person.dir * person.speed * dt;
          if (person.x > 104 || person.x < -6) place(person);
        }
        person.element.style.transform = `translate3d(calc(-50% + ${person.x.toFixed(2)}vw), -50%, 0)`;
        person.wrapper.style.transform = `translate3d(${(-mx * person.depth * 3).toFixed(2)}vw, 0, 0)`;
      });
      if (!reducedMotion) frame = requestAnimationFrame(animate);
    };

    if (!reducedMotion) frame = requestAnimationFrame(animate);
    else animate(performance.now());

    return () => {
      if (typingInterval) clearInterval(typingInterval);
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
      crowd.replaceChildren();
    };
  }, [reducedMotion]);

  return (
    <div className={styles.hero}>
      <div className={styles.orb} aria-hidden="true" />
      <header className={styles.header}>
        <div className={styles.navInner}>
          <a href="#" className={styles.brand} aria-label="Floo home">
            <img src="https://cdn.21st.dev/assets/mirror/72/7226088b9824293669a34b9ddbfaafa12b890707d250a7316ebdce8a5475f86e.svg" alt="Floo" />
          </a>
          <nav className={styles.navLinks} aria-label="Main navigation">
            <a href="#">Canvas</a><a href="#">Agents &amp; MCP</a><a href="#">App Previews</a><a href="#">Pricing</a>
          </nav>
          <div className={styles.navActions}>
            <a href="#" className={styles.docs}>Docs</a>
            <a href="#" className={styles.getStarted}>Get started</a>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Design from what<br />
          <span className={styles.underlined}>already works.
            <svg viewBox="0 0 520 22" preserveAspectRatio="none" className={styles.underline} aria-hidden="true">
              <defs><linearGradient id="floo-underline-gradient" x1="0" x2="1"><stop stopColor="#78B8F9" /><stop offset=".55" stopColor="#5667FF" /><stop offset="1" stopColor="#4D2FF9" /></linearGradient></defs>
              <path pathLength="1" d="M6 14C120 4 300 3 514 12" className={styles.underlinePath} />
            </svg>
          </span>
        </h1>
        <p className={styles.description}>
          Find how the best apps solve the screen you&apos;re about to design. Then the Floo Agent, or your own Claude Code or Cursor, designs your version on a live canvas your team can edit.
        </p>
        <div className={styles.ctas}>
          <a href="#" className={styles.primaryCta}>
            <span className={styles.buttonSweep} aria-hidden="true" />
            <span className={styles.ctaText}>Start designing</span>
            <span className={styles.ctaArrow}><ArrowIcon /></span>
          </a>
          <a href="#" className={styles.secondaryCta}>
            <svg viewBox="0 0 24 24" className={styles.playIcon} aria-hidden="true"><path fill="#facc15" d="M7 4.5v15l13-7.5z" /></svg>
            See how it works
          </a>
        </div>

        <section className={styles.composer} aria-label="Design prompt preview">
          <div className={styles.composerGlow} aria-hidden="true" />
          <h2>Open a canvas. Invite your agents.</h2>
          <p>Bring Claude Code, Codex or Cursor, or run the Floo Agent on your own key.</p>
          <div className={styles.promptBox}>
            <div className={styles.promptBorder} aria-hidden="true" />
            <div className={styles.promptRow}>
              <div className={styles.promptText}>Let’s design a{" "}<b ref={thingRef}>checkout</b><i className={styles.caret} aria-hidden="true" /></div>
              <button type="button" className={styles.startButton}>Start <ArrowIcon /></button>
            </div>
          </div>
        </section>
      </main>

      <div ref={crowdRef} className={styles.crowd} aria-hidden="true" />
    </div>
  );
};

export default Component;
