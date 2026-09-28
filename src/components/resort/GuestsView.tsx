import { useState } from "react";
import {
  Award,
  Crown,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  Search,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Guest } from "./types";

interface GuestsViewProps {
  guests: Guest[];
  onSelectGuest: (guest: Guest) => void;
}

export function GuestsView({ guests, onSelectGuest }: GuestsViewProps) {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("All");

  const tiers = ["All", "Platinum", "Gold", "Silver"];

  const filtered = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.country.toLowerCase().includes(search.toLowerCase()) ||
      g.email.toLowerCase().includes(search.toLowerCase());
    const matchesTier = tierFilter === "All" || g.loyaltyTier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      {/* Header section with Module Accent: Champagne + Deep Ocean */}
      <section className="rise flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--champagne)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--champagne)]">
              Guest Relations & VIP Profiles
            </p>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">
            VIP Guest Registry
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Curated guest preferences, loyalty status, personalized stay notes, and concierge communications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="gold" className="px-3 py-1 text-xs">
            <Crown className="mr-1 size-3.5" />
            {guests.filter((g) => g.loyaltyTier === "Platinum").length} Platinum Members In-House
          </Badge>
        </div>
      </section>

      {/* Search & Loyalty Filter Bar */}
      <section className="resort-card p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by VIP name, home country, or email…"
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-[var(--champagne)] focus:ring-2 focus:ring-[var(--champagne)]/15"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tier:
            </span>
            {tiers.map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  tierFilter === t
                    ? "border border-[var(--champagne)] bg-[var(--champagne)] text-black shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Guest Profile Cards */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((g) => (
          <article
            key={g.id}
            className="resort-card group relative flex flex-col justify-between p-5"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full border border-[var(--champagne)]/40 bg-[var(--gold-soft)] font-display text-base font-bold text-[var(--champagne)]">
                    {g.avatar}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {g.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3 text-[var(--champagne)]" />
                      <span>{g.country}</span>
                    </div>
                  </div>
                </div>

                <Badge
                  variant={
                    g.loyaltyTier === "Platinum"
                      ? "gold"
                      : g.loyaltyTier === "Gold"
                      ? "sunset"
                      : "sage"
                  }
                >
                  {g.loyaltyTier}
                </Badge>
              </div>

              {/* Residence & Stays Metrics */}
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg border border-border/70 bg-accent/40 p-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground">Stay Status</span>
                  <p className="font-medium text-foreground">{g.status}</p>
                  {g.currentRoom && (
                    <p className="mt-0.5 text-[11px] text-[var(--champagne)]">{g.currentRoom}</p>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground">Lifetime Folio</span>
                  <p className="font-medium text-foreground">{g.totalSpent}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{g.totalStays} Stays at Resort</p>
                </div>
              </div>

              {/* Bespoke Preferences */}
              <div className="mt-3.5 text-xs">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--champagne)]">
                  VIP Stay Preferences:
                </span>
                <p className="mt-1 leading-relaxed text-muted-foreground">
                  {g.preferences}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3">
              <span className="font-mono text-[11px] text-muted-foreground">{g.email}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelectGuest(g)}
                className="h-7 border-border text-xs"
              >
                Folio Details
              </Button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
