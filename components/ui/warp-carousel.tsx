"use client";

import * as React from "react";

/** The small graphic under each numeral. */
export type WarpCardDetail = "slider" | "ring" | "wave" | "cross" | "none";

export interface WarpCard {
  title: string;
  value: string;
  unit?: string;
  footer?: string;
  mesh?: string[];
  numeral?: [string, string];
  glow?: string;
  detail?: WarpCardDetail;
  accent?: string;
  labels?: string[];
}

export interface WarpCarouselProps {
  cards?: WarpCard[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  autoplay?: boolean;
  interval?: number;
  step?: number;
  background?: string;
  glow?: string;
  warp?: number;
  font?: string;
  seconds?: number;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const WARP_CAROUSEL_CARDS: WarpCard[] = [
  { title: "Motion budget\nper page", value: "25", unit: "%", footer: "Tuned per screen", detail: "slider", labels: ["Calm", "Lively"], numeral: ["#3ad2ff", "#8cf6ff"], accent: "#7fe8ff", glow: "#12b0e8", mesh: ["#022852", "#031e3f", "#031934", "#021831", "#021b36", "#022246", "#022345", "#020e1e", "#01040f", "#000416", "#020b31", "#021c57", "#01172f", "#01010c", "#03001d", "#0a0f4c", "#112383", "#0b36af", "#021142", "#050b47", "#0c2e8f", "#165bd4", "#1675fd", "#167bff", "#03288e", "#0438af", "#0d66e7", "#107eec", "#30afff", "#71dcff", "#0356e8", "#0259ec", "#0945b0", "#001a49", "#3f7c9d", "#d4ffff", "#0365ff", "#0256ea", "#052a87", "#00001f", "#1f4c7b", "#9ee7ff"] },
  { title: "Loop length\nseconds", value: "20", unit: "s", footer: "Seamless on every loop", detail: "cross", labels: ["Preview", "in", "out"], numeral: ["#e2a6ff", "#fff6ff"], accent: "#d9a8ff", glow: "#62bce8" },
  { title: "Frame rate\nsteady", value: "95", unit: "fps", footer: "Smooth on every screen", detail: "ring", numeral: ["#f4eeb6", "#c4c688"], accent: "#f6efc0", glow: "#dacbe9" },
  { title: "Components\nin the kit", value: "72", footer: "Made by hand", detail: "wave", numeral: ["#fffdf8", "#e8603f"], accent: "#ff6a3d", glow: "#6cc0ea" },
];

const DEFAULT_FONT = '"Inter", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, "Helvetica Neue", Arial, sans-serif';

function mod(n: number, length: number) {
  return ((n % length) + length) % length;
}

function meshBackground(card: WarpCard) {
  if (card.mesh?.length) {
    const stops = card.mesh.slice(0, 8).join(", ");
    return `linear-gradient(145deg, ${stops})`;
  }
  return `radial-gradient(ellipse at 20% 15%, ${card.numeral?.[0] ?? "#465bff"}66, transparent 60%), linear-gradient(145deg, #11152d, #030611)`;
}

/**
 * A perspective carousel of animated statistic cards.
 * Supports controlled/uncontrolled navigation, pointer dragging, keyboard input and autoplay.
 */
export function WarpCarousel({
  cards = WARP_CAROUSEL_CARDS,
  index,
  defaultIndex = 0,
  onIndexChange,
  autoplay = false,
  interval = 5,
  step = 1,
  background = "#050711",
  glow,
  warp = 0.75,
  font = DEFAULT_FONT,
  seconds,
  ariaLabel = "Warp statistics carousel",
  className,
  style,
}: WarpCarouselProps) {
  const list = React.useMemo(() => {
    const source = cards.length ? cards : WARP_CAROUSEL_CARDS;
    return source.length >= 4 ? source : Array.from({ length: 4 }, (_, i) => source[i % source.length]);
  }, [cards]);
  const controlled = index !== undefined;
  const [inner, setInner] = React.useState(defaultIndex);
  const current = mod(controlled ? index! : inner, list.length);
  const currentRef = React.useRef(current);
  const dragStart = React.useRef<number | null>(null);
  const dragDelta = React.useRef(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const reducedMotion = React.useRef(false);

  React.useEffect(() => { currentRef.current = current; }, [current]);

  const change = React.useCallback((next: number) => {
    const normalized = mod(next, list.length);
    if (!controlled) setInner(normalized);
    currentRef.current = normalized;
    onIndexChange?.(normalized);
  }, [controlled, list.length, onIndexChange]);

  React.useEffect(() => {
    if (!autoplay || list.length < 2 || reducedMotion.current) return;
    const timer = window.setInterval(() => change(currentRef.current + step), Math.max(1, interval) * 1000);
    return () => window.clearInterval(timer);
  }, [autoplay, interval, step, change, list.length]);

  React.useEffect(() => {
    reducedMotion.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragStart.current = event.clientX;
    dragDelta.current = 0;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    dragDelta.current = event.clientX - dragStart.current;
  };
  const onPointerUp = () => {
    if (dragStart.current === null) return;
    const delta = dragDelta.current;
    dragStart.current = null;
    dragDelta.current = 0;
    if (Math.abs(delta) > 36) change(currentRef.current + (delta < 0 ? 1 : -1));
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    change(current + (event.key === "ArrowRight" ? 1 : -1));
  };

  const front = list[current];
  return (
    <div
      ref={rootRef}
      className={className}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 420,
        aspectRatio: "5 / 4",
        overflow: "hidden",
        background,
        touchAction: "pan-y",
        userSelect: "none",
        outline: "none",
        perspective: 1100,
        fontFamily: font,
        ...style,
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: "0 0 auto", height: 36, pointerEvents: "none", background: `radial-gradient(ellipse at 50% 0, ${glow ?? front.glow ?? "#53baff"}55, transparent 72%)`, filter: "blur(12px)" }} />
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        {list.map((card, i) => {
          let offset = i - current;
          if (offset > list.length / 2) offset -= list.length;
          if (offset < -list.length / 2) offset += list.length;
          const distance = Math.abs(offset);
          const active = offset === 0;
          const cardGlow = glow ?? card.glow ?? "#65baff";
          return (
            <article
              key={i}
              aria-hidden={!active}
              onClick={() => { if (!active) change(i); }}
              style={{
                position: "absolute",
                width: "min(35.6%, 256px)",
                minWidth: 190,
                height: "min(80%, 320px)",
                borderRadius: 10,
                overflow: "hidden",
                padding: "24px 18px 20px",
                boxSizing: "border-box",
                color: "white",
                background: meshBackground(card),
                border: "1px solid rgba(255,255,255,.13)",
                boxShadow: active ? `0 0 65px ${cardGlow}55, 0 24px 90px #0009` : "0 18px 50px #0008",
                opacity: distance > 2 ? 0 : 1 / (1 + distance * 0.22),
                transform: `translateX(${offset * 74 * (1 + warp * .12)}%) translateZ(${active ? 0 : -180 * distance}px) rotateY(${offset * -32}deg) scale(${1 - distance * .12})`,
                transition: "transform 850ms cubic-bezier(.2,.75,.2,1), opacity 500ms ease, box-shadow 500ms ease",
                cursor: active ? "grab" : "pointer",
                pointerEvents: distance > 2 ? "none" : "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backfaceVisibility: "hidden",
              }}
            >
              <div style={{ fontSize: 12, lineHeight: 1.5, whiteSpace: "pre-line", color: "#ffffffdf", letterSpacing: ".02em" }}>{card.title}</div>
              <div style={{ position: "relative", textAlign: "center", marginTop: 12, marginBottom: 12 }}>
                <div style={{ fontSize: "clamp(48px, 7vw, 76px)", fontWeight: 300, lineHeight: 1, letterSpacing: "-.06em", background: `linear-gradient(90deg, ${card.numeral?.[0] ?? "#fff"}, ${card.numeral?.[1] ?? "#cbd5ff"})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", textShadow: `0 0 30px ${cardGlow}55` }}>
                  {card.value}<sup style={{ fontSize: ".28em", verticalAlign: "top", marginLeft: 4, color: card.numeral?.[1] ?? "#fff" }}>{card.unit}</sup>
                </div>
                {card.detail === "slider" && <div style={{ margin: "28px 8px 0", height: 2, background: `linear-gradient(90deg, ${card.accent ?? "#fff"}55, ${card.accent ?? "#fff"})`, position: "relative" }}><span style={{ position: "absolute", left: "25%", top: -5, width: 12, height: 12, borderRadius: "50%", background: "#fff", boxShadow: `0 0 12px ${card.accent ?? "#fff"}` }} /></div>}
                {card.detail === "ring" && <div style={{ width: 118, height: 118, borderRadius: "50%", border: `1px dashed ${card.accent ?? "#fff"}99`, margin: "-12px auto 0", boxShadow: `0 0 28px ${card.accent ?? "#fff"}22` }} />}
                {card.detail === "wave" && <div style={{ height: 32, marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>{Array.from({ length: 34 }, (_, n) => <span key={n} style={{ width: 2, height: 4 + Math.abs(Math.sin(n * 1.7) * Math.cos(n * .53)) * 25, background: n === 17 ? card.accent ?? "#fff" : "#ffffff66" }} />)}</div>}
                {card.detail === "cross" && <div style={{ position: "absolute", inset: "-35px 0", pointerEvents: "none", background: "linear-gradient(90deg, transparent 49.8%, #ffffff35 50%, transparent 50.2%), linear-gradient(transparent 49.8%, #ffffff35 50%, transparent 50.2%)" }} />}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 10, color: "#ffffffb8" }}>
                <span>{card.footer}</span><span>{card.labels?.join(" · ")}</span>
              </div>
            </article>
          );
        })}
      </div>
      <div aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>
        {front ? `${front.title.replace("\n", " ")}: ${front.value}${front.unit || ""}. ${front.footer || ""}` : ""}
      </div>
      <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 7 }}>
        {list.map((_, i) => <button key={i} type="button" aria-label={`Go to slide ${i + 1}`} aria-current={i === current} onClick={() => change(i)} style={{ width: i === current ? 22 : 6, height: 6, padding: 0, border: 0, borderRadius: 99, background: i === current ? "#fff" : "#ffffff55", cursor: "pointer", transition: "all 250ms ease" }} />)}
      </div>
    </div>
  );
}

export default WarpCarousel;
