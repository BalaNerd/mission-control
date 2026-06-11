"use client";

import { useState } from "react";
import { 
  User, Palette, Bell, BookOpen, GraduationCap, Smartphone, 
  Database, HardDriveUpload, Info, Code 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/useSettingsStore";

const SETTING_TABS = [
  { id: 'general', label: 'General', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'study', label: 'Study Preferences', icon: BookOpen },
  { id: 'exam', label: 'Exam Preferences', icon: GraduationCap },
  { id: 'mobile', label: 'Mobile Settings', icon: Smartphone },
  { id: 'data', label: 'Data Management', icon: Database },
  { id: 'backup', label: 'Backup & Restore', icon: HardDriveUpload },
  { id: 'about', label: 'About', icon: Info },
  { id: 'dev', label: 'Developer Options', icon: Code },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const { username, theme, pomodoroWorkDuration, updateSettings } = useSettingsStore();

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your OS preferences and configurations.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 glass-card rounded-xl p-2 flex flex-col gap-1 overflow-y-auto custom-scrollbar border border-border/50 bg-card/30">
          {SETTING_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
                activeTab === tab.id 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card rounded-xl p-6 md:p-8 overflow-y-auto custom-scrollbar border border-border/50 bg-card/50">
          
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b border-border pb-2">General Settings</h2>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => updateSettings({ username: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b border-border pb-2">Appearance</h2>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Theme toggle is available in the top bar. More color options coming soon.</p>
              </div>
            </div>
          )}

          {activeTab === 'study' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b border-border pb-2">Study Preferences</h2>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pomodoro Work Duration (minutes)</label>
                  <input 
                    type="number" 
                    value={pomodoroWorkDuration}
                    onChange={(e) => updateSettings({ pomodoroWorkDuration: parseInt(e.target.value) || 25 })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b border-border pb-2">Backup & Restore</h2>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">Export all your OS data including tasks, notes, habits, and files to a single JSON archive.</p>
                <div className="flex gap-4">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                    Export Data
                  </button>
                  <button className="px-4 py-2 border border-border bg-background text-foreground rounded-md text-sm font-medium hover:bg-accent transition-colors">
                    Import Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Catch-all for unimplemented tabs */}
          {['notifications', 'exam', 'mobile', 'data', 'about', 'dev'].includes(activeTab) && (
            <div className="space-y-6 h-full flex flex-col">
              <h2 className="text-xl font-bold border-b border-border pb-2">
                {SETTING_TABS.find(t => t.id === activeTab)?.label}
              </h2>
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>This section is being built for the V2 release.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}