import { Network, ShieldCheck, Zap } from "lucide-react";

const values = [
  {
    Icon: Zap,
    title: "Environmental Stewardship",
    body: "We build for the long term. Operating on 100% renewable energy, our approach combines efficiency, responsible resource use and recognised standards like LEED.",
  },
  {
    Icon: Network,
    title: "Collaborative Innovation",
    body: "We work in a fast-moving, mission-critical environment. Teams collaborate across functions to design and run systems that need to scale reliably, every day.",
  },
  {
    Icon: ShieldCheck,
    title: "Culture of Security",
    body: "Security is part of the day-to-day. From physical infrastructure to data, it's a shared responsibility across teams, supported by clear processes and constant attention.",
  },
];

export function LifeInside() {
  return (
    <section className="rounded-[10px] bg-card px-6 py-14 sm:px-12 sm:py-16">
      <h2 className="text-center text-3xl font-bold text-card-foreground sm:text-[36px]">
        Life on the inside
      </h2>
      <p className="mt-2 text-center text-base text-card-foreground">
        What powers our operations
      </p>
      <div className="mt-12 grid gap-10 md:grid-cols-3">
        {values.map(({ Icon, title, body }) => (
          <div key={title} className="flex flex-col items-center text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-mint">
              <Icon className="h-7 w-7 text-primary" strokeWidth={1.75} />
            </span>
            <h3 className="mt-5 text-xl font-bold text-card-foreground">{title}</h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-card-foreground/80">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}