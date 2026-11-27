"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type BlockTone = "auto" | "light" | "dark";

export interface BlockLink {
  label: string;
  href: string;
  target?: "_blank" | "_self";
}

export const blockFrame =
  "mx-auto w-full max-w-[1440px] px-5 @xl:px-8 @5xl:px-10";

export function blockToneProps(tone: BlockTone) {
  return {
    "data-tone": tone,
    className: tone === "dark" ? "dark" : undefined,
  };
}

export function useBlockReducedMotion() {
  return Boolean(useReducedMotion());
}

export function SectionHeader({
  id,
  eyebrow,
  title,
}: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
}) {
  return (
    <div className="max-w-[760px]">
      {eyebrow ? (
        <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--bjork-accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="text-balance font-bjork-display text-[clamp(2.3rem,5vw,4.8rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[color:var(--bjork-text)]"
      >
        {title}
      </h2>
    </div>
  );
}

export function CtaLink({
  link,
  variant = "secondary",
  arrow = false,
}: {
  link: BlockLink;
  variant?: "primary" | "secondary";
  arrow?: boolean;
}) {
  return (
    <a
      href={link.href}
      target={link.target}
      rel={link.target === "_blank" ? "noreferrer" : undefined}
      className={
        variant === "primary"
          ? "inline-flex items-center gap-2 rounded-full bg-[color:var(--bjork-text)] px-5 py-3 text-sm font-medium text-[color:var(--bjork-bg)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--bjork-accent)]"
          : "inline-flex items-center gap-2 rounded-full border border-[color:var(--bjork-border-strong)] bg-[var(--bjork-surface)] px-5 py-3 text-sm font-medium text-[color:var(--bjork-text)] transition-colors hover:bg-[var(--bjork-surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--bjork-accent)]"
      }
    >
      {link.label}
      {arrow ? <span aria-hidden>↗</span> : null}
    </a>
  );
}

export function Reveal({
  as = "div",
  delay = 0,
  className,
  children,
}: {
  as?: "div" | "li";
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const Component = as === "li" ? motion.li : motion.div;
  return (
    <Component
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: "spring", stiffness: 180, damping: 24, delay }}
      className={className}
    >
      {children}
    </Component>
  );
}
