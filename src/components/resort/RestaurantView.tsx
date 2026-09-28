import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Coffee,
  ConciergeBell,
  Flame,
  Plus,
  Sparkles,
  UtensilsCrossed,
  Wine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderStage, RestaurantOrder } from "./types";
import { CasinoSlotNumber } from "./CasinoSlotNumber";
import { useCasino } from "./CasinoControl";

interface RestaurantViewProps {
  orders: RestaurantOrder[];
  onAdvanceOrder: (id: string) => void;
}

export function RestaurantView({ orders, onAdvanceOrder }: RestaurantViewProps) {
  const [selectedVenue, setSelectedVenue] = useState<string>("All");
  const { spinKey } = useCasino();

  const venues = [
    "All",
    "Sunset Terrace (Fine Dining)",
    "The Ocean Club (Seafood & Grill)",
    "Azure Lounge (Cocktails & Tapas)",
    "The Sommelier Cellar",
  ];

  const filteredOrders = orders.filter(
    (o) => selectedVenue === "All" || o.venue.includes(selectedVenue.split(" ")[0])
  );

  const activeTicketsCount = orders.filter((o) => o.stage !== "Served").length;

  return (
    <div className="space-y-6">
      {/* Header section with Module Accent: Sunset Orange #D9794A */}
      <section className="rise flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--sunset)] shadow-[0_0_8px_var(--sunset)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--sunset)]">
              Culinary & Cellar · Sunset Orange Accent
            </p>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">
            Restaurant & Kitchen Operations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live Kitchen Order Tickets (KOT), fine dining table reservations, sommelier pairings, and culinary status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="sunset" className="px-3 py-1 text-xs">
            <Flame className="mr-1 size-3.5" />
            Kitchen Active · <CasinoSlotNumber value={activeTicketsCount} spinTrigger={spinKey} interactive={false} /> Live Tickets
          </Badge>
        </div>
      </section>

      {/* Culinary Metrics Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="resort-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Dinner Covers Today
              </p>
              <div className="mt-2 font-display text-3xl font-semibold text-foreground">
                <CasinoSlotNumber value="142" spinTrigger={spinKey} mode="jackpot" />
              </div>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg border border-[var(--sunset)]/30 bg-[var(--sunset)]/10 text-[var(--sunset)]">
              <UtensilsCrossed className="size-5" />
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--sage)]">
            <CasinoSlotNumber value="+18" spinTrigger={spinKey} /> reservations confirmed for 20:00
          </p>
        </article>

        <article className="resort-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Table Occupancy
              </p>
              <div className="mt-2 font-display text-3xl font-semibold text-foreground">
                <CasinoSlotNumber value="92%" spinTrigger={spinKey} mode="jackpot" />
              </div>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg border border-[var(--sunset)]/30 bg-[var(--sunset)]/10 text-[var(--sunset)]">
              <ConciergeBell className="size-5" />
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--sunset)]">Sunset Terrace fully booked</p>
        </article>

        <article className="resort-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Today's F&B Revenue
              </p>
              <div className="mt-2 font-display text-3xl font-semibold text-foreground">
                <CasinoSlotNumber value="₹2,88,700" spinTrigger={spinKey} mode="jackpot" />
              </div>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg border border-[var(--champagne)]/30 bg-[var(--champagne)]/10 text-[var(--champagne)]">
              <Wine className="size-5" />
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--sage)]">
            <CasinoSlotNumber value="+22%" spinTrigger={spinKey} /> Grand Cru cellar selections
          </p>
        </article>

        <article className="resort-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Avg. Ticket Prep Time
              </p>
              <div className="mt-2 font-display text-3xl font-semibold text-foreground">
                <CasinoSlotNumber value="16m" spinTrigger={spinKey} mode="jackpot" />
              </div>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg border border-[var(--sage)]/30 bg-[var(--sage)]/10 text-[var(--sage)]">
              <Clock className="size-5" />
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--sage)]">Optimal Michelin-grade pacing</p>
        </article>
      </section>

      {/* Venue Filter Bar */}
      <section className="resort-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Dining Venues:
          </span>
          {venues.map((vn) => (
            <button
              key={vn}
              onClick={() => setSelectedVenue(vn)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                selectedVenue === vn
                  ? "border border-[var(--sunset)] bg-[var(--sunset)] text-white shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {vn}
            </button>
          ))}
        </div>
      </section>

      {/* Kitchen Order Tickets (KOT) Board */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Live Kitchen Order Tickets (KOT)
          </h2>
          <span className="text-xs text-muted-foreground">Click 'Advance Stage' to progress orders</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {filteredOrders.map((ord) => (
            <article
              key={ord.id}
              className="resort-card relative flex flex-col justify-between overflow-hidden p-5"
            >
              {/* Card top border accent in Sunset Orange */}
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{
                  backgroundColor:
                    ord.stage === "Preparing"
                      ? "var(--sunset)"
                      : ord.stage === "Plated"
                      ? "var(--sage)"
                      : ord.stage === "Served"
                      ? "var(--border)"
                      : "var(--champagne)",
                }}
              />

              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[var(--sunset)]">
                      {ord.id}
                    </span>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {ord.table}
                    </h3>
                  </div>
                  <Badge
                    variant={
                      ord.stage === "Preparing"
                        ? "sunset"
                        : ord.stage === "Plated"
                        ? "sage"
                        : ord.stage === "Served"
                        ? "outline"
                        : "gold"
                    }
                  >
                    {ord.stage}
                  </Badge>
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  <span>Guest: {ord.guestName}</span> · <span>Order Time: {ord.time}</span>
                </div>

                {/* Ordered Items List */}
                <div className="mt-4 rounded-lg border border-border/80 bg-accent/40 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Items (<CasinoSlotNumber value={ord.items.length} interactive={false} />):
                  </p>
                  <ul className="mt-1.5 space-y-1 text-xs text-foreground">
                    {ord.items.map((it, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[var(--sunset)]">&bull;</span>
                        <span className="leading-snug">{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3">
                <div className="font-mono text-sm font-semibold text-foreground">
                  <CasinoSlotNumber value={ord.totalAmount} spinTrigger={spinKey} />
                </div>

                {ord.stage !== "Served" ? (
                  <Button
                    size="sm"
                    onClick={() => onAdvanceOrder(ord.id)}
                    className="h-8 bg-[var(--sunset)] px-3 text-xs font-semibold text-white hover:bg-[var(--sunset)]/90"
                  >
                    Advance &rarr;
                  </Button>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-[var(--sage)] font-medium">
                    <CheckCircle2 className="size-3.5" /> Served
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
