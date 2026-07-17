import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

// One shared IntersectionObserver for every <Reveal>. Cheaper than N observers
// and lets us tune rootMargin in one place.
type RevealCb = () => void;
let sharedIO: IntersectionObserver | null = null;
const cbMap = new WeakMap<Element, RevealCb>();
function getIO() {
  if (typeof window === "undefined") return null;
  if (sharedIO) return sharedIO;
  sharedIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const cb = cbMap.get(e.target);
          if (cb) cb();
          sharedIO!.unobserve(e.target);
          cbMap.delete(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  return sharedIO;
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: As = "div",
  variant = "up",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: any;
  variant?: "up" | "fade" | "scale" | "left" | "right";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current || shown) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(true); return; }
    const el = ref.current;
    const io = getIO();
    if (!io) { setShown(true); return; }
    cbMap.set(el, () => setShown(true));
    io.observe(el);
    return () => { io.unobserve(el); cbMap.delete(el); };
  }, [shown]);
  const style: CSSProperties = { animationDelay: `${delay}ms` };
  return (
    <As ref={ref} style={style} className={`afr-reveal afr-reveal-${variant} ${shown ? "afr-in" : ""} ${className}`}>
      {children}
    </As>
  );
}

export function CountUp({ value, suffix = "", duration = 1200 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [n, setN] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);
  return <span ref={ref}>{n}{suffix}</span>;
}