import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Restaurant } from "@/components/sections";

export const Route = createFileRoute("/restaurant")({
  head: () => ({
    meta: [
      { title: "Ko'hna Restaurant — Afrosiyob Regency Hotel Tashkent" },
      { name: "description", content: "Breakfast, business lunches, banquets and room service at Ko'hna restaurant inside Afrosiyob Regency Hotel Tashkent." },
      { property: "og:title", content: "Ko'hna Restaurant — Afrosiyob Regency Hotel Tashkent" },
      { property: "og:description", content: "Breakfast, business lunches, banquets and room service at Ko'hna restaurant inside Afrosiyob Regency Hotel Tashkent." },
      { property: "og:url", content: "https://afrosiyobregency.com/restaurant" },
    ],
    links: [{ rel: "canonical", href: "https://afrosiyobregency.com/restaurant" }],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell>
      <Restaurant />
    </PageShell>
  );
}
