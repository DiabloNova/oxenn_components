"use client";

import { useEffect, useRef } from "react";
import "./GradientWaves.css";

export type GradientWavesProps = {
  horizonColor?: string;
  waveColor?: string;
  crestColor?: string;
  speed?: number;
  amplitude?: number;
  relief?: number;
  lightAngle?: number;
  mouseInteraction?: boolean;
  swellOnClick?: boolean;
  lightMode?: boolean;
  className?: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function colorWithAlpha(color: string, alpha: number) {
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const full = hex.length === 3 ? hex.split("").map((v) => v + v).join("") : hex;
    const value = Number.parseInt(full, 16);
    if (Number.isFinite(value)) {
      return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
    }
  }
  return color;
}

/** A dependency-free, responsive animated gradient-wave canvas. */
export default function GradientWaves({
  horizonColor = "#8b5cf6",
  waveColor = "#e879f9",
  crestColor = "#f5d0fe",
  speed = 0.4,
  amplitude = 2.5,
  relief = 1,
  lightAngle = 120,
  mouseInteraction = true,
  swellOnClick = true,
  lightMode = true,
  className = "",
}: GradientWavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const interactionRef = useRef({ x: 0.5, y: 0.5, swell: 0, swellX: 0.5, swellY: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !parent || !context) return;

    let frame = 0;
    let raf = 0;
    let last = 0;
    let elapsed = 0;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let visible = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = interactionRef.current;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      if (!reducedMotion.matches) elapsed += dt * clamp(speed, 0, 3);
      const t = elapsed;
      context.clearRect(0, 0, width, height);

      const sky = context.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, colorWithAlpha(horizonColor, lightMode ? 0.22 : 0.12));
      sky.addColorStop(0.48, colorWithAlpha(horizonColor, lightMode ? 0.1 : 0.05));
      sky.addColorStop(1, "rgba(10, 8, 28, 0.01)");
      context.fillStyle = sky;
      context.fillRect(0, 0, width, height);

      const pointerX = mouseInteraction ? (pointer.x - 0.5) * width * 0.08 : 0;
      const pointerY = mouseInteraction ? (pointer.y - 0.5) * height * 0.06 : 0;
      const clickLift = pointer.swell > 0 ? pointer.swell * amplitude * 10 : 0;
      pointer.swell = Math.max(0, pointer.swell - dt * 0.38);
      const layers = 8;
      const baseY = height * 0.43;
      const angle = (lightAngle * Math.PI) / 180;
      const lightX = Math.cos(angle);

      for (let layer = layers - 1; layer >= 0; layer -= 1) {
        const depth = layer / (layers - 1);
        const yBase = baseY + depth * height * 0.48;
        const waveHeight = (10 + depth * 35) * clamp(amplitude, 0, 5);
        const gradient = context.createLinearGradient(0, yBase - waveHeight, width, yBase + waveHeight);
        gradient.addColorStop(0, colorWithAlpha(horizonColor, 0.05 + depth * 0.08));
        gradient.addColorStop(0.48, colorWithAlpha(waveColor, 0.12 + depth * 0.17));
        gradient.addColorStop(0.82, colorWithAlpha(crestColor, 0.08 + relief * 0.18));
        gradient.addColorStop(1, colorWithAlpha(horizonColor, 0.08 + depth * 0.12));

        context.beginPath();
        context.moveTo(0, height);
        context.lineTo(0, yBase);
        const segments = Math.max(32, Math.ceil(width / 12));
        for (let i = 0; i <= segments; i += 1) {
          const x = (i / segments) * width;
          const nx = x / Math.max(width, 1);
          const swellDistance = Math.hypot(nx - pointer.swellX, (yBase / height) - pointer.swellY);
          const localSwell = clickLift * Math.exp(-swellDistance * swellDistance * 38);
          const primary = Math.sin(nx * 7.2 + t * (0.65 + depth * 0.22) + layer * 0.58) * waveHeight;
          const secondary = Math.sin(nx * 14.5 - t * 0.47 + layer * 0.91) * waveHeight * 0.28;
          const ripple = Math.sin(nx * 3.2 + t * 0.35 + depth * 2) * waveHeight * 0.24;
          const y = yBase + primary + secondary + ripple + pointerY * depth - localSwell;
          context.lineTo(x + pointerX * depth, y);
        }
        context.lineTo(width, height);
        context.closePath();
        context.fillStyle = gradient;
        context.fill();

        context.beginPath();
        for (let i = 0; i <= segments; i += 1) {
          const nx = i / segments;
          const x = nx * width;
          const y = yBase
            + Math.sin(nx * 7.2 + t * (0.65 + depth * 0.22) + layer * 0.58) * waveHeight
            + Math.sin(nx * 14.5 - t * 0.47 + layer * 0.91) * waveHeight * 0.28
            + Math.sin(nx * 3.2 + t * 0.35 + depth * 2) * waveHeight * 0.24
            + pointerY * depth;
          if (i === 0) context.moveTo(x + pointerX * depth, y);
          else context.lineTo(x + pointerX * depth, y);
        }
        context.strokeStyle = colorWithAlpha(crestColor, 0.08 + relief * 0.2 + Math.max(0, lightX) * 0.07);
        context.lineWidth = 0.65 + depth * 0.7;
        context.stroke();
      }

      if (!reducedMotion.matches || pointer.swell > 0) raf = window.requestAnimationFrame(draw);
      frame += 1;
    };

    const wake = () => {
      if (!raf && visible && !document.hidden) raf = window.requestAnimationFrame(draw);
    };
    const onMove = (event: PointerEvent) => {
      if (!mouseInteraction) return;
      const rect = parent.getBoundingClientRect();
      pointer.x = clamp((event.clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
      pointer.y = clamp((event.clientY - rect.top) / Math.max(rect.height, 1), 0, 1);
      wake();
    };
    const onClick = (event: PointerEvent) => {
      if (!swellOnClick || reducedMotion.matches) return;
      const rect = parent.getBoundingClientRect();
      pointer.swellX = clamp((event.clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
      pointer.swellY = clamp((event.clientY - rect.top) / Math.max(rect.height, 1), 0, 1);
      pointer.swell = 1;
      wake();
    };
    const onVisibility = () => {
      visible = !document.hidden;
      last = 0;
      if (visible) wake();
      else if (raf) window.cancelAnimationFrame(raf);
      if (!visible) raf = 0;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    document.addEventListener("visibilitychange", onVisibility);
    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerdown", onClick);
    resize();
    wake();

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerdown", onClick);
      frame = 0;
    };
  }, [amplitude, crestColor, horizonColor, lightAngle, lightMode, mouseInteraction, relief, speed, swellOnClick]);

  return (
    <div className={`gradient-waves-container ${className}`.trim()} aria-hidden="true">
      <canvas ref={canvasRef} className="gradient-waves-canvas" />
    </div>
  );
}
