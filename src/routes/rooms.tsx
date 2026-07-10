import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Rooms } from "@/components/sections";

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: "Rooms & Suites — Afrosiyob Regency Hotel Tashkent" },
      { name: "description", content: "Standard, Superior, Deluxe and Suite rooms at Afrosiyob Regency Tashkent. Compare room types, sizes and beds. Book directly for best rates." },
      { property: "og:title", content: "Rooms & Suites — Afrosiyob Regency Hotel Tashkent" },
      { property: "og:description", content: "Standard, Superior, Deluxe and Suite rooms at Afrosiyob Regency Tashkent. Compare room types, sizes and beds. Book directly for best rates." },
      { property: "og:url", content: "https://afrosiyobregency.com/rooms" },
    ],
    links: [{ rel: "canonical", href: "https://afrosiyobregency.com/rooms" }],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell>
      <Rooms />
    </PageShell>
  );
}
