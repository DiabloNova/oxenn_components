import Link from "next/link";
import Timeline, { type TimelineItem } from "@/components/effects/timeline";

const timelineItems: TimelineItem[] = [
  {
    id: "2020-march",
    date: "March 2020",
    dateTime: "2020-03",
    title: "Research",
    description: "Signal research turns scattered notes into a clear product thesis.",
  },
  {
    id: "2020-november",
    date: "November 2020",
    dateTime: "2020-11",
    title: "Prototype",
    description: "A prototype sprint validates the experience with real operators.",
  },
  {
    id: "2021-july",
    date: "July 2021",
    dateTime: "2021-07",
    title: "First release",
    description: "The founding release ships with the first live customer journeys.",
  },
  {
    id: "2022-october",
    date: "October 2022",
    dateTime: "2022-10",
    title: "Roadmap",
    description: "Community feedback reshapes the roadmap into sharper releases.",
  },
  {
    id: "2023-april",
    date: "April 2023",
    dateTime: "2023-04",
    title: "Automation",
    description: "The automation layer connects insight, publishing, and sales motion.",
  },
  {
    id: "2025-september",
    date: "September 2025",
    dateTime: "2025-09",
    title: "Mobile workflows",
    description: "Companion mobile workflows make the timeline travel-ready.",
  },
  {
    id: "2026-may",
    date: "May 2026",
    dateTime: "2026-05",
    title: "New markets",
    description: "New markets open with localized launches and faster onboarding.",
  },
];

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
        items={timelineItems}
      />
    </main>
  );
}
