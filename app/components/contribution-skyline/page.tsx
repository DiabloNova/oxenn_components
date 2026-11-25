import Link from "next/link";
import ContributionSkyline from "@/components/ui/contribution-skyline";

export default function ContributionSkylinePage() {
  return (
    <main style={{ minHeight: "100vh", padding: "clamp(24px, 5vw, 64px)", color: "#f5f5f5", background: "#090b12" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <Link href="/" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: 14 }}>← All components</Link>
        <header style={{ margin: "36px 0 28px" }}>
          <p style={{ color: "#8b9cff", fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase" }}>Data visualization · Framer Motion</p>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", lineHeight: 1, margin: "12px 0" }}>Contribution Skyline</h1>
          <p style={{ maxWidth: 680, color: "#a1a1aa", lineHeight: 1.7 }}>
            A year of daily activity, shown as a familiar contribution grid or a tactile, animated skyline. Explore streaks, inspect individual days, and rotate the 3D view.
          </p>
        </header>

        <section aria-label="Contribution skyline live preview" style={{ padding: 16, borderRadius: 24, background: "#f5f5f7" }}>
          <ContributionSkyline />
        </section>

        <section style={{ marginTop: 28, padding: 24, borderRadius: 16, background: "#11131d", border: "1px solid #272a38" }}>
          <h2 style={{ fontSize: 18, margin: "0 0 12px" }}>Usage</h2>
          <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", color: "#c4c8d4", fontSize: 13, lineHeight: 1.7 }}>
{\`import ContributionSkyline from "@/components/ui/contribution-skyline";

<ContributionSkyline
  title="Contributions"
  data={dailyCounts}
  defaultSkyline
  sound={false}
/>\`}
          </pre>
          <p style={{ color: "#a1a1aa", fontSize: 13, lineHeight: 1.7, marginBottom: 0 }}>
            Pass daily counts oldest-first. The final entry corresponds to today or the supplied endDate. If data is omitted, a deterministic demo series is shown.
          </p>
        </section>
      </div>
    </main>
  );
}
