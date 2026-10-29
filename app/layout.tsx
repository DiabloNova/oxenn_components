import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forme — Animated Sidebar Component",
  description: "A minimal, animated, collapsible sidebar component built with Next.js and TypeScript.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
