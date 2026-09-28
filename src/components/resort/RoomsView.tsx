import { useState } from "react";
import {
  BedDouble,
  CheckCircle2,
  Filter,
  Grid3X3,
  Layers,
  List,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Room, RoomStatus } from "./types";
import { CasinoSlotNumber } from "./CasinoSlotNumber";
import { useCasino } from "./CasinoControl";
import villaPool from "@/assets/coastal-villa-pool.jpg";
import resortDay from "@/assets/coastal-resort-day.jpg";

interface RoomsViewProps {
  rooms: Room[];
  onUpdateRoomStatus: (id: string, newStatus: RoomStatus) => void;
}

export function RoomsView({ rooms, onUpdateRoomStatus }: RoomsViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [wingFilter, setWingFilter] = useState<string>("All");

  const statuses = ["All", "Ready", "Occupied", "Housekeeping", "Maintenance"];
  const wings = [
    "All",
    "North Coral Bay",
    "The Grand Pavilion",
    "Orchid Sanctuary",
    "Azure Terraces",
    "Falcon Crest",
  ];

  const filtered = rooms.filter((r) => {
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    const matchesWing = wingFilter === "All" || r.wing === wingFilter;
    return matchesStatus && matchesWing;
  });

  const { spinKey } = useCasino();

  // Suite Inventory Metrics
  const occupiedCount = rooms.filter((r) => r.status === "Occupied").length;
  const readyCount = rooms.filter((r) => r.status === "Ready").length;
  const maintenanceCount = rooms.filter((r) => r.status === "Housekeeping" || r.status === "Maintenance").length;
  const avgRate = Math.round(
    rooms.reduce((acc, r) => acc + Number.parseInt(r.ratePerNight.replace(/\D/g, "") || "0", 10), 0) /
      Math.max(1, rooms.length)
  );
  const formattedAvgRate = `₹${avgRate.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6">
      {/* Header section with Module Accent: Sage + Deep Ocean */}
      <section className="rise flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--sage)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--sage)]">
              Villas & Sanctuary Suites · Sage & Deep Ocean
            </p>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">
            Property & Villa Inventory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time suite status, turn-down readiness, housekeeping allocations, and guest occupancy.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1">
          <Button
            size="sm"
            variant={viewMode === "grid" ? "default" : "ghost"}
            onClick={() => setViewMode("grid")}
            className="h-8 gap-1.5 px-3 text-xs"
          >
            <Grid3X3 className="size-3.5" />
            Grid View
          </Button>
          <Button
            size="sm"
            variant={viewMode === "list" ? "default" : "ghost"}
            onClick={() => setViewMode("list")}
            className="h-8 gap-1.5 px-3 text-xs"
          >
            <List className="size-3.5" />
            List View
          </Button>
        </div>
      </section>

      {/* Casino Stats Bar */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="resort-card p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Total Inventory Suites
          </span>
          <div className="mt-1.5 font-display text-2xl font-bold text-foreground">
            <CasinoSlotNumber value={rooms.length} spinTrigger={spinKey} mode="jackpot" />
          </div>
          <p className="mt-1 text-[11px] text-[var(--sage)]">Across all 5 architectural wings</p>
        </article>

        <article className="resort-card p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Active Occupancy
          </span>
          <div className="mt-1.5 font-display text-2xl font-bold text-[var(--champagne)]">
            <CasinoSlotNumber
              value={`${Math.round((occupiedCount / Math.max(1, rooms.length)) * 100)}%`}
              spinTrigger={spinKey}
              mode="jackpot"
            />
          </div>
          <p className="mt-1 text-[11px] text-[var(--sage)]">{occupiedCount} suites in residence</p>
        </article>

        <article className="resort-card p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Turn-Down Ready
          </span>
          <div className="mt-1.5 font-display text-2xl font-bold text-foreground">
            <CasinoSlotNumber value={readyCount} spinTrigger={spinKey} mode="jackpot" />
          </div>
          <p className="mt-1 text-[11px] text-[var(--sage)]">QA sanitization passed</p>
        </article>

        <article className="resort-card p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Benchmark Nightly Yield
          </span>
          <div className="mt-1.5 font-display text-2xl font-bold text-[var(--sunset)]">
            <CasinoSlotNumber value={formattedAvgRate} spinTrigger={spinKey} mode="jackpot" />
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">{maintenanceCount} in turnover prep</p>
        </article>
      </section>

      {/* Filter Toolbar */}
      <section className="resort-card flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Status:
          </span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === st
                  ? "border border-[var(--sage)] bg-[var(--sage)] text-white shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Wing Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Wing:
          </span>
          {wings.map((wg) => (
            <button
              key={wg}
              onClick={() => setWingFilter(wg)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                wingFilter === wg
                  ? "border border-[var(--champagne)] bg-[var(--champagne)]/15 text-[var(--champagne)]"
                  : "border border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              {wg}
            </button>
          ))}
        </div>
      </section>

      {/* Content: Grid or List */}
      {viewMode === "grid" ? (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((rm) => (
            <article
              key={rm.id}
              className="resort-card resort-photo-card group relative flex flex-col overflow-hidden"
            >
              {/* Room Card Image */}
              <div className="relative h-44 w-full overflow-hidden bg-muted">
                <img
                  src={rm.type === "Villa" ? villaPool : resortDay}
                  alt={rm.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute left-3 top-3">
                  <span className="rounded-md border border-white/20 bg-black/60 px-2 py-0.5 font-mono text-xs font-semibold text-white">
                    {rm.code}
                  </span>
                </div>
                <div className="absolute right-3 top-3">
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
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--champagne)]">
                    {rm.wing}
                  </p>
                  <h3 className="font-display text-base font-semibold leading-snug text-white">
                    {rm.name}
                  </h3>
                </div>
              </div>

              {/* Room Details */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{rm.view}</span>
                    <span>
                      <CasinoSlotNumber value={rm.sqm} interactive={false} /> m² · Up to{" "}
                      <CasinoSlotNumber value={rm.capacity} interactive={false} /> guests
                    </span>
                  </div>

                  {/* Feature chips */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {rm.features.slice(0, 3).map((f) => (
                      <span
                        key={f}
                        className="rounded border border-border bg-accent/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  {rm.currentGuest && (
                    <div className="mt-3 rounded border border-border/80 bg-accent/40 p-2 text-xs">
                      <span className="text-[10px] uppercase text-muted-foreground">Current Guest:</span>
                      <p className="font-medium text-foreground">{rm.currentGuest}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 border-t border-border/70 pt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground">Nightly Rate</p>
                      <div className="font-display text-base font-semibold text-[var(--champagne)]">
                        <CasinoSlotNumber value={rm.ratePerNight} spinTrigger={spinKey} />
                      </div>
                    </div>

                    {/* Status Changer dropdown / quick button */}
                    <div className="flex items-center gap-1">
                      <select
                        value={rm.status}
                        onChange={(e) => onUpdateRoomStatus(rm.id, e.target.value as RoomStatus)}
                        className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-[var(--champagne)]"
                      >
                        <option value="Ready">Ready</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Housekeeping">Housekeeping</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        /* List View */
        <section className="resort-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="resort-table w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-accent/30 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  <th className="px-5 py-4 font-semibold">Code</th>
                  <th className="px-5 py-4 font-semibold">Suite / Villa</th>
                  <th className="px-5 py-4 font-semibold">Wing & View</th>
                  <th className="px-5 py-4 font-semibold">Occupant</th>
                  <th className="px-5 py-4 font-semibold">Nightly Rate</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Change Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((rm) => (
                  <tr key={rm.id}>
                    <td className="px-5 py-4 font-mono font-semibold text-[var(--champagne)]">
                      {rm.code}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground">{rm.name}</div>
                      <div className="text-xs text-muted-foreground">
                        <CasinoSlotNumber value={rm.sqm} interactive={false} /> m² · {rm.type}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      <div className="font-medium text-foreground">{rm.wing}</div>
                      <span>{rm.view}</span>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      {rm.currentGuest ? (
                        <span className="font-medium text-foreground">{rm.currentGuest}</span>
                      ) : (
                        <span className="text-muted-foreground italic">Vacant</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono font-semibold text-foreground">
                      <CasinoSlotNumber value={rm.ratePerNight} spinTrigger={spinKey} />
                    </td>
                    <td className="px-5 py-4">
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
                    </td>
                    <td className="px-5 py-4 text-right">
                      <select
                        value={rm.status}
                        onChange={(e) => onUpdateRoomStatus(rm.id, e.target.value as RoomStatus)}
                        className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-[var(--champagne)]"
                      >
                        <option value="Ready">Ready</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Housekeeping">Housekeeping</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
