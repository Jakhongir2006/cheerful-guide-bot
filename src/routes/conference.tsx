import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Conference } from "@/components/sections";

export const Route = createFileRoute("/conference")({
  head: () => ({
    meta: [
      { title: "Conference Halls in Tashkent — Afrosiyob Regency" },
      { name: "description", content: "Three modern conference halls — Shakhrisabz, Nasaf and Afrosiyob — for business events, meetings and conferences in Tashkent." },
      { property: "og:title", content: "Conference Halls in Tashkent — Afrosiyob Regency" },
      { property: "og:description", content: "Three modern conference halls — Shakhrisabz, Nasaf and Afrosiyob — for business events, meetings and conferences in Tashkent." },
      { property: "og:url", content: "https://afrosiyobregency.com/conference" },
    ],
    links: [{ rel: "canonical", href: "https://afrosiyobregency.com/conference" }],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell>
      <Conference />
    </PageShell>
  );
}
