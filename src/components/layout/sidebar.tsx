"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BookOpen,
  Target,
  Trophy,
  Activity,
  Settings,
  BookMarked,
  Layers,
  GraduationCap,
  History,
  FileText,
  BrainCircuit,
  AlertOctagon,
  Shield
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "My Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Knowledge Vault", href: "/notes", icon: BookOpen },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Habits", href: "/habits", icon: Activity },
  { name: "Analytics", href: "/analytics", icon: Trophy },
  { name: "OS Operator", href: "/profile", icon: Shield },
];

const EXAM_ITEMS = [
  { name: "PYQ Vault", href: "/exams/pyq", icon: History },
  { name: "Flashcards", href: "/flashcards", icon: BrainCircuit },
  { name: "Mistake Notebook", href: "/mistakes", icon: AlertOctagon },
  { name: "Mock Tests", href: "/exams/mocks", icon: FileText },
  { name: "CDS Tracker", href: "/exams/cds", icon: GraduationCap },
  { name: "AFCAT Tracker", href: "/exams/afcat", icon: Layers },
];

import { useUIStore } from "@/store/useUIStore";
import { X } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const renderNavItems = (items: typeof NAV_ITEMS, onClick?: () => void) => {
    return items.map((item) => {
      const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`) && item.href !== "/";
      return (
        <Link
          key={item.name}
          href={item.href}
          onClick={onClick}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
          {item.name}
        </Link>
      );
    });
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden border-r border-border bg-card/50 backdrop-blur-xl md:block md:w-64 lg:w-72 flex-shrink-0 relative z-20">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-border px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <span className="text-white text-xs font-bold">M</span>
              </div>
              <span className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Mission Control
              </span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2 custom-scrollbar">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Overview
              </div>
              {renderNavItems(NAV_ITEMS)}
              
              <div className="mt-4 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Exam Prep
              </div>
              {renderNavItems(EXAM_ITEMS)}
            </nav>
          </div>
          <div className="mt-auto p-4 border-t border-border">
            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>
      <MobileSidebar renderNavItems={renderNavItems} />
    </>
  );
}

function MobileSidebar({ renderNavItems }: { renderNavItems: (items: typeof NAV_ITEMS, onClick: () => void) => React.ReactNode }) {
  const { isMobileNavOpen, setMobileNavOpen } = useUIStore();

  if (!isMobileNavOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
      <div className="relative w-3/4 max-w-sm flex-1 bg-card border-r border-border shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between h-14 border-b border-border px-4">
            <Link href="/" onClick={() => setMobileNavOpen(false)} className="flex items-center gap-2 font-semibold">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <span className="text-white text-xs font-bold">M</span>
              </div>
              <span className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Mission
              </span>
            </Link>
            <button onClick={() => setMobileNavOpen(false)} className="p-2 -mr-2 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid items-start px-2 text-sm font-medium gap-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Overview</div>
              {renderNavItems(NAV_ITEMS, () => setMobileNavOpen(false))}
              <div className="mt-4 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exam Prep</div>
              {renderNavItems(EXAM_ITEMS, () => setMobileNavOpen(false))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
