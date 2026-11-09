import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Spa } from "@/components/sections";

export const Route = createFileRoute("/spa")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Spa, Pool & Fitness — Afrosiyob Regency Hotel Tashkent" },
      { name: "description", content: "Indoor swimming pool, fitness center, hammam, sauna and massage at Afrosiyob Regency spa in Tashkent." },
      { property: "og:title", content: "Spa, Pool & Fitness — Afrosiyob Regency Hotel Tashkent" },
      { property: "og:description", content: "Indoor swimming pool, fitness center, hammam, sauna and massage at Afrosiyob Regency spa in Tashkent." },
      { property: "og:url", content: "https://afrosiyobregency.com/spa" },
    ],
    links: [{ rel: "canonical", href: "https://afrosiyobregency.com/spa" }],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell>
      <Spa />
    </PageShell>
  );
}
