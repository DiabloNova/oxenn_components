"use client";

import { useState } from "react";
import styles from "./GradientWaves.module.css";

export default function GradientWaves() {
  const [paused, setPaused] = useState(false);

  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <a href="/" className={styles.brand}>FORME <span>/</span> MOTION LAB</a>
        <div className={styles.actions}>
          <span className={styles.status}><i /> LIVE CANVAS</span>
          <button type="button" className={styles.pause} onClick={() => setPaused((value) => !value)} aria-pressed={paused}>
            {paused ? "Resume waves" : "Pause waves"}
          </button>
        </div>
      </div>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>BACKGROUND STUDY / 002</p>
        <h1>Gradient <em>waves.</em></h1>
        <p className={styles.description}>A fluid field of luminous blue ribbons, layered depth and slow-moving gradients. Inspired by the Gradient Waves background from React Bits.</p>
      </section>

      <section className={styles.stage} data-paused={paused} aria-label="Animated gradient waves background">
        <div className={styles.mesh} aria-hidden="true" />
        <div className={`${styles.glow} ${styles.glowOne}`} aria-hidden="true" />
        <div className={`${styles.glow} ${styles.glowTwo}`} aria-hidden="true" />
        <svg className={styles.waves} viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Slowly flowing layered cyan and blue waves">
          <defs>
            <linearGradient id="wave-a" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d5f7ff" stopOpacity=".92" />
              <stop offset="28%" stopColor="#79d3f9" stopOpacity=".84" />
              <stop offset="70%" stopColor="#2879db" stopOpacity=".45" />
              <stop offset="100%" stopColor="#101e5b" stopOpacity=".1" />
            </linearGradient>
            <linearGradient id="wave-b" x1="0" y1="0" x2="1" y2=".2">
              <stop offset="0%" stopColor="#0d4fba" stopOpacity=".12" />
              <stop offset="42%" stopColor="#39bdf6" stopOpacity=".7" />
              <stop offset="75%" stopColor="#79d3f9" stopOpacity=".52" />
              <stop offset="100%" stopColor="#263aab" stopOpacity=".2" />
            </linearGradient>
            <linearGradient id="wave-c" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#15205c" stopOpacity=".9" />
              <stop offset="48%" stopColor="#245bd1" stopOpacity=".66" />
              <stop offset="100%" stopColor="#79d3f9" stopOpacity=".08" />
            </linearGradient>
            <filter id="soften"><feGaussianBlur stdDeviation="17" /></filter>
          </defs>
          <g className={styles.waveGroup}>
            <path className={styles.ribbonOne} fill="url(#wave-a)" d="M-100 320 C120 120 250 520 500 335 S850 110 1050 290 S1320 500 1540 210 L1540 520 C1300 690 1190 390 980 505 S620 690 420 480 S120 410 -100 610Z" />
            <path className={styles.ribbonTwo} fill="url(#wave-b)" d="M-80 430 C160 250 290 620 520 440 S830 190 1050 390 S1320 560 1530 330 L1530 670 C1310 800 1160 520 960 640 S600 790 400 590 S100 520 -80 720Z" />
            <path className={styles.ribbonThree} fill="url(#wave-c)" d="M-100 120 C170 300 260 30 510 180 S850 430 1080 200 S1330 70 1540 250 L1540 500 C1320 350 1200 590 990 450 S630 210 430 390 S100 570 -100 390Z" />
            <path className={styles.rim} d="M-100 320 C120 120 250 520 500 335 S850 110 1050 290 S1320 500 1540 210" fill="none" stroke="#c5f5ff" strokeOpacity=".78" strokeWidth="2.2" />
            <path className={styles.rimSecond} d="M-80 430 C160 250 290 620 520 440 S830 190 1050 390 S1320 560 1530 330" fill="none" stroke="#8ce5ff" strokeOpacity=".55" strokeWidth="1.4" />
          </g>
          <g className={styles.haze} filter="url(#soften)">
            <path d="M-80 400 C180 210 290 590 530 410 S840 180 1060 370 S1330 570 1530 290" fill="none" stroke="#79d3f9" strokeWidth="55" strokeOpacity=".26" />
          </g>
        </svg>
        <div className={styles.centerCopy}>
          <span className={styles.pill}><i /> GENERATIVE ATMOSPHERE</span>
          <h2>Flow in<br /><em>another frequency.</em></h2>
          <p>WAVE COLOR <span>#79D3F9</span></p>
        </div>
        <div className={styles.stageFoot}><span>FIG. 02 — FLUID LIGHT</span><span>CSS + SVG / REAL-TIME MOTION</span><span>01 — 03</span></div>
      </section>

      <footer className={styles.footer}><span>FORME COMPONENT LAB</span><span>BUILT FOR MOTION, TUNED FOR CALM.</span></footer>
    </main>
  );
}
