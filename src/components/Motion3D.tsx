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
    // Reduce JS-driven motion on small/touch devices — CSS animations remain.
    const isMobile =
      window.matchMedia("(max-width: 768px)").matches ||
      window.matchMedia("(hover: none)").matches;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    // Defer DOM mutation until AFTER React finishes hydrating and painting.
    // Mutating classes during hydration causes mismatch warnings and can
    // discard subtrees below the fold.
    const run = () => {
    const tiltSelector = [
      ".afr-tilt",
      "[data-tilt]",
      "button",
      "a[role='button']",
      ".rounded-xl.border", // shadcn Card
      "[class*='rounded-2xl']",
      "[class*='rounded-xl']:not(input):not(textarea)",
    ].join(",");

    const tiltEls = new Set<HTMLElement>();
    const attachTilt = (el: HTMLElement) => {
      if (isMobile) return;
      if (tiltEls.has(el)) return;
      // Skip tiny / form elements
      const tag = el.tagName.toLowerCase();
      if (["input", "textarea", "select", "label"].includes(tag)) return;
      tiltEls.add(el);
      el.classList.add("afr-tilt");
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const max = 6; // degrees
        el.style.setProperty("--ry", `${(px * max).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${(-py * max).toFixed(2)}deg`);
        el.style.setProperty("--tz", `6px`);
      };
      const onLeave = () => {
        el.style.setProperty("--rx", `0deg`);
        el.style.setProperty("--ry", `0deg`);
        el.style.setProperty("--tz", `0px`);
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      (el as any).__afrTiltCleanup = () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    };

    document.querySelectorAll<HTMLElement>(tiltSelector).forEach(attachTilt);

    // Depth on scroll
    const depthCandidates = document.querySelectorAll<HTMLElement>(
      "section > *, .rounded-xl.border, [class*='rounded-2xl'], img"
    );
    depthCandidates.forEach((el) => el.classList.add("afr-depth"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("afr-depth-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    depthCandidates.forEach((el) => io.observe(el));

    // Parallax — hero/background images move slower than scroll
    const parallaxEls: { el: HTMLElement; speed: number }[] = [];
    document
      .querySelectorAll<HTMLElement>("section:first-of-type img, [data-parallax]")
      .forEach((el) => {
        el.classList.add("afr-parallax");
        const speed = parseFloat(el.dataset.parallax || "0.15");
        parallaxEls.push({ el, speed });
      });
    let ticking = false;
    const onScroll = () => {
      if (isMobile) return;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        parallaxEls.forEach(({ el, speed }) => {
          el.style.transform = `translate3d(0, ${(-y * speed).toFixed(1)}px, 0)`;
        });
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
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