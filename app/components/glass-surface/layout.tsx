import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glass Surface — Forme Component Lab",
  description:
    "Explore a responsive glass surface with SVG displacement filters, WebGL2 image refraction, and transparent-image shape mapping.",
};

export default function GlassSurfaceLayout({ children }: { children: ReactNode }) {
  return children;
}
