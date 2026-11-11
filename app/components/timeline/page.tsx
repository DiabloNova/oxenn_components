import Link from "next/link";
import Timeline from "@/components/effects/timeline";

export default function TimelinePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fff", color: "#111" }}>
      <header
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "24px clamp(20px, 5vw, 64px)",
          fontSize: 13,
        }}
      >
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
          ← All components
        </Link>
        <span style={{ color: "#71717a" }}>SCROLL-DRIVEN STORY / TIMELINE</span>
      </header>
      <Timeline
        title="Product Storyline"
        periodLabel="2020–2026"
        imageUrl="https://picsum.photos/1600/900"
        imageAlt="Minimal modern workspace"
      />
    </main>
  );
}
