import { type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { LightboxProvider } from "@/components/Lightbox";
import { Header, Footer } from "@/components/sections";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <LightboxProvider>
      <div className="min-h-screen bg-background font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster richColors position="top-center" />
      </div>
    </LightboxProvider>
  );
}
