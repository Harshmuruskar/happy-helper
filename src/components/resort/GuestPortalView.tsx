import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  CreditCard,
  Gift,
  HelpCircle,
  KeyRound,
  MessageSquare,
  PhoneCall,
  Plus,
  Receipt,
  Sparkles,
  Star,
  UtensilsCrossed,
  Waves,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Account,
  Booking,
  GuestReview,
  ReservationFolio,
  ResortServiceItem,
  ServiceBooking,
  SupportTicket,
} from "./types";
import { CasinoSlotNumber } from "./CasinoSlotNumber";
import { useCasino } from "./CasinoControl";

interface GuestPortalViewProps {
  currentAccount: Account;
  bookings: Booking[];
  serviceBookings: ServiceBooking[];
  services: ResortServiceItem[];
  folios: ReservationFolio[];
  supportTickets: SupportTicket[];
  reviews: GuestReview[];
  onNavigateTab: (tab: any) => void;
  onOpenBookService: () => void;
  onOpenSupportTicket: () => void;
  onOpenReviewModal: () => void;
}

export function GuestPortalView({
  currentAccount,
  bookings,
  serviceBookings,
  services,
  folios,
  supportTickets,
  reviews,
  onNavigateTab,
  onOpenBookService,
  onOpenSupportTicket,
  onOpenReviewModal,
}: GuestPortalViewProps) {
  const { spinKey } = useCasino();

  // Find guest stay
  const myBooking = bookings.find((b) => b.id === "BK-8095") || bookings[0];
  const myFolio = folios.find((f) => f.reservationId === myBooking?.id) || folios[0];
  const myServiceBookings = serviceBookings.filter((sb) => sb.guestName === currentAccount.name || sb.roomCode === "C-102");
  const myTickets = supportTickets.filter((t) => t.guestName === currentAccount.name || t.roomCode === "C-102");
  const myReviews = reviews.filter((r) => r.guestName === currentAccount.name);

  // Folio calculation
  const totalCharges = myFolio ? myFolio.charges.reduce((a, c) => a + c.amount, 0) : 0;
  const tax = Math.round((totalCharges - (myFolio?.discountAmount || 0)) * ((myFolio?.taxRatePercent || 18) / 100));
  const totalDue = totalCharges - (myFolio?.discountAmount || 0) + tax;
  const totalPaid = myFolio ? myFolio.payments.reduce((a, p) => a + p.amount, 0) : 0;
  const balance = totalDue - totalPaid;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--champagne)]/40 bg-card p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[var(--champagne)]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--champagne)]">
                In-Residence Guest Sanctuary · Suite {myBooking?.roomCode}
              </p>
            </div>
            <h1 className="mt-1.5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Welcome back, <em className="italic text-[var(--champagne)]">{currentAccount.name}</em>
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Your private sanctuary at Palm Grove is fully staffed. Ocean breezes are calm (+24°C), your personal butler is on stand-by, and your evening spa therapies are confirmed.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <Badge variant="gold">Gold Tier Member</Badge>
              <span className="font-mono text-muted-foreground">
                Stay #{myBooking?.id} · {myBooking?.roomName}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="font-mono text-foreground font-semibold">
                {myBooking?.checkIn} — {myBooking?.checkOut} ({myBooking?.nights} Nights)
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Button
              onClick={onOpenBookService}
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
            >
              <Sparkles className="size-3.5" />
              Book Concierge Service
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigateTab("billing")}
              className="gap-1.5 border-border text-xs"
            >
              <Receipt className="size-3.5" />
              View Live Folio
            </Button>
          </div>
        </div>
      </div>

      {/* Guest Quick Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Folio Balance */}
        <div
          onClick={() => onNavigateTab("billing")}
          className="resort-card cursor-pointer p-5 transition-all hover:border-[var(--champagne)]/60"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Live Folio Balance
            </span>
            <Receipt className="size-4 text-[var(--champagne)]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground">
            <CasinoSlotNumber value={balance} spinTrigger={spinKey} prefix="₹" />
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {balance > 0 ? "Click to view breakdown or settle" : "All stay charges settled ✓"}
          </p>
        </div>

        {/* Loyalty Points */}
        <div
          onClick={() => onNavigateTab("people")}
          className="resort-card cursor-pointer p-5 transition-all hover:border-[var(--champagne)]/60"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Loyalty Points
            </span>
            <Gift className="size-4 text-[var(--gold)]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[var(--champagne)]">
            <CasinoSlotNumber value="1250" spinTrigger={spinKey} /> Pts
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Worth ₹6,250 in folio credits · Click to redeem
          </p>
        </div>

        {/* Booked Services */}
        <div
          onClick={() => onNavigateTab("amenities")}
          className="resort-card cursor-pointer p-5 transition-all hover:border-[var(--champagne)]/60"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Booked Experiences
            </span>
            <Sparkles className="size-4 text-[var(--sunset)]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground">
            <CasinoSlotNumber value={myServiceBookings.length} spinTrigger={spinKey} /> Active
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Ayurvedic spa appointment at 16:00
          </p>
        </div>

        {/* In-Suite Butler & Wifi */}
        <div className="resort-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Butler & High-Speed WiFi
            </span>
            <Wifi className="size-4 text-[var(--sage)]" />
          </div>
          <p className="mt-2 font-display text-base font-bold text-foreground">
            Butler Jean-Paul
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground font-mono">
            Direct Dial #402 · WiFi: PalmGrove-VIP
          </p>
        </div>
      </div>

      {/* Main Grid: My Itinerary & Service Requests */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: My Experiences Itinerary */}
        <div className="lg:col-span-7 resort-card p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                My Booked Services & Itinerary
              </h2>
              <p className="text-xs text-muted-foreground">
                Appointments, dining tables, and transport arranged for your stay.
              </p>
            </div>
            <Button size="sm" onClick={onOpenBookService} className="h-7 text-xs">
              <Plus className="size-3 mr-1" /> Add Service
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {myServiceBookings.map((sbk) => (
              <div
                key={sbk.id}
                className="flex items-center justify-between rounded-lg border border-border/70 bg-accent/30 p-3.5 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{sbk.category}</Badge>
                    <p className="font-semibold text-foreground">{sbk.serviceName}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-muted-foreground font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" /> {sbk.scheduledDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" /> {sbk.scheduledTime}
                    </span>
                    <span>·</span>
                    <span className="text-foreground font-bold">₹{sbk.amount.toLocaleString()}</span>
                  </div>
                </div>

                <Badge variant={sbk.status === "Completed" ? "gold" : "sunset"}>
                  {sbk.status}
                </Badge>
              </div>
            ))}

            {myServiceBookings.length === 0 && (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No active service bookings. Browse our Spa & Dining menu to book.
              </div>
            )}
          </div>
        </div>

        {/* Right: In-Suite Concierge Support & 5-Star Review */}
        <div className="lg:col-span-5 space-y-6">
          {/* Help & Support Desk */}
          <div className="resort-card p-6">
            <div className="flex items-center justify-between border-b border-border pb-3.5">
              <h3 className="font-display text-lg font-bold text-foreground">
                Concierge Hotline & Requests
              </h3>
              <Button size="sm" variant="outline" onClick={onOpenSupportTicket} className="h-7 text-xs">
                <Plus className="size-3 mr-1" /> New Ticket
              </Button>
            </div>

            <div className="mt-3.5 space-y-2.5">
              {myTickets.map((tck) => (
                <div key={tck.id} className="rounded-lg border border-border/60 bg-background/50 p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{tck.subject}</span>
                    <Badge variant={tck.status === "Resolved" ? "gold" : "sunset"}>
                      {tck.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-muted-foreground text-[11px] line-clamp-2">
                    {tck.description}
                  </p>
                  {tck.response && (
                    <div className="mt-2 rounded bg-accent/60 p-2 text-[11px] text-[var(--sage)] italic">
                      Staff reply: {tck.response}
                    </div>
                  )}
                </div>
              ))}

              {myTickets.length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No open requests. Front desk is available 24/7.
                </p>
              )}
            </div>
          </div>

          {/* 5-Star Stay Review Card */}
          <div className="resort-card p-6">
            <div className="flex items-start justify-between border-b border-border pb-3.5">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Rate Your Stay Experience
                </h3>
                <p className="text-xs text-muted-foreground">
                  Help us elevate your luxury hospitality benchmarks.
                </p>
              </div>
              <Star className="size-5 text-[var(--champagne)]" />
            </div>

            <div className="mt-4">
              {myReviews.length > 0 ? (
                <div className="rounded-lg border border-[var(--champagne)]/40 bg-[var(--gold-soft)]/20 p-4 text-xs">
                  <div className="flex items-center gap-1 text-[var(--champagne)]">
                    {Array.from({ length: myReviews[0].overallRating }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-[var(--champagne)] text-[var(--champagne)]" />
                    ))}
                  </div>
                  <p className="mt-2 font-bold text-foreground">"{myReviews[0].title}"</p>
                  <p className="mt-1 text-muted-foreground text-[11px]">{myReviews[0].comment}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onOpenReviewModal}
                    className="mt-3 h-7 text-xs border-[var(--champagne)]/50"
                  >
                    Edit Review
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-muted-foreground mb-3">
                    Share your feedback on your stay at Cliffside Sanctuary Villa.
                  </p>
                  <Button size="sm" onClick={onOpenReviewModal} className="h-8 text-xs bg-primary text-primary-foreground">
                    <Star className="size-3.5 mr-1" /> Leave 5-Star Review
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
