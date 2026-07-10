import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Location } from "@/components/sections";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Contacts & Location — Afrosiyob Regency Hotel Tashkent" },
      { name: "description", content: "Address, phone and directions to Afrosiyob Regency Hotel in Tashkent — 1 km from Tashkent International Airport." },
      { property: "og:title", content: "Contacts & Location — Afrosiyob Regency Hotel Tashkent" },
      { property: "og:description", content: "Address, phone and directions to Afrosiyob Regency Hotel in Tashkent — 1 km from Tashkent International Airport." },
      { property: "og:url", content: "https://afrosiyobregency.com/contacts" },
    ],
    links: [{ rel: "canonical", href: "https://afrosiyobregency.com/contacts" }],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell>
      <Location />
    </PageShell>
  );
}
