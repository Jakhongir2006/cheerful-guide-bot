import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { LightboxProvider } from "@/components/Lightbox";
import {
  Header,
  Hero,
  Stats,
  About,
  Rooms,
  Conference,
  Spa,
  Restaurant,
  Why,
  Location,
  Footer,
} from "@/components/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Afrosiyob Regency Hotel Tashkent — 4★ Business Hotel | Отель в Ташкенте" },
      { name: "description", content: "Забронируйте номер в 4★ бизнес-отеле Afrosiyob Regency в Ташкенте: 100 номеров, конференц-залы, СПА, бассейн и ресторан Ko'hna. 1 км от аэропорта." },
      { property: "og:title", content: "Afrosiyob Regency Hotel Tashkent — 4★ Business Hotel" },
      { property: "og:description", content: "4-star business hotel in Tashkent with 100 rooms, conference halls, spa and restaurant." },
      { property: "og:url", content: "https://afrosiyobregency.com/" },
    ],
    links: [{ rel: "canonical", href: "https://afrosiyobregency.com/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <LightboxProvider>
      <div className="min-h-screen bg-background font-sans">
        <Header />
        <main>
          <Hero />
          <Stats />
          <About />
          <Rooms />
          <Conference />
          <Spa />
          <Restaurant />
          <Why />
          <Location />
        </main>
        <Footer />
        <Toaster richColors position="top-center" />
      </div>
    </LightboxProvider>
  );
}
