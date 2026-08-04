import { StartCampusLogo } from "./Logos";
import { HeroShaderCanvas } from "./HeroShaderCanvas";
import type { HeroShaderConfig } from "./hero-shader";

const HERO_SHADER_CONFIG: Partial<HeroShaderConfig> = {
  scale: 2.27,
  skew: 0.55,
  angle: 0.4,
  autoSpeed: 41,
  blurAmount: 0.09,
  gain: 1.59,
  cellWidth: 23,
  cellHeight: 4,
  levels: 14,
  contrast: 2.42,
  floor: 0,
  columnJitter: 0.07,
  edgeSoftness: 0.75,
  colors: ["#183538", "#12BD64", "#A0E5C1", "#F4F4FF"],
  stop1: 0.72,
  stop2: 1,
  mouseRadius: 0.81,
  mouseStrength: 0.01,
  pixelRatio: 2,
};

export function Hero() {
  return (
    <section className="relative flex flex-1 flex-col overflow-hidden rounded-[10px]">
      <HeroShaderCanvas
        config={HERO_SHADER_CONFIG}
        className="absolute inset-0 h-full w-full pointer-events-none"
      />
      <div className="absolute inset-0 bg-teal/40" aria-hidden="true" />
      <div className="relative flex flex-1 flex-col px-4 pb-16 pt-6 sm:px-10 sm:pb-24 sm:pt-8">
        <StartCampusLogo light />
        <div className="mx-auto my-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Start Campus presents
          </p>
          <h1 className="mt-4 text-[40px] font-bold leading-[1.05] text-primary-foreground sm:text-6xl lg:text-[72px]">
            Start Inside Out
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-primary-foreground/90 sm:text-lg">
            This 1.2GW campus is setting a new standard for global digital infrastructure. But scale
            isn't what defines it - the people running it are. Welcome to the core of our
            operations.
          </p>
          <a
            href="#stories"
            className="press-feedback mt-8 inline-flex h-14 items-center justify-center rounded-[10px] bg-primary px-8 text-base font-semibold text-primary-foreground hover:opacity-90"
          >
            Watch the Series
          </a>
        </div>
      </div>
    </section>
  );
}
