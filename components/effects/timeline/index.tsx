"use client";

import { type CSSProperties, useId, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./timeline.module.css";

gsap.registerPlugin(ScrollTrigger);

export interface TimelineItem {
  /** Stable, unique identifier for this event. */
  id: string;
  /** Human-readable date, for example "March 2020". */
  date: string;
  /** Optional machine-readable date for the HTML time element, for example "2020-03". */
  dateTime?: string;
  /** Short event heading. */
  title: string;
  /** Event description. */
  description: string;
}

export interface TimelineProps {
  /** Events in the exact order in which they should be read and displayed. */
  items: readonly TimelineItem[];
  title: string;
  periodLabel?: string;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  imageUrl?: string;
  /** Empty alt text is used when the optional image is decorative. */
  imageAlt?: string;
  /** Set to rtl for right-to-left content and movement. */
  direction?: "ltr" | "rtl";
}

const MOBILE_QUERY = "(max-width: 767px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMediaQuery(query: string, callback: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function useMediaQuery(query: string, serverSnapshot: boolean) {
  return useSyncExternalStore(
    (callback) => subscribeToMediaQuery(query, callback),
    () => window.matchMedia(query).matches,
    () => serverSnapshot,
  );
}

export default function Timeline({
  items,
  title,
  periodLabel,
  textColor = "#111827",
  mutedTextColor = "#4b5563",
  activeColor = "#f97316",
  backgroundColor = "#ffffff",
  imageUrl,
  imageAlt = "",
  direction = "ltr",
}: TimelineProps) {
  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const instanceId = useId().replace(/:/g, "");
  // Use a conservative server snapshot: do not start non-essential motion
  // until the browser has confirmed both viewport and motion preferences.
  const isMobile = useMediaQuery(MOBILE_QUERY, true);
  const prefersReducedMotion = useMediaQuery(REDUCED_MOTION_QUERY, true);

  const rootStyle = {
    "--timeline-text": textColor,
    "--timeline-muted": mutedTextColor,
    "--timeline-accent": activeColor,
    "--timeline-background": backgroundColor,
  } as CSSProperties;

  useGSAP(
    () => {
      const root = rootRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;

      // Mobile and reduced-motion layouts remain in normal document flow.
      if (!root || !viewport || !track || isMobile || prefersReducedMotion) {
        return;
      }

      const getTravelDistance = () =>
        Math.max(track.scrollWidth - viewport.clientWidth, 0);

      if (getTravelDistance() < 1) return;

      const directionMultiplier = direction === "rtl" ? 1 : -1;
      const tween = gsap.to(track, {
        x: () => directionMultiplier * getTravelDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${getTravelDistance()}`,
          pin: viewport,
          pinSpacing: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    {
      dependencies: [direction, isMobile, items, prefersReducedMotion],
      revertOnUpdate: true,
      scope: rootRef,
    },
  );

  return (
    <section
      ref={rootRef}
      id={`timeline-${instanceId}`}
      className={styles.timeline}
      style={rootStyle}
      dir={direction}
      aria-labelledby={`timeline-heading-${instanceId}`}
    >
      <div ref={viewportRef} className={styles.viewport}>
        <header className={styles.header}>
          <div className={styles.heading}>
            {periodLabel ? <p className={styles.period}>{periodLabel}</p> : null}
            <h2 id={`timeline-heading-${instanceId}`}>{title}</h2>
          </div>
          {imageUrl ? (
            <img
              className={styles.image}
              src={imageUrl}
              alt={imageAlt}
              loading="lazy"
              decoding="async"
            />
          ) : null}
        </header>

        {items.length > 0 ? (
          <div className={styles.trackViewport}>
            <ol className={styles.track} ref={trackRef} aria-label={title}>
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className={`${styles.item} ${index % 2 === 0 ? styles.above : styles.below}`}
                  data-timeline-item
                >
                  <span className={styles.marker} aria-hidden="true" />
                  <article className={styles.card}>
                    <time
                      className={styles.date}
                      dateTime={item.dateTime || undefined}
                    >
                      {item.date}
                    </time>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <p className={styles.emptyState}>No timeline events are available.</p>
        )}
      </div>
    </section>
  );
}
