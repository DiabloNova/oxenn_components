"use client";

import { useState } from "react";
import FloatingBottomNav from "@/components/floating-bottom-nav/FloatingBottomNav";

export default function FloatingBottomNavDemo() {
  const [lastCreatedTask, setLastCreatedTask] = useState<string | null>(null);
  const [activeDestination, setActiveDestination] = useState("home");

  return (
    <>
      {lastCreatedTask && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            zIndex: 60,
            left: "50%",
            bottom: "max(154px, calc(env(safe-area-inset-bottom) + 154px))",
            transform: "translateX(-50%)",
            maxWidth: "calc(100vw - 32px)",
            padding: "11px 16px",
            border: "1px solid rgba(255,255,255,.9)",
            borderRadius: 14,
            background: "rgba(250,250,252,.94)",
            color: "#29292f",
            boxShadow: "0 12px 32px rgba(31,31,39,.12)",
            fontSize: 12,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Task captured: {lastCreatedTask}
        </div>
      )}
      <FloatingBottomNav
        onNavigate={(destination) => setActiveDestination(destination)}
        onCreateTask={(title) => setLastCreatedTask(title)}
      />
      <span
        aria-live="polite"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        Current destination: {activeDestination}
      </span>
    </>
  );
}
