import type { Metadata } from "next";
import MarketingFeatureBentoDemo from "./demo";

export const metadata: Metadata = {
  title: "Marketing Feature Bento",
  description:
    "A responsive marketing feature grid with animated trace, replay, alert, cost, code, shortcut, and redaction illustrations.",
};

export default function MarketingFeatureBentoPage() {
  return (
    <main className="min-h-screen">
      <MarketingFeatureBentoDemo />
    </main>
  );
}
