import { ArrowRight } from "lucide-react";
import story1 from "@/assets/story1.jpg.asset.json";
import story2 from "@/assets/story2.jpg.asset.json";
import story3 from "@/assets/story3.jpg.asset.json";
import { PlayIcon } from "./Logos";

const stories = [
  {
    image: story1.url,
    name: "Márcio Reis | Site Operations Manager",
    quote:
      "Keeping a data center running isn't about reacting to problems - it's about making sure they never happen in the first place.",
  },
  {
    image: story2.url,
    name: "Luís Marques | Senior Project Manager",
    quote:
      "Before anything goes live, every system is tested, validated and pushed to its limits - because failure is not an option.",
  },
  {
    image: story3.url,
    name: "Francisca Meneses | Program Manager",
    quote:
      "Between the first idea and the final build, there's a complex process of planning, coordination and decisions that shape everything that follows.",
  },
];

export function Stories() {
  return (
    <section id="stories">
      <h2 className="text-center text-3xl font-bold text-foreground sm:text-[36px]">
        Stories from the inside
      </h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {stories.map((story) => (
          <article
            key={story.name}
            className="flex flex-col overflow-hidden rounded-[10px] bg-card"
          >
            <div className="relative">
              <img
                src={story.image}
                alt={story.name}
                width={800}
                height={600}
                loading="lazy"
                className="h-52 w-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-teal/70 to-transparent"
                aria-hidden="true"
              />
              <PlayIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-base font-bold text-card-foreground">{story.name}</h3>
              <p className="mt-3 flex-1 text-sm font-light italic leading-relaxed text-card-foreground/80">
                {story.quote}
              </p>
              <a
                href="#stories"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                Watch Story <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}