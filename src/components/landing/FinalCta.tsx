import trophyAsset from "@/assets/trophy.png.asset.json";

export function FinalCta() {
  return (
    <section className="grid items-center gap-8 rounded-[10px] bg-teal px-6 py-12 sm:px-12 sm:py-14 md:grid-cols-[1fr_auto]">
      <div>
        <h2 className="text-3xl font-bold text-teal-foreground sm:text-[36px]">
          The faces behind the infrastructure
        </h2>
        <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-teal-foreground/85">
          Take a closer look at how this campus works, and the people behind it. Explore the series
          or reach out to the team.
        </p>
        <a
          href="#stories"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-[10px] border-2 border-primary bg-transparent px-6 text-sm font-semibold text-teal-foreground transition-colors hover:bg-primary"
        >
          Get in touch
        </a>
      </div>
      <div className="flex flex-col items-center">
        <img
          src={trophyAsset.url}
          alt="DataCloud Awards trophy"
          width={800}
          height={1000}
          loading="lazy"
          className="h-48 w-auto object-contain"
        />
        <p className="mt-3 text-xs font-semibold text-teal-foreground/80">
          Best Data Centre in Europe
        </p>
      </div>
    </section>
  );
}