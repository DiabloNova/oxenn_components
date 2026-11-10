import Link from "next/link";
import Aurora from "@/components/aurora/Aurora";

export default function AuroraPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "clamp(24px, 5vw, 64px)", color: "#f5f5f5", background: "#090b12" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <Link href="/" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: 14 }}>← All components</Link>
        <header style={{ margin: "36px 0 28px" }}>
          <p style={{ color: "#8b9cff", fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase" }}>React Bits · WebGL</p>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", lineHeight: 1, margin: "12px 0" }}>Aurora</h1>
          <p style={{ maxWidth: 640, color: "#a1a1aa", lineHeight: 1.7 }}>A soft, animated aurora that flows across its container, with configurable color stops, layered noise, and optional pointer interaction.</p>
        </header>
        <section aria-label="Aurora component preview" style={{ position: "relative", height: 520, overflow: "hidden", border: "1px solid #272a38", borderRadius: 20, background: "#05070b" }}>
          <Aurora colorStops={["#00ff36", "#3a7eea", "#00ff49"]} amplitude={2.2} blend={0.86} height={0.38} speed={1.6} glow={0.15} scale={2.15} brightness={1.55} layers={3} direction="top" opacity={1} mouseInteraction intro lightMode />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeContent: "center", textAlign: "center", pointerEvents: "none" }}>
            <p style={{ color: "#d4d4d8", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase" }}>A living gradient</p>
            <p style={{ color: "white", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 650, margin: "10px 0" }}>Beyond the ordinary</p>
          </div>
        </section>
        <section style={{ marginTop: 28, padding: 24, borderRadius: 16, background: "#11131d", border: "1px solid #272a38" }}>
          <h2 style={{ fontSize: 18, margin: "0 0 12px" }}>Usage</h2>
          <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", color: "#c4c8d4", fontSize: 13, lineHeight: 1.7 }}>{`import Aurora from "@/components/aurora/Aurora";\n\n<div style={{ width: "100%", height: 600, position: "relative" }}>\n  <Aurora colorStops={["#00ff36", "#3a7eea", "#00ff49"]} layers={3} mouseInteraction />\n</div>`}</pre>
        </section>
      </div>
    </main>
  );
}
