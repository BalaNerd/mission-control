import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommandPalette } from "@/components/CommandPalette";
import { MobileBottomNav } from "@/components/layout/mobile-nav";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden relative">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-4 w-full flex-1 max-w-full overflow-hidden">
        <Topbar />
        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 rounded-tl-xl border-l border-t border-border/50 bg-card/30 backdrop-blur-3xl shadow-inner min-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar relative z-10 pb-20 md:pb-4">
          {children}
        </main>
      </div>
      <MobileBottomNav />
      <CommandPalette />
    </div>
  );
}
