"use client";

import { Bell, Search, Menu, Trophy, Star } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useUIStore } from "@/store/useUIStore";
import { useUserStore } from "@/store/useUserStore";

export function Topbar() {
  const { toggleMobileNav, setCommandPaletteOpen } = useUIStore();
  const { level, rank, xp } = useUserStore();

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setCommandPaletteOpen(true);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:h-[60px]">
      <button 
        onClick={toggleMobileNav}
        className="md:hidden text-muted-foreground hover:text-foreground p-1 rounded-md"
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </button>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {/* Search Bar - acts as trigger for Command Palette */}
        <div className="ml-auto flex-1 sm:flex-initial" onClick={handleSearchClick}>
          <div className="relative group cursor-pointer">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <div className="w-full flex items-center justify-between rounded-full border border-border bg-card/50 px-9 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-card sm:w-[300px] md:w-[200px] lg:w-[300px]">
              <span className="hidden sm:inline">Search everything...</span>
              <span className="sm:hidden">Search...</span>
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>

        {/* Gamification Stats (Hidden on very small screens) */}
        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full border border-border/50 bg-card/30">
          <div className="flex flex-col items-end leading-none">
            <span className="text-xs font-bold text-primary">{rank}</span>
            <span className="text-[10px] text-muted-foreground">{xp} XP</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-sm border-2 border-background">
            <span className="text-xs font-black">{level}</span>
          </div>
        </div>

        <button className="relative inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger"></span>
          <span className="sr-only">Toggle notifications</span>
        </button>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
