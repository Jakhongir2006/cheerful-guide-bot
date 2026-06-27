import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type LightboxState = { images: string[]; index: number } | null;
type Ctx = { open: (images: string[], index?: number) => void };
const LightboxCtx = createContext<Ctx>({ open: () => {} });

export const useLightbox = () => useContext(LightboxCtx);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LightboxState>(null);
  const touchStart = useRef<number | null>(null);

  const open = useCallback((images: string[], index = 0) => setState({ images, index }), []);
  const close = useCallback(() => setState(null), []);
  const next = useCallback(
    () => setState((s) => (s ? { ...s, index: (s.index + 1) % s.images.length } : s)),
    [],
  );
  const prev = useCallback(
    () => setState((s) => (s ? { ...s, index: (s.index - 1 + s.images.length) % s.images.length } : s)),
    [],
  );

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [state, close, next, prev]);

  return (
    <LightboxCtx.Provider value={{ open }}>
      {children}
      {state && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={close}
          onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStart.current == null) return;
            const dx = e.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
            touchStart.current = null;
          }}
        >
          <button
            aria-label="Close"
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          {state.images.length > 1 && (
            <>
              <button
                aria-label="Previous"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 md:left-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                aria-label="Next"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 md:right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                {state.index + 1} / {state.images.length}
              </div>
            </>
          )}
          <img
            src={state.images[state.index]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] max-w-[94vw] object-contain shadow-2xl"
          />
        </div>
      )}
    </LightboxCtx.Provider>
  );
}

export function Zimg({
  src,
  alt,
  gallery,
  index,
  className,
  loading = "lazy",
}: {
  src: string;
  alt?: string;
  gallery?: string[];
  index?: number;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const { open } = useLightbox();
  return (
    <img
      src={src}
      alt={alt || ""}
      loading={loading}
      decoding="async"
      onClick={() => open(gallery ?? [src], index ?? 0)}
      className={`afr-zoomable ${className ?? ""}`}
    />
  );
}