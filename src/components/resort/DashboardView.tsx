import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  BedDouble,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Compass,
  Download,
  Gem,
  Plus,
  Shell,
  Sparkles,
  SunMedium,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Booking, Room } from "./types";
import { CasinoSlotNumber } from "./CasinoSlotNumber";
import { useCasino } from "./CasinoControl";
import villaPool from "@/assets/coastal-villa-pool.jpg";
import resortDay from "@/assets/coastal-resort-day.jpg";

interface DashboardViewProps {
  bookings: Booking[];
  rooms: Room[];
  theme: "day" | "night";
  onNewBooking: () => void;
  onNavigateTab: (tab: any) => void;
  onSelectBooking: (booking: Booking) => void;
}

const revenueData = [
  { month: "Apr", thisYear: 18.2, lastYear: 14.6 },
  { month: "May", thisYear: 22.4, lastYear: 17.8 },
  { month: "Jun", thisYear: 24.1, lastYear: 19.9 },
  { month: "Jul", thisYear: 28.6, lastYear: 22.4 },
  { month: "Aug", thisYear: 32.2, lastYear: 25.8 },
  { month: "Sep", thisYear: 38.4, lastYear: 29.1 },
  { month: "Oct (Proj)", thisYear: 42.0, lastYear: 33.3 },
];

export function DashboardView({
  bookings,
  rooms,
  theme,
  onNewBooking,
  onNavigateTab,
  onSelectBooking,
}: DashboardViewProps) {
  const { spinKey } = useCasino();
  const occupiedRooms = rooms.filter((r) => r.status === "Occupied").length;
  const occupancyRate = Math.round((occupiedRooms / rooms.length) * 100);

  const kpis = [
    {
      label: "Occupancy Rate",
      value: `${occupancyRate}%`,
      deltaValue: "+8.4%",
      deltaLabel: "vs last week",
      subtext: `${occupiedRooms} of ${rooms.length} suites occupied`,
      icon: Shell,
      accent: "text-[var(--champagne)]",
      badgeVariant: "gold" as const,
    },
    {
      label: "Arrivals Today",
      value: "18",
      deltaValue: "+4",
      deltaLabel: "VIP arrivals scheduled",
      subtext: "First landing at 12:30 PM",
      icon: SunMedium,
      accent: "text-[var(--sunset)]",
      badgeVariant: "sunset" as const,
    },
    {
      label: "Monthly Revenue",
      value: "₹38.4L",
      deltaValue: "+16.2%",
      deltaLabel: "season growth",
      subtext: "Ahead of budget forecast",
      icon: Gem,
      accent: "text-[var(--champagne)]",
      badgeVariant: "gold" as const,
    },
    {
      label: "Average Daily Rate",
      value: "₹28,500",
      deltaPrefix: "RevPAR ",
      deltaValue: "₹23,940",
      deltaLabel: "",
      subtext: "Luxury tier benchmark",
      icon: TrendingUp,
      accent: "text-[var(--sage)]",
      badgeVariant: "sage" as const,
    },
  ];

  const now = new Date();
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dateStr = `${weekdays[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <section className="rise relative flex flex-wrap items-end justify-between gap-5 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--champagne)] shadow-[var(--glow-gold)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--champagne)]">
              {dateStr} · 5-Star Luxury Resort Operations
            </p>
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Good {theme === "night" ? "evening" : "morning"},{" "}
            <em className="font-normal italic text-[var(--champagne)]">Amol.</em>
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            The property is operating smoothly across all{" "}
            <CasinoSlotNumber value="8" spinTrigger={spinKey} className="font-semibold text-foreground" /> ocean pavilions. Helipad reception is primed,
            Sunset Terrace is prepared, and{" "}
            <CasinoSlotNumber value="18" spinTrigger={spinKey} className="font-semibold text-foreground" /> luxury suites are serviced.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            className="border-border bg-card text-foreground hover:bg-accent"
            onClick={() => onNavigateTab("finance")}
          >
            <Download className="size-4 text-[var(--champagne)]" />
            Export Audit
          </Button>
          <Button
            onClick={onNewBooking}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" />
            New Booking
          </Button>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => (
          <article
            key={kpi.label}
            className="resort-card rise group relative overflow-hidden p-5"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {kpi.label}
                </p>
                <div className="mt-2.5 font-display text-3xl font-semibold text-foreground">
                  <CasinoSlotNumber value={kpi.value} spinTrigger={spinKey} mode="jackpot" />
                </div>
              </div>
              <div
                className={`flex size-10 items-center justify-center rounded-lg border border-border bg-accent/60 ${kpi.accent} transition-transform duration-300 group-hover:scale-110`}
              >
                <kpi.icon className="size-5" strokeWidth={1.75} />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
              <span className="flex items-center gap-1 font-medium text-[var(--sage)]">
                <ArrowUpRight className="size-3.5" />
                {kpi.deltaPrefix && <span>{kpi.deltaPrefix}</span>}
                <CasinoSlotNumber value={kpi.deltaValue} spinTrigger={spinKey} />
                {kpi.deltaLabel && <span className="ml-0.5 text-muted-foreground">{kpi.deltaLabel}</span>}
              </span>
              <span className="text-[11px] text-muted-foreground">{kpi.subtext}</span>
            </div>
          </article>
        ))}
      </section>

      {/* Main Grid: Revenue Chart + Property Live Spotlight */}
      <section className="grid gap-6 lg:grid-cols-12">
        {/* Revenue Chart */}
        <article className="resort-card p-6 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="size-4 text-[var(--champagne)]" />
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Seasonal Revenue Trajectory
                </h2>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Monthly resort revenue breakdown (in ₹ Lakhs) · Current vs. Prior Fiscal Year
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <span className="size-2.5 rounded-full bg-[var(--champagne)]" />
                Current Season (2026)
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-full bg-[var(--sage)]/50" />
                Prior Year (2025)
              </span>
            </div>
          </div>

          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="champagneGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={theme === "night" ? "#D4AF68" : "#C9A45C"}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor={theme === "night" ? "#D4AF68" : "#C9A45C"}
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                  <linearGradient id="sageGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#718B7A" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#718B7A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontFamily: "var(--font-body)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontFamily: "var(--font-body)" }}
                  unit="L"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "10px",
                    color: "var(--foreground)",
                    fontSize: "12px",
                    boxShadow: "var(--shadow-panel)",
                  }}
                  formatter={(value: any) => [`₹${value} Lakhs`, ""]}
                />
                <Area
                  type="monotone"
                  dataKey="lastYear"
                  stroke="#718B7A"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="url(#sageGlow)"
                  name="Prior Year"
                />
                <Area
                  type="monotone"
                  dataKey="thisYear"
                  stroke={theme === "night" ? "#D4AF68" : "#C9A45C"}
                  strokeWidth={2.5}
                  fill="url(#champagneGlow)"
                  name="Current Season"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <span>Peak season pacing: +24% higher ADR on Beachfront Villas</span>
            <button
              onClick={() => onNavigateTab("finance")}
              className="font-medium text-[var(--champagne)] hover:underline"
            >
              View detailed financial ledger &rarr;
            </button>
          </div>
        </article>

        {/* Live Property Showcase & Marine Conditions */}
        <div className="space-y-4 lg:col-span-4">
          <article className="resort-card resort-photo-card relative overflow-hidden">
            <div className="relative h-44 w-full overflow-hidden">
              <img
                src={villaPool}
                alt="Palm Grove private oceanfront infinity pool villa"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <Badge variant="gold" className="bg-[var(--champagne)]/90 text-black font-semibold">
                  FEATURED VILLA
                </Badge>
                <h3 className="mt-1 font-display text-lg font-semibold text-white">
                  Ocean Pool Villa · V-07
                </h3>
                <p className="text-xs text-white/85">
                  165 m² · Private Plunge Pool · Butler Ready
                </p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Current Status</span>
                <Badge variant="sage">Ready for VIP Check-in</Badge>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-3 text-xs">
                <span className="font-semibold text-foreground">
                  <CasinoSlotNumber value="₹35,000" spinTrigger={spinKey} /> / night
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onNavigateTab("rooms")}
                  className="h-7 text-xs border-border"
                >
                  Inspect Suite
                </Button>
              </div>
            </div>
          </article>

          {/* Marine & Beach Club Widget */}
          <article className="resort-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Waves className="size-4 text-[var(--sky)]" />
                <h3 className="font-display text-sm font-semibold text-foreground">
                  Beach & Marine Conditions
                </h3>
              </div>
              <Badge variant="ocean">Calm Water</Badge>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg border border-border/60 bg-accent/40 p-2.5 text-center text-xs">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Sea Temp</p>
                <p className="mt-0.5 font-semibold text-foreground">
                  <CasinoSlotNumber value="27" spinTrigger={spinKey} />°C
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">High Tide</p>
                <p className="mt-0.5 font-semibold text-foreground">
                  17:45 (<CasinoSlotNumber value="+2.1m" spinTrigger={spinKey} />)
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Visibility</p>
                <p className="mt-0.5 font-semibold text-foreground">
                  <CasinoSlotNumber value="14" spinTrigger={spinKey} /> km
                </p>
              </div>
            </div>
            <p className="mt-2.5 text-[11px] text-muted-foreground">
              Private cove beach club fully staffed with safety tenders active.
            </p>
          </article>
        </div>
      </section>

      {/* Secondary Grid: Cabin/Suite Activity + Recent Bookings Table */}
      <section className="grid gap-6 lg:grid-cols-12">
        {/* Recent Stays & Bookings */}
        <article className="resort-card p-6 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-border/70 pb-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                In-House Guests & Stays
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Active arrivals, departures, and confirmed reservations
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateTab("bookings")}
              className="text-xs font-semibold text-[var(--champagne)] hover:text-foreground"
            >
              View All Bookings &rarr;
            </Button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="resort-table w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/80 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  <th className="py-3 font-semibold">Guest</th>
                  <th className="py-3 font-semibold">Suite / Villa</th>
                  <th className="py-3 font-semibold">Stay Period</th>
                  <th className="py-3 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {bookings.slice(0, 4).map((bk) => (
                  <tr
                    key={bk.id}
                    onClick={() => onSelectBooking(bk)}
                    className="cursor-pointer transition-colors"
                  >
                    <td className="py-3.5">
                      <div className="font-medium text-foreground">{bk.guestName}</div>
                      <div className="text-[11px] text-muted-foreground">{bk.loyaltyTier} Tier</div>
                    </td>
                    <td className="py-3.5 text-xs text-muted-foreground">
                      <div className="font-medium text-foreground">{bk.roomName}</div>
                      <span className="text-[11px] text-[var(--champagne)]">{bk.roomCode}</span>
                    </td>
                    <td className="py-3.5 text-xs text-muted-foreground">
                      {bk.checkIn.slice(5)} &rarr; {bk.checkOut.slice(5)} (
                      <CasinoSlotNumber value={bk.nights} interactive={false} /> nights)
                    </td>
                    <td className="py-3.5 text-right">
                      <Badge
                        variant={
                          bk.status === "Checked In"
                            ? "sage"
                            : bk.status === "Confirmed"
                            ? "ocean"
                            : bk.status === "Pending"
                            ? "gold"
                            : "outline"
                        }
                      >
                        {bk.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* Live Cabin & Suite Operations */}
        <article className="resort-card p-6 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-border/70 pb-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Suite Operations Feed
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Live housekeeping & arrival preparation status
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--sage)]">
              <span className="size-2 rounded-full bg-[var(--sage)] animate-pulse" />
              Live Sync
            </span>
          </div>

          <ul className="mt-4 divide-y divide-border/60">
            {rooms.slice(0, 4).map((rm) => (
              <li key={rm.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-accent font-display text-xs font-semibold text-[var(--champagne)]">
                    {rm.code}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{rm.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {rm.currentGuest ? `In residence: ${rm.currentGuest}` : rm.view}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={
                    rm.status === "Ready"
                      ? "sage"
                      : rm.status === "Occupied"
                      ? "ocean"
                      : rm.status === "Housekeeping"
                      ? "sunset"
                      : "copper"
                  }
                >
                  {rm.status}
                </Badge>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-lg border border-border/60 bg-accent/40 p-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Housekeeping Progress</span>
              <span className="font-semibold text-[var(--champagne)]">
                <CasinoSlotNumber value="88%" spinTrigger={spinKey} /> Turn-down Ready
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full bg-[var(--champagne)]" style={{ width: "88%" }} />
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
