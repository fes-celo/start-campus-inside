import teamAsset from "@/assets/team.jpg.asset.json";

export function Initiative() {
  return (
    <section className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
      <img
        src={teamAsset.url}
        alt="The Start Campus team gathered outside the facility"
        width={1200}
        height={960}
        loading="lazy"
        className="h-full w-full rounded-[10px] object-cover"
      />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
          The initiative
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-tight text-foreground sm:text-[36px]">
          The human power behind hyperscale
        </h2>
        <p className="mt-5 text-base leading-[26px] text-foreground">
          Infrastructure sets the foundation, but it's people who make it work. Start Inside Out
          brings you inside one of Europe's most advanced data centers, through the teams who run
          it every day. From engineering to operations, every role plays a part in keeping the
          system running. Explore our talent from the inside out.
        </p>
      </div>
    </section>
  );
}