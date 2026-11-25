"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ContributionSkylineProps = {
  title?: string;
  /** Daily counts, oldest first. The last value represents endDate. */
  data?: number[];
  endDate?: Date;
  /** Colours for no activity followed by four activity levels. */
  palette?: [string, string, string, string, string];
  noun?: [string, string];
  defaultSkyline?: boolean;
  sound?: boolean;
  /** 0 to 1 */
  volume?: number;
  autoplay?: boolean;
  className?: string;
};

type Day = { date: Date; value: number; level: number; week: number; weekday: number };
type Point = { x: number; y: number };
type Streak = "long" | "now" | "best" | null;

const DEFAULT_PALETTE: [string, string, string, string, string] = [
  "#ebedf0", "#b7e4c4", "#6fcf8c", "#2fb35a", "#16803c",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_MS = 86_400_000;

function makeDemoData(end: Date): number[] {
  let seed = 2026;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4_294_967_296;
  };
  return Array.from({ length: 365 }, (_, index) => {
    const date = new Date(end.getTime() - (364 - index) * DAY_MS);
    if (date.getDay() === 0 || date.getDay() === 6) return random() > 0.62 ? Math.ceil(random() * 5) : 0;
    return random() > 0.18 ? Math.ceil(random() * 12) : 0;
  });
}

function project(x: number, y: number, z: number, yaw: number, pitch: number): Point {
  const dx = x - 26.5;
  const dy = y - 3.5;
  const rx = dx * Math.cos(yaw) - dy * Math.sin(yaw);
  const ry = dx * Math.sin(yaw) + dy * Math.cos(yaw);
  return { x: rx, y: ry * Math.cos(pitch) - z * Math.sin(pitch) };
}

function polygon(ctx: CanvasRenderingContext2D, points: Point[]) {
  ctx.beginPath();
  points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
  ctx.closePath();
}

function formatDate(date: Date) {
  return `${WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export default function ContributionSkyline({
  title = "Contributions",
  data,
  endDate,
  palette = DEFAULT_PALETTE,
  noun = ["contribution", "contributions"],
  defaultSkyline = false,
  sound = false,
  volume = 0.5,
  autoplay = false,
  className = "",
}: ContributionSkylineProps) {
  const reducedMotion = !!useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "100px" });
  const entered = useInView(rootRef, { once: true, amount: 0.2 });
  const [end] = useState(() => endDate ?? new Date());
  const series = useMemo(() => (data ?? makeDemoData(end)).map((v) => Math.max(0, Number.isFinite(v) ? v : 0)), [data, end]);
  const [skyline, setSkyline] = useState(defaultSkyline);
  const [width, setWidth] = useState(900);
  const [hovered, setHovered] = useState<number | null>(null);
  const [streak, setStreak] = useState<Streak>(null);
  const [tipVisible, setTipVisible] = useState(false);
  const [yaw, setYaw] = useState(0);
  const yawRef = useRef(0);
  const touched = useRef(false);
  const drag = useRef<{ x: number; startYaw: number; pointerId: number; moved: boolean } | null>(null);
  const [tipPosition, setTipPosition] = useState<Point>({ x: 0, y: 0 });
  const [soundReady, setSoundReady] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new ResizeObserver(() => setWidth(node.getBoundingClientRect().width));
    observer.observe(node);
    setWidth(node.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!sound) return;
    const unlock = () => {
      if (audioRef.current) {
        if (audioRef.current.state === "suspended") void audioRef.current.resume();
        return;
      }
      const AudioContextConstructor = window.AudioContext;
      if (!AudioContextConstructor) return;
      audioRef.current = new AudioContextConstructor();
      setSoundReady(true);
    };
    window.addEventListener("pointerdown", unlock, true);
    window.addEventListener("keydown", unlock, true);
    return () => {
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
    };
  }, [sound]);

  const playTone = (frequency: number) => {
    const context = audioRef.current;
    if (!sound || !context || context.state !== "running" || volume <= 0) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, Math.min(1, volume) * 0.06), context.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.24);
  };

  const { days, total, longest, current, busiest, maxValue } = useMemo(() => {
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    const count = 371;
    const start = new Date(endDay.getTime() - (count - 1) * DAY_MS);
    const values = series.slice(-count);
    while (values.length < count) values.unshift(0);
    const positive = values.filter((value) => value > 0).sort((a, b) => a - b);
    const quantile = (ratio: number) => positive[Math.min(positive.length - 1, Math.floor(positive.length * ratio))] ?? 1;
    const cuts = [quantile(0.25), quantile(0.5), quantile(0.75)];
    const days: Day[] = values.map((value, index) => {
      const date = new Date(start.getTime() + index * DAY_MS);
      const level = value <= 0 ? 0 : value <= cuts[0] ? 1 : value <= cuts[1] ? 2 : value <= cuts[2] ? 3 : 4;
      return { date, value, level, week: Math.floor(index / 7), weekday: date.getDay() };
    });
    let bestStart = 0;
    let bestLength = 0;
    let runStart = 0;
    let runLength = 0;
    days.forEach((day, index) => {
      if (day.value > 0) {
        if (!runLength) runStart = index;
        runLength += 1;
        if (runLength > bestLength) { bestStart = runStart; bestLength = runLength; }
      } else runLength = 0;
    });
    let currentLength = 0;
    for (let index = days.length - 1; index >= 0 && days[index].value > 0; index -= 1) currentLength += 1;
    const busiest = days.reduce((best, day, index) => day.value > days[best].value ? index : best, 0);
    return {
      days,
      total: values.reduce((sum, value) => sum + value, 0),
      longest: { from: bestStart, to: bestStart + bestLength - 1 },
      current: { from: days.length - currentLength, to: days.length - 1 },
      busiest,
      maxValue: Math.max(1, ...values),
    };
  }, [series, end]);

  const streakContains = (index: number) => {
    if (streak === "long") return index >= longest.from && index <= longest.to;
    if (streak === "now") return index >= current.from && index <= current.to;
    if (streak === "best") return index === busiest;
    return true;
  };

  const activeIndex = hovered ?? days.length - 1;
  const activeDay = hovered == null ? null : days[hovered];
  const weekCount = 53;
  const narrow = width < 600;
  const compact = width < 400;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !inView) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    let frame = 0;
    const startTime = performance.now();
    const draw = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (canvas.width !== Math.round(w * ratio) || canvas.height !== Math.round(h * ratio)) {
        canvas.width = Math.round(w * ratio);
        canvas.height = Math.round(h * ratio);
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, w, h);
      const progress = reducedMotion ? (skyline ? 1 : 0) : Math.min(1, (now - startTime) / 900);
      const blend = skyline ? progress : 1 - progress;
      const yawAngle = (yawRef.current - 14 * blend) * Math.PI / 180;
      const pitch = 0.88 * blend;
      const projected = days.map((day, index) => {
        const height = (day.value ? 0.18 + day.value / maxValue * 4.5 : 0.055) * blend;
        const x = day.week + 0.5;
        const y = day.weekday + 0.5;
        const points = [
          project(x - 0.39, y - 0.39, height, yawAngle, pitch),
          project(x + 0.39, y - 0.39, height, yawAngle, pitch),
          project(x + 0.39, y + 0.39, height, yawAngle, pitch),
          project(x - 0.39, y + 0.39, height, yawAngle, pitch),
        ];
        return { day, index, height, points, center: project(x, y, height, yawAngle, pitch) };
      });
      const all = projected.flatMap((cell) => cell.points);
      const minX = Math.min(...all.map((point) => point.x));
      const maxX = Math.max(...all.map((point) => point.x));
      const minY = Math.min(...all.map((point) => point.y));
      const maxY = Math.max(...all.map((point) => point.y));
      const padLeft = narrow ? 28 : 38;
      const padTop = 12;
      const padBottom = 28;
      const scale = Math.min((w - padLeft - 8) / (maxX - minX), (h - padTop - padBottom) / (maxY - minY));
      const offsetX = padLeft + (w - padLeft - 8 - (maxX - minX) * scale) / 2 - minX * scale;
      const offsetY = padTop + (h - padTop - padBottom - (maxY - minY) * scale) / 2 - minY * scale;
      const screen = (point: Point): Point => ({ x: offsetX + point.x * scale, y: offsetY + point.y * scale });
      const ordered = [...projected].sort((a, b) => a.center.y - b.center.y);
      ordered.forEach(({ day, index, height, points }) => {
        const p = points.map(screen);
        const dimmed = streak !== null && !streakContains(index);
        context.globalAlpha = dimmed ? 0.16 : hovered == null || hovered === index ? 1 : 0.8;
        const color = palette[day.level];
        if (blend > 0.08 && height > 0.08) {
          const base = p.map((point) => ({ x: point.x, y: point.y + height * scale * 0.22 }));
          context.fillStyle = color;
          polygon(context, [p[1], p[2], base[2], base[1]]);
          context.fill();
          context.fillStyle = color;
          polygon(context, [p[2], p[3], base[3], base[2]]);
          context.fill();
        }
        context.fillStyle = color;
        polygon(context, p);
        context.fill();
        if (hovered === index) {
          context.globalAlpha = 1;
          context.strokeStyle = "#1d1d1f";
          context.lineWidth = 1.5;
          polygon(context, p);
          context.stroke();
          const center = screen(project(day.week + 0.5, day.weekday + 0.5, height + 0.3, yawAngle, pitch));
          setTipPosition(center);
        }
      });
      context.globalAlpha = 1;
      context.fillStyle = "#86868b";
      context.font = "11px system-ui, sans-serif";
      context.textAlign = "left";
      let lastMonth = -1;
      days.forEach((day) => {
        if (day.weekday !== 0 || day.date.getMonth() === lastMonth) return;
        lastMonth = day.date.getMonth();
        const pos = screen(project(day.week + 0.1, 7.9, 0, yawAngle, pitch));
        context.fillText(MONTHS[day.date.getMonth()], pos.x, Math.min(h - 4, pos.y));
      });
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [days, inView, skyline, reducedMotion, narrow, palette, maxValue, hovered, streak, longest, current, busiest]);

  const setHover = (index: number | null) => {
    setHovered(index);
    setTipVisible(index !== null);
    if (index !== null) playTone(520 + days[index].level * 110);
  };

  const pick = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = viewRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.max(0, Math.min(52, Math.floor((x / rect.width) * weekCount)));
    const row = Math.max(0, Math.min(6, Math.floor((y / rect.height) * 7)));
    const index = days.findIndex((day) => day.week === col && day.weekday === row);
    return index < 0 ? null : index;
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    touched.current = true;
    if (!skyline) return;
    drag.current = { x: event.clientX, startYaw: yawRef.current, pointerId: event.pointerId, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const activeDrag = drag.current;
    if (activeDrag && activeDrag.pointerId === event.pointerId && skyline) {
      const delta = event.clientX - activeDrag.x;
      if (Math.abs(delta) > 3) activeDrag.moved = true;
      if (activeDrag.moved) {
        const nextYaw = Math.max(-40, Math.min(40, activeDrag.startYaw + delta * 0.32));
        yawRef.current = nextYaw;
        setYaw(nextYaw);
        setHover(null);
        return;
      }
    }
    if (event.pointerType === "mouse" || !skyline) setHover(pick(event));
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const activeDrag = drag.current;
    drag.current = null;
    if (activeDrag?.pointerId === event.pointerId && !activeDrag.moved) setHover(pick(event));
  };
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    let next = activeIndex;
    if (event.key === "ArrowLeft") next -= 7;
    else if (event.key === "ArrowRight") next += 7;
    else if (event.key === "ArrowUp") next -= 1;
    else if (event.key === "ArrowDown") next += 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = days.length - 1;
    else if (event.key === "Escape") { setHover(null); return; }
    else return;
    event.preventDefault();
    touched.current = true;
    setHover(Math.max(0, Math.min(days.length - 1, next)));
  };

  const changeView = (next: boolean) => {
    if (next === skyline) return;
    setSkyline(next);
    setHover(null);
    setTipVisible(false);
    if (!next) {
      yawRef.current = 0;
      setYaw(0);
    }
    if (sound) playTone(next ? 880 : 440);
  };

  useEffect(() => {
    if (!autoplay || !inView || reducedMotion || touched.current) return;
    const timer = window.setTimeout(() => changeView(!skyline), 3600);
    return () => window.clearTimeout(timer);
  }, [autoplay, inView, reducedMotion, skyline]);

  const streakDays = (range: { from: number; to: number }) => Math.max(0, range.to - range.from + 1);
  const chips = [
    { id: "now" as const, label: "Current streak", value: `${streakDays(current)} days`, symbol: "🔥" },
    { id: "long" as const, label: "Longest streak", value: `${streakDays(longest)} days`, symbol: "🏆" },
    { id: "best" as const, label: "Busiest day", value: `${days[busiest]?.value ?? 0} on ${MONTHS[days[busiest]?.date.getMonth() ?? 0]} ${days[busiest]?.date.getDate() ?? 0}`, symbol: "✦" },
  ];

  return (
    <section
      ref={rootRef}
      className={`relative mx-auto w-full max-w-[980px] overflow-hidden rounded-[28px] bg-white text-[#1d1d1f] shadow-[0_0_0_1px_rgba(0,0,0,.05),0_24px_48px_-28px_rgba(0,0,0,.35)] ${narrow ? "p-4" : "p-6"} ${className}`}
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Inter, system-ui, sans-serif" }}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className={`truncate font-semibold tracking-[-0.022em] ${narrow ? "text-[19px]" : "text-[22px]"}`}>{title}</h2>
          <p className="truncate text-[13px] text-[#6e6e73]">
            <strong className="tabular-nums text-[#1d1d1f]">{total.toLocaleString("en-US")}</strong>{" "}
            {narrow ? "in the last six months" : `${noun[1]} in the last year`}
          </p>
        </div>
        <div role="radiogroup" aria-label="Contribution chart view" className="flex shrink-0 rounded-full bg-[#f2f2f4] p-[3px]">
          {[{ value: false, label: "Grid", icon: "▦" }, { value: true, label: "Skyline", icon: "▥" }].map((option) => {
            const selected = skyline === option.value;
            return (
              <button
                key={option.label}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => changeView(option.value)}
                className={`relative flex items-center gap-1.5 rounded-full px-3 py-[5px] text-[13px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500/60 ${selected ? "bg-white text-[#1d1d1f] shadow-sm" : "text-[#6e6e73] hover:text-[#1d1d1f]"}`}
              >
                <span aria-hidden="true">{option.icon}</span>{!compact && option.label}
                {compact && <span className="sr-only">{option.label}</span>}
              </button>
            );
          })}
        </div>
      </header>

      <motion.div
        ref={viewRef}
        tabIndex={0}
        role="img"
        aria-label={`${title}: ${total} ${noun[1]}. Use arrow keys to inspect each day.`}
        className={`relative mt-4 select-none rounded-[18px] outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${skyline ? "cursor-grab active:cursor-grabbing" : "cursor-default"} touch-pan-y`}
        style={{ height: skyline ? (narrow ? 270 : 330) : (narrow ? 205 : 235) }}
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={entered ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { drag.current = null; }}
        onPointerLeave={(event) => { if (event.pointerType === "mouse" && !drag.current) setHover(null); }}
        onKeyDown={onKeyDown}
        onBlur={() => setHover(null)}
      >
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute left-0 top-0 z-10" style={{ transform: `translate(${tipPosition.x}px, ${tipPosition.y - 8}px) translate(-50%, -100%)` }}>
          <AnimatePresence>
            {activeDay && tipVisible && (
              <motion.div
                key="contribution-tooltip"
                className="whitespace-nowrap rounded-[11px] bg-[#1d1d1f]/90 px-2.5 py-1.5 text-white shadow-lg backdrop-blur-md"
                initial={{ opacity: 0, y: 4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96 }}
                transition={{ duration: 0.14 }}
              >
                <span className="block text-[13px] font-semibold tabular-nums">{activeDay.value === 0 ? "Nothing" : `${activeDay.value} ${activeDay.value === 1 ? noun[0] : noun[1]}`}</span>
                <span className="block text-[11px] text-white/60">{formatDate(activeDay.date)}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className={`mt-4 flex flex-wrap items-center gap-2 ${narrow ? "" : "justify-between"}`}>
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              aria-pressed={streak === chip.id}
              aria-label={`${chip.label}: ${chip.value}`}
              onPointerEnter={(event) => { if (event.pointerType === "mouse") setStreak(chip.id); }}
              onPointerLeave={(event) => { if (event.pointerType === "mouse") setStreak(null); }}
              onFocus={() => setStreak(chip.id)}
              onBlur={() => setStreak(null)}
              onClick={() => setStreak((currentStreak) => currentStreak === chip.id ? null : chip.id)}
              className={`flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3 text-[12.5px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500/60 ${streak === chip.id ? "bg-[#1d1d1f] text-white" : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#ececef]"}`}
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white" aria-hidden="true">{chip.symbol}</span>
              {!compact && <span className={streak === chip.id ? "text-white/70" : "text-[#6e6e73]"}>{chip.label}</span>}
              <span className="font-semibold tabular-nums">{compact ? `${chip.label.split(" ")[0]} ${chip.value}` : chip.value}</span>
            </button>
          ))}
        </div>
        {!narrow && (
          <div className="flex items-center gap-1.5 text-[11.5px] text-[#86868b]" aria-label="Contribution intensity legend">
            Less
            {palette.map((color, index) => <span key={`${color}-${index}`} className="h-[11px] w-[11px] rounded-[3px]" style={{ background: color }} />)}
            More
          </div>
        )}
      </div>
      <span className="sr-only" aria-live="polite">{soundReady ? "Sound is enabled after user interaction." : ""}</span>
    </section>
  );
}
