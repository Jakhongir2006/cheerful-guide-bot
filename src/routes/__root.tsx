import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { I18nProvider } from "@/lib/i18n";
import { Motion3D } from "@/components/Motion3D";
import { ScrollProgress, StickyBookBar, PageFade } from "@/components/SiteChrome";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Afrosiyob Regency Hotel Tashkent — 4★ Business Hotel | Отель в Ташкенте" },
      { name: "description", content: "Book Afrosiyob Regency Hotel Tashkent — 4-star business hotel with 100 rooms, conference halls, spa & restaurant. Забронируйте номер в 4★ бизнес-отеле в Ташкенте: спа, рестораны, конференц-залы." },
      { name: "keywords", content: "Afrosiyob Regency, отель Ташкент, hotel Tashkent, бизнес отель Ташкент, конференц зал Ташкент, спа Ташкент, забронировать отель Ташкент, 4 star hotel Tashkent, booking Tashkent" },
      { property: "og:title", content: "Afrosiyob Regency Hotel Tashkent — 4★ Business Hotel" },
      { property: "og:description", content: "4-star business hotel in Tashkent with 100 rooms, conference halls, spa and restaurant. Book your stay at Afrosiyob Regency." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://afrosiyobregency.com/" },
      { property: "og:site_name", content: "Afrosiyob Regency Hotel" },
      { property: "og:image", content: "https://loquacious-stroopwafel-814d5f.netlify.app/t6.jpg" },
      { property: "og:image:alt", content: "Afrosiyob Regency Hotel Tashkent" },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "ru_RU" },
      { property: "og:locale:alternate", content: "uz_UZ" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Afrosiyob Regency Hotel Tashkent — 4★ Business Hotel" },
      { name: "twitter:description", content: "4-star business hotel in Tashkent with 100 rooms, conference halls, spa and restaurant." },
      { name: "twitter:image", content: "https://loquacious-stroopwafel-814d5f.netlify.app/t6.jpg" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.png" },
      { rel: "shortcut icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "canonical", href: "https://afrosiyobregency.com/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Hotel",
          name: "Afrosiyob Regency Hotel",
          description:
            "4-star business hotel in Tashkent with 100 rooms, conference halls, spa and restaurant.",
          url: "https://afrosiyobregency.com/",
          telephone: "+998 71 200 00 00",
          image: "https://loquacious-stroopwafel-814d5f.netlify.app/t6.jpg",
          starRating: { "@type": "Rating", ratingValue: "4" },
          priceRange: "$$-$$$",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Amir Temur Avenue",
            addressLocality: "Tashkent",
            addressCountry: "UZ",
          },
          amenityFeature: [
            { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi", value: true },
            { "@type": "LocationFeatureSpecification", name: "Spa", value: true },
            { "@type": "LocationFeatureSpecification", name: "Fitness center", value: true },
            { "@type": "LocationFeatureSpecification", name: "Swimming pool", value: true },
            { "@type": "LocationFeatureSpecification", name: "Restaurant", value: true },
            { "@type": "LocationFeatureSpecification", name: "Conference halls", value: true },
            { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
            { "@type": "LocationFeatureSpecification", name: "Airport shuttle", value: true },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <Motion3D />
        <ScrollProgress />
        {/* Required: nested routes render here through PageFade -> Outlet. */}
        <PageFade />
        <StickyBookBar />
      </I18nProvider>
    </QueryClientProvider>
  );
}
