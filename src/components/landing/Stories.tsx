import { ArrowRight } from "lucide-react";
import { PlayIcon } from "./Logos";
import { Reveal } from "./Reveal";

const stories = [
  {
    name: "Márcio Reis | Site Operations Manager",
    quote:
      "Keeping a data center running isn't about reacting to problems - it's about making sure they never happen in the first place.",
  },
  {
    name: "Luís Marques | Senior Project Manager",
    quote:
      "Before anything goes live, every system is tested, validated and pushed to its limits - because failure is not an option.",
  },
  {
    name: "Francisca Meneses | Program Manager",
    quote:
      "Between the first idea and the final build, there's a complex process of planning, coordination and decisions that shape everything that follows.",
  },
];

export function Stories() {
  return (
    <Reveal>
      <section id="stories">
        <h2 className="text-center text-3xl font-bold text-foreground sm:text-[36px]">
          Stories from the inside
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {stories.map((story, index) => (
            <Reveal key={story.name} variant="item" delay={index * 70}>
              <article className="story-card flex flex-col overflow-hidden rounded-[10px] bg-card">
                <div className="relative overflow-hidden">
                  <div aria-hidden="true" className="story-thumb h-52 w-full bg-neutral-800" />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-teal/70 to-transparent"
                    aria-hidden="true"
                  />
                  <PlayIcon className="story-play absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-base font-bold text-card-foreground">{story.name}</h3>
                  <p className="mt-3 flex-1 text-sm font-light italic leading-relaxed text-card-foreground/80">
                    {story.quote}
                  </p>
                  <a
                    href="#stories"
                    className="story-link press-feedback -mb-3 mt-3 inline-flex items-center gap-2 py-3 text-sm font-semibold text-primary"
                  >
                    <span className="story-link-text">Watch Story</span>
                    <ArrowRight className="story-arrow h-4 w-4" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
