import { Reveal } from "./Reveal";
import campusVideo from "@/assets/start-campus.mp4.asset.json";

export function StandOut() {
  return (
    <Reveal>
      <section className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Current opportunities
          </p>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-[36px]">Stand out</h2>
          <p className="mt-5 text-base leading-[26px] text-foreground">
            Start Campus is growing, and we're building teams with different backgrounds,
            experiences and perspectives. If you're looking to work on complex systems, take
            ownership and be part of something at scale, this is a place to do it.
          </p>
          <a
            href="#stories"
            className="press-feedback mt-8 inline-flex h-12 items-center justify-center rounded-[10px] bg-primary px-6 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            View Open Positions
          </a>
        </div>
        <div className="relative overflow-hidden rounded-[10px]">
          <video
            src={campusVideo.url}
            className="aspect-[8/5] w-full object-cover"
            controls
            playsInline
            preload="metadata"
          />
        </div>
      </section>
    </Reveal>
  );
}
