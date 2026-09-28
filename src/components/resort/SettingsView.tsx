import { useState } from "react";
import {
  Bell,
  Clock,
  Compass,
  Globe,
  Lock,
  MoonStar,
  Save,
  ShieldCheck,
  Sparkles,
  SunMedium,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SettingsViewProps {
  currentRole: string;
  onChangeRole: (role: string) => void;
  theme: "day" | "night";
  onToggleTheme: () => void;
}

export function SettingsView({
  currentRole,
  onChangeRole,
  theme,
  onToggleTheme,
}: SettingsViewProps) {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const roles = [
    {
      id: "General Manager",
      title: "General Manager (Amol)",
      desc: "Full administrative governance, financial auditing, VIP folio approvals, staff dispatch",
    },
    {
      id: "Front Desk Lead",
      title: "Front Desk & Concierge Lead",
      desc: "Check-in/out authorization, room allocation, guest preferences, airport transfers",
    },
    {
      id: "F&B Director",
      title: "Food & Beverage Director",
      desc: "Dining table reservations, Sommelier cellar orders, kitchen ticket queues, event banquets",
    },
    {
      id: "Executive Housekeeper",
      title: "Executive Housekeeper",
      desc: "Turn-down scheduling, QA inspection passes, linen inventory, priority sanitization",
    },
  ];

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rise flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--champagne)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--champagne)]">
              Resort Administration & System Preferences
            </p>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">
            System & Property Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Role permission controls, operational timing, resort policy configurations, and theme settings.
          </p>
        </div>

        <Button
          onClick={handleSave}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Save className="size-4" />
          {saveSuccess ? "Preferences Saved" : "Save Changes"}
        </Button>
      </section>

      {/* Role Switcher */}
      <section className="resort-card p-6">
        <div className="flex items-center justify-between border-b border-border/70 pb-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              Operational Role & Permissions
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Switch role context to test various hotel department capabilities
            </p>
          </div>
          <Badge variant="gold">Active: {currentRole}</Badge>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {roles.map((r) => (
            <div
              key={r.id}
              onClick={() => onChangeRole(r.id)}
              className={`cursor-pointer rounded-lg border p-4 transition-all ${
                currentRole === r.id
                  ? "border-[var(--champagne)] bg-[var(--champagne)]/10 shadow-[var(--glow-gold)]"
                  : "border-border bg-accent/40 hover:border-border/80 hover:bg-accent"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-foreground">
                  {r.title}
                </h3>
                {currentRole === r.id && (
                  <span className="size-2 rounded-full bg-[var(--champagne)]" />
                )}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Resort Atmosphere Theme & Policies */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Theme Settings */}
        <article className="resort-card p-6">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Resort Atmosphere Theme
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Atmospheric day to evening transition (700–1200ms smooth visual shift)
          </p>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-accent/40 p-3.5">
              <div className="flex items-center gap-3">
                <SunMedium className="size-5 text-[var(--champagne)]" />
                <div>
                  <p className="font-medium text-foreground">Golden Sunrise (Day)</p>
                  <p className="text-xs text-muted-foreground">
                    Ivory + Deep Ocean + Sage + Champagne
                  </p>
                </div>
              </div>
              <Badge variant={theme === "day" ? "gold" : "outline"}>
                {theme === "day" ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-accent/40 p-3.5">
              <div className="flex items-center gap-3">
                <MoonStar className="size-5 text-[var(--sunset)]" />
                <div>
                  <p className="font-medium text-foreground">Luxury Sunset (Night)</p>
                  <p className="text-xs text-muted-foreground">
                    Midnight Navy + Deep Blue + Sunset Orange
                  </p>
                </div>
              </div>
              <Badge variant={theme === "night" ? "sunset" : "outline"}>
                {theme === "night" ? "Active" : "Inactive"}
              </Badge>
            </div>

            <Button
              variant="outline"
              onClick={onToggleTheme}
              className="w-full border-border text-xs"
            >
              Toggle Atmosphere ({theme === "day" ? "Switch to Night" : "Switch to Day"})
            </Button>
          </div>
        </article>

        {/* Operational Hours */}
        <article className="resort-card p-6">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Operational Policies & Timers
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Standard 5-star hospitality check-in and checkout benchmarks
          </p>

          <div className="mt-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-muted-foreground">Check-in Standard Hour:</span>
              <span className="font-mono font-semibold text-foreground">14:00 PM</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-muted-foreground">Check-out Standard Hour:</span>
              <span className="font-mono font-semibold text-foreground">11:00 AM</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-muted-foreground">Sunset Terrace Seating:</span>
              <span className="font-mono font-semibold text-foreground">18:30 — 23:30</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-muted-foreground">Beach Club Loungers:</span>
              <span className="font-mono font-semibold text-foreground">06:00 — 19:00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Night Audit Auto-Run:</span>
              <span className="font-mono font-semibold text-[var(--sage)]">
                Completed at 03:00 AM
              </span>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
