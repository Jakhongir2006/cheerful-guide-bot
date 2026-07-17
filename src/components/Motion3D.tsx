import { useEffect } from "react";

/**
 * Global, content-preserving 3D motion enhancer.
 * - Adds tilt to cards & buttons on hover (mouse parallax)
 * - Adds scroll-triggered depth scale-in
 * - Adds gentle parallax to backgrounds/images marked or auto-detected
 */
export function Motion3D() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    // Skip all JS motion on touch / small screens — CSS animations still run.
    const isMobile =
      window.matchMedia("(max-width: 900px)").matches ||
      window.matchMedia("(hover: none)").matches;
    if (isMobile) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const run = () => {
      // Opt-in tilt: only elements marked [data-tilt] or .afr-tilt.
      // Attaching mousemove to every button/card is the #1 cause of scroll jank.
      const tiltEls: HTMLElement[] = [];
      const attachTilt = (el: HTMLElement) => {
        if (el.closest("form") || el.closest("[data-no-motion]")) return;
        tiltEls.push(el);
        el.classList.add("afr-tilt");
        let rafId = 0;
        let nextX = 0, nextY = 0;
        const flush = () => {
          rafId = 0;
          el.style.setProperty("--ry", `${nextX.toFixed(2)}deg`);
          el.style.setProperty("--rx", `${(-nextY).toFixed(2)}deg`);
          el.style.setProperty("--tz", `6px`);
        };
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const max = 5;
          nextX = ((e.clientX - r.left) / r.width - 0.5) * max;
          nextY = ((e.clientY - r.top) / r.height - 0.5) * max;
          if (!rafId) rafId = requestAnimationFrame(flush);
        };
        const onLeave = () => {
          if (rafId) cancelAnimationFrame(rafId), (rafId = 0);
          el.style.setProperty("--rx", `0deg`);
          el.style.setProperty("--ry", `0deg`);
          el.style.setProperty("--tz", `0px`);
        };
        el.addEventListener("mousemove", onMove, { passive: true });
        el.addEventListener("mouseleave", onLeave);
        (el as any).__afrTiltCleanup = () => {
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseleave", onLeave);
          if (rafId) cancelAnimationFrame(rafId);
        };
      };
      document
        .querySelectorAll<HTMLElement>("[data-tilt], .afr-tilt")
        .forEach(attachTilt);

      // Parallax — opt-in via [data-parallax="0.15"], rAF-throttled.
      const parallaxEls: { el: HTMLElement; speed: number }[] = [];
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        el.classList.add("afr-parallax");
        parallaxEls.push({ el, speed: parseFloat(el.dataset.parallax || "0.15") });
      });
      let ticking = false;
      const onScroll = () => {
        if (ticking || !parallaxEls.length) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          for (const { el, speed } of parallaxEls) {
            el.style.transform = `translate3d(0, ${(-y * speed).toFixed(1)}px, 0)`;
          }
          ticking = false;
        });
      };
      if (parallaxEls.length) {
        window.addEventListener("scroll", onScroll, { passive: true });
      }

      return () => {
        window.removeEventListener("scroll", onScroll);
        tiltEls.forEach((el) => (el as any).__afrTiltCleanup?.());
      };
    };

    const start = () => {
      if (cancelled) return;
      cleanup = run();
    };
    const idle: any = (window as any).requestIdleCallback;
    const handle: any = idle ? idle(start, { timeout: 800 }) : window.setTimeout(start, 250);

    return () => {
      cancelled = true;
      if (idle && (window as any).cancelIdleCallback) {
        (window as any).cancelIdleCallback(handle);
      } else {
        window.clearTimeout(handle);
      }
      cleanup?.();
    };
  }, []);

  return null;
}