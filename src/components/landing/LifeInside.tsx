import { Reveal } from "./Reveal";

const values = [
  {
    icon: "/icons/icon-environmental.svg",
    title: "Environmental Stewardship",
    body: "We build for the long term. Operating on 100% renewable energy, our approach combines efficiency, responsible resource use and recognised standards like LEED.",
  },
  {
    icon: "/icons/icon-collaborative.svg",
    title: "Collaborative Innovation",
    body: "We work in a fast-moving, mission-critical environment. Teams collaborate across functions to design and run systems that need to scale reliably, every day.",
  },
  {
    icon: "/icons/icon-culture.svg",
    title: "Culture of Security",
    body: "Security is part of the day-to-day. From physical infrastructure to data, it's a shared responsibility across teams, supported by clear processes and constant attention.",
  },
];

export function LifeInside() {
  return (
    <Reveal>
      <section className="rounded-[10px] bg-card px-4 py-14 sm:px-12 sm:py-16">
        <h2 className="text-center text-3xl font-bold text-card-foreground sm:text-[36px]">
          Life on the inside
        </h2>
        <p className="mt-2 text-center text-base leading-[125%] text-card-foreground">
          What powers our operations
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {values.map(({ icon, title, body }, index) => (
            <Reveal key={title} variant="item" delay={index * 70}>
              <div className="flex flex-col items-center text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-mint">
                  <img src={icon} alt="" className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-card-foreground">{title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-[125%] text-card-foreground/80">
                  {body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
