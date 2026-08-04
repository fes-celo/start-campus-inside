import { useEffect, useRef } from "react";

import { HeroShaderBackground, type HeroShaderConfig } from "./hero-shader";

interface HeroShaderCanvasProps {
  config: Partial<HeroShaderConfig>;
  className?: string;
}

export function HeroShaderCanvas({ config, className }: HeroShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bg = new HeroShaderBackground(canvas, config);
    return () => bg.destroy();
    // Config is a fixed production tuning, not meant to hot-reload per render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
