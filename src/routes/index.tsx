import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/landing/Hero";
import { Initiative } from "@/components/landing/Initiative";
import { Stories } from "@/components/landing/Stories";
import { LifeInside } from "@/components/landing/LifeInside";
import { StandOut } from "@/components/landing/StandOut";
import { FinalCta } from "@/components/landing/FinalCta";
import { SiteFooter } from "@/components/landing/SiteFooter";

const title = "Start Inside Out | Start Campus";
const description =
  "Go inside Start Campus, a 1.2GW hyperscale data centre campus, through the teams who run it every day.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Index() {
  return (
    <main className="mx-auto w-full max-w-[1152px] px-4 py-6 sm:px-6 sm:py-8">
      <div className="space-y-12 sm:space-y-20 lg:space-y-28">
        <Hero />
        <Initiative />
        <Stories />
        <LifeInside />
        <StandOut />
        <FinalCta />
      </div>
      <SiteFooter />
    </main>
  );
}
