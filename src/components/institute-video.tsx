"use client";

import { useEffect, useRef } from "react";

type InstituteVideoProps = {
  mode: "feature" | "player";
};

export function InstituteVideo({ mode }: InstituteVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (mode !== "feature") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePlayback = () => {
      const video = videoRef.current;
      if (!video) return;
      if (reducedMotion.matches) video.pause();
      else void video.play().catch(() => undefined);
    };

    updatePlayback();
    reducedMotion.addEventListener("change", updatePlayback);
    return () => reducedMotion.removeEventListener("change", updatePlayback);
  }, [mode]);

  return <video ref={videoRef} muted={mode === "feature"} loop={mode === "feature"} playsInline controls={mode === "player"} preload={mode === "player" ? "metadata" : "none"} aria-label="Video tour of Infosys Computer"><source src="/videos/institute-tour.mp4" type="video/mp4" />Your browser does not support this institute video.</video>;
}
