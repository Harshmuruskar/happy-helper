import { useState } from "react";
import {
  CalendarCheck2,
  Calendar,
  CheckCircle2,
  Download,
  Filter,
  LogOut,
  Mail,
  Phone,
  Plus,
  Search,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Booking, BookingStatus } from "./types";
import { CasinoSlotNumber } from "./CasinoSlotNumber";
import { useCasino } from "./CasinoControl";

interface BookingsViewProps {
  bookings: Booking[];
  onNewBooking: () => void;
  onUpdateStatus: (id: string, newStatus: BookingStatus) => void;
  onSelectBooking: (booking: Booking) => void;
}

export function BookingsView({
  bookings,
  onNewBooking,
  onUpdateStatus,
  onSelectBooking,
}: BookingsViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const statuses: ("All" | BookingStatus)[] = [
    "All",
    "Checked In",
    "Confirmed",
    "Pending",
    "Checked Out",
  ];

  const filtered = bookings.filter((bk) => {
    const matchesSearch =
      bk.guestName.toLowerCase().includes(search.toLowerCase()) ||
      bk.roomName.toLowerCase().includes(search.toLowerCase()) ||
      bk.roomCode.toLowerCase().includes(search.toLowerCase()) ||
      bk.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || bk.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const { spinKey } = useCasino();

  // Summary statistics
  const totalFolioNum = bookings.reduce((sum, b) => {
    const val = Number.parseInt(b.totalAmount.replace(/\D/g, "") || "0", 10);
    return sum + val;
  }, 0);
  const formattedTotalFolio = `₹${totalFolioNum.toLocaleString("en-IN")}`;
  const checkedInCount = bookings.filter((b) => b.status === "Checked In").length;
  const vipCount = bookings.filter((b) => b.loyaltyTier === "VIP" || b.loyaltyTier === "Platinum").length;
  const avgNights = (bookings.reduce((sum, b) => sum + b.nights, 0) / Math.max(1, bookings.length)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header section with Module Accent: Deep Ocean + Champagne */}
      <section className="rise flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--champagne)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--champagne)]">
              Front Office & Reservations
            </p>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">
            Guest Reservations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage arrivals, departures, VIP stay profiles, and luxury suite allocations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            className="border-border bg-card text-foreground hover:bg-accent"
          >
            <Download className="size-4 text-[var(--champagne)]" />
            Export Folio
          </Button>
          <Button
            onClick={onNewBooking}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" />
            New Reservation
          </Button>
        </div>
      </section>

      {/* Casino Stat Cards Strip */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="resort-card p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Active Reservations
          </span>
          <div className="mt-1.5 font-display text-2xl font-bold text-foreground">
            <CasinoSlotNumber value={bookings.length} spinTrigger={spinKey} mode="jackpot" />
          </div>
          <p className="mt-1 text-[11px] text-[var(--sage)]">Real-time ledger entries</p>
        </article>

        <article className="resort-card p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Gross Pipeline Folio
          </span>
          <div className="mt-1.5 font-display text-2xl font-bold text-[var(--champagne)]">
            <CasinoSlotNumber value={formattedTotalFolio} spinTrigger={spinKey} mode="jackpot" />
          </div>
          <p className="mt-1 text-[11px] text-[var(--sage)]">All suites and villas combined</p>
        </article>

        <article className="resort-card p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Checked-In In-House
          </span>
          <div className="mt-1.5 font-display text-2xl font-bold text-foreground">
            <CasinoSlotNumber value={checkedInCount} spinTrigger={spinKey} mode="jackpot" />
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">Suites registered & in key</p>
        </article>

        <article className="resort-card p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            VIP Loyalty Folios
          </span>
          <div className="mt-1.5 font-display text-2xl font-bold text-[var(--sunset)]">
            <CasinoSlotNumber value={vipCount} spinTrigger={spinKey} mode="jackpot" />
          </div>
          <p className="mt-1 text-[11px] text-[var(--sage)]">Avg. {avgNights} nights residence</p>
        </article>
      </section>

      {/* Search & Filters */}
      <section className="resort-card p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reservations by guest, suite code, or booking ID…"
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-[var(--champagne)] focus:ring-2 focus:ring-[var(--champagne)]/15"
            />
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? "border border-[var(--champagne)] bg-[var(--champagne)] text-black shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:border-border/80 hover:bg-accent hover:text-foreground"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bookings Table */}
      <section className="resort-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="resort-table w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-accent/30 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-5 py-4 font-semibold">Booking ID</th>
                <th className="px-5 py-4 font-semibold">Guest & Tier</th>
                <th className="px-5 py-4 font-semibold">Suite / Villa</th>
                <th className="px-5 py-4 font-semibold">Stay Dates</th>
                <th className="px-5 py-4 font-semibold">Folio Total</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <CalendarCheck2 className="mx-auto size-10 text-muted-foreground/60" />
                    <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                      No matching reservations found
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Try adjusting your search criteria or filter options.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearch("");
                        setStatusFilter("All");
                      }}
                      className="mt-4 border-border text-xs"
                    >
                      Clear Filters
                    </Button>
                  </td>
                </tr>
              ) : (
                filtered.map((bk) => (
                  <tr
                    key={bk.id}
                    className="group transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-semibold text-[var(--champagne)]">
                        {bk.id}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground">{bk.guestName}</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Badge
                          variant={
                            bk.loyaltyTier === "VIP"
                              ? "sunset"
                              : bk.loyaltyTier === "Platinum"
                              ? "gold"
                              : "sage"
                          }
                          className="h-4 px-1.5 text-[9px]"
                        >
                          {bk.loyaltyTier}
                        </Badge>
                        <span>· <CasinoSlotNumber value={bk.guestsCount} interactive={false} /> Guests</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground">{bk.roomName}</div>
                      <span className="inline-block rounded bg-accent px-1.5 py-0.5 text-[10px] font-mono text-[var(--champagne)]">
                        {bk.roomCode}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      <div className="font-medium text-foreground">
                        {bk.checkIn} &rarr; {bk.checkOut}
                      </div>
                      <span>
                        <CasinoSlotNumber value={bk.nights} interactive={false} /> nights stay
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono font-semibold text-foreground">
                      <CasinoSlotNumber value={bk.totalAmount} spinTrigger={spinKey} />
                    </td>
                    <td className="px-5 py-4">
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
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {bk.status === "Confirmed" && (
                          <Button
                            size="sm"
                            onClick={() => onUpdateStatus(bk.id, "Checked In")}
                            className="h-8 bg-[var(--sage)] px-2.5 text-xs font-medium text-white hover:bg-[var(--sage)]/90"
                          >
                            <UserCheck className="size-3.5" />
                            Check In
                          </Button>
                        )}
                        {bk.status === "Checked In" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdateStatus(bk.id, "Checked Out")}
                            className="h-8 border-border px-2.5 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <LogOut className="size-3.5" />
                            Check Out
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onSelectBooking(bk)}
                          className="h-8 px-2 text-xs text-[var(--champagne)] hover:text-foreground"
                        >
                          Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with totals */}
        <div className="flex flex-wrap items-center justify-between border-t border-border/70 px-5 py-3 text-xs text-muted-foreground">
          <span>
            Showing {filtered.length} of {bookings.length} reservations
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[var(--sage)]" />
              {bookings.filter((b) => b.status === "Checked In").length} In-House
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[var(--champagne)]" />
              {bookings.filter((b) => b.status === "Confirmed").length} Confirmed
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
