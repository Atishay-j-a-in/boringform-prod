"use client";

import { useEffect, useRef } from "react";

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export default function MouseGlowTrail() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    let id = 0;

    const handleMove = (e: MouseEvent) => {
      const point: TrailPoint = {
        x: e.clientX,
        y: e.clientY,
        id: id++,
      };

      const glow = document.createElement("div");

      glow.className = "pointer-events-none fixed z-[9999] h-32 w-32 rounded-full blur-3xl";

      glow.style.left = `${point.x - 64}px`;
      glow.style.top = `${point.y - 64}px`;

      glow.style.background =
        "radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(34,211,238,0.15) 50%, transparent 50%)";

      glow.style.opacity = "0.65";

      glow.style.transition = "transform 1s ease-out, opacity 1s ease-out";

      container.appendChild(glow);

      requestAnimationFrame(() => {
        glow.style.transform = "scale(1.0)";
        glow.style.opacity = "0";
      });

      setTimeout(() => {
        glow.remove();
      }, 1000);
    };

    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return <div ref={containerRef} className="pointer-events-none fixed inset-0 z-[9999]" />;
}
