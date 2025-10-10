"use client";

import React, { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";

interface LottieAnimationProps {
  path: string;
  loop?: boolean;
  autoplay?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  renderer?: "svg" | "canvas" | "html";
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  path,
  loop = true,
  autoplay = true,
  width = 300,
  height = 300,
  className,
  renderer = "svg",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: renderer,
      loop: loop,
      autoplay: autoplay,
      path: path,
    });

    return () => {
      animationRef.current?.destroy();
    };
  }, [path, loop, autoplay, renderer]);

  return (
    <div ref={containerRef} className={className} style={{ width, height }} />
  );
};

export default LottieAnimation;
