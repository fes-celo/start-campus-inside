import heroAsset from "@/assets/hero.jpg.asset.json";
import { StartCampusLogo } from "./Logos";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[10px]">
      <img
        src={heroAsset.url}
        alt="Start Campus data centre exterior at dusk"
        width={1600}
        height={900}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-teal/75" aria-hidden="true" />
      <div className="relative px-6 pb-16 pt-6 sm:px-10 sm:pb-24 sm:pt-8">
        <StartCampusLogo light />
        <div className="mx-auto mt-12 max-w-2xl text-center sm:mt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Start Campus presents
          </p>
          <h1 className="mt-4 text-[40px] font-bold leading-[1.05] text-primary-foreground sm:text-6xl lg:text-[72px]">
            Start Inside Out
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-primary-foreground/90 sm:text-lg">
            This 1.2GW campus is setting a new standard for global digital infrastructure. But
            scale isn't what defines it - the people running it are. Welcome to the core of our
            operations.
          </p>
          <a
            href="#stories"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-[10px] bg-primary px-8 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Watch the Series
          </a>
        </div>
      </div>
    </section>
  );
}