"use client";

import * as React from "react";
import { WarpCarousel } from "@/components/ui/warp-carousel";

/** Warp Carousel filling the preview. */
export default function WarpCarouselDemo() {
  return (
    <main
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: 340,
        overflow: "hidden",
        backgroundColor: "#efefef",
      }}
    >
      <WarpCarousel style={{ width: "100%", height: "100%" }} />
    </main>
  );
}
