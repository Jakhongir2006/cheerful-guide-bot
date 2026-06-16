import { LANGS, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={cn("flex items-center gap-1 rounded-full border border-border bg-card px-1 py-1", className)}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-label={l.label}
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition",
            lang === l.code
              ? "bg-primary text-primary-foreground"
              : "text-foreground/70 hover:text-primary",
          )}
        >
          <span aria-hidden>{l.flag}</span>
          <span className="hidden sm:inline">{l.label}</span>
        </button>
      ))}
    </div>
  );
}