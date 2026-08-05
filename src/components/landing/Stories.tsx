import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
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
  {
    name: "João Vila Luz | Energy Specialist",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    name: "India Oliveira | Sustainability Manager",
    quote:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    name: "Ana Jorge | HSE Manager",
    quote:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    name: "Vânia Agostinho | Data Center Security Specialist",
    quote:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    name: "Carolina Goetz | Information Security Specialist",
    quote:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
  },
  {
    name: "Juliana Mizumoto | Head of Bid Management",
    quote:
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
  },
  {
    name: "Margarida Paredes | Procurement Manager",
    quote:
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
  },
];

export function Stories() {
  const [showAll, setShowAll] = useState(false);
  const visibleStories = showAll ? stories : stories.slice(0, 3);

  return (
    <Reveal>
      <section id="stories">
        <h2 className="text-center text-3xl font-bold text-foreground sm:text-[36px]">
          Stories from the inside
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {visibleStories.map((story, index) => (
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
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="press-feedback inline-flex h-14 items-center gap-2 rounded-[10px] bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {showAll ? "Show fewer episodes" : "Show all episodes"}
            {showAll ? (
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </section>
    </Reveal>
  );
}

