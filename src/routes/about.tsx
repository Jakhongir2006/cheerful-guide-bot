import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { About } from "@/components/sections";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Afrosiyob Regency Hotel Tashkent — 4★ Business Hotel" },
      { name: "description", content: "Discover Afrosiyob Regency — a modern 4-star business hotel in Tashkent, 1 km from the international airport, with 100 rooms and premium amenities." },
      { property: "og:title", content: "About Afrosiyob Regency Hotel Tashkent — 4★ Business Hotel" },
      { property: "og:description", content: "Discover Afrosiyob Regency — a modern 4-star business hotel in Tashkent, 1 km from the international airport, with 100 rooms and premium amenities." },
      { property: "og:url", content: "https://afrosiyobregency.com/about" },
    ],
    links: [{ rel: "canonical", href: "https://afrosiyobregency.com/about" }],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell>
      <About />
    </PageShell>
  );
}
