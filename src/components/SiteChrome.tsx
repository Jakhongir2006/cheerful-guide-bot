import { useEffect, useState } from "react";
import { useRouterState, Outlet } from "@tanstack/react-router";
import { BookingDialog } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

/** Thin accent scroll-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent">
      <div
        className="h-full bg-accent transition-[width] duration-150 ease-out"
        style={{ width: `${(p * 100).toFixed(2)}%` }}
      />
    </div>
  );
}

/** Slim floating Book Now that fades in after the hero. Hidden on very small screens where the header CTA is already visible. */
export function StickyBookBar() {
  const t = useT();
  const [show, setShow] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setShow(window.scrollY > Math.max(320, window.innerHeight * 0.55));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      aria-hidden={!show}
      className={`pointer-events-none fixed bottom-4 right-4 z-[55] transition-all duration-500 ${
        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="pointer-events-auto">
        <BookingDialog
          trigger={
            <Button
              size="lg"
              className="afr-cta rounded-full bg-accent px-6 text-accent-foreground shadow-2xl shadow-accent/30 hover:bg-accent/90"
            >
              {t("cta_book")}
            </Button>
          }
        />
      </div>
    </div>
  );
}

/** Fades / lifts the current route on navigation. Keyed on pathname so React remounts on route change. */
export function PageFade() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div key={pathname} className="afr-page-in">
      <Outlet />
    </div>
  );
}