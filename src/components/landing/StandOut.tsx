import { useEffect, useRef } from "react";
import { Reveal } from "./Reveal";
import campusVideo from "@/assets/start-campus.mp4";

export function StandOut() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            void video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <Reveal>
      <section
        ref={sectionRef}
        className="grid items-center gap-10 md:grid-cols-2 md:gap-14"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Current opportunities
          </p>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-[36px]">Stand out</h2>
          <p className="mt-5 text-base leading-[125%] text-foreground">
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
            ref={videoRef}
            src={campusVideo}
            className="aspect-[8/5] w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>
      </section>
    </Reveal>
  );
}
