import {
  Calendar,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Booking, BookingStatus } from "./types";
import { CasinoSlotNumber } from "./CasinoSlotNumber";

interface BookingDetailModalProps {
  booking: Booking | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: BookingStatus) => void;
}

export function BookingDetailModal({
  booking,
  onClose,
  onUpdateStatus,
}: BookingDetailModalProps) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Crisp Solid Surface Modal */}
      <div className="resort-card relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border bg-card p-6 shadow-2xl rise">
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[var(--champagne)]">
                {booking.id}
              </span>
              <Badge
                variant={
                  booking.status === "Checked In"
                    ? "sage"
                    : booking.status === "Confirmed"
                    ? "ocean"
                    : booking.status === "Pending"
                    ? "gold"
                    : "outline"
                }
              >
                {booking.status}
              </Badge>
            </div>
            <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
              {booking.guestName}
            </h2>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="mt-5 space-y-4 text-xs">
          {/* Guest Profile Details */}
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-accent/40 p-3.5">
            <div>
              <span className="text-[10px] uppercase text-muted-foreground">Guest Contact</span>
              <p className="mt-0.5 font-medium text-foreground">{booking.guestEmail}</p>
              <p className="mt-0.5 text-muted-foreground">{booking.guestPhone}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-muted-foreground">Recognition Tier</span>
              <p className="mt-0.5 font-semibold text-[var(--champagne)]">
                {booking.loyaltyTier} Member
              </p>
              <p className="mt-0.5 text-muted-foreground">
                <CasinoSlotNumber value={booking.guestsCount} interactive={false} /> Registered Guests
              </p>
            </div>
          </div>

          {/* Room Allocation */}
          <div className="rounded-lg border border-border bg-accent/40 p-3.5">
            <span className="text-[10px] uppercase text-muted-foreground">Allocated Accommodation</span>
            <div className="mt-1 flex items-center justify-between">
              <div>
                <p className="font-display text-base font-semibold text-foreground">
                  {booking.roomName}
                </p>
                <p className="text-muted-foreground">Suite Identifier: {booking.roomCode}</p>
              </div>
              <Badge variant="ocean">{booking.roomCode}</Badge>
            </div>
          </div>

          {/* Dates & Billing */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-accent/40 p-3">
              <span className="text-[10px] uppercase text-muted-foreground">Stay Dates</span>
              <p className="mt-1 font-medium text-foreground">
                {booking.checkIn} &rarr; {booking.checkOut}
              </p>
              <p className="mt-0.5 text-muted-foreground">
                <CasinoSlotNumber value={booking.nights} interactive={false} /> Nights Residence
              </p>
            </div>

            <div className="rounded-lg border border-border bg-accent/40 p-3">
              <span className="text-[10px] uppercase text-muted-foreground">Total Folio Charge</span>
              <div className="mt-1 font-mono text-base font-bold text-[var(--champagne)]">
                <CasinoSlotNumber value={booking.totalAmount} mode="jackpot" />
              </div>
              <p className="mt-0.5 text-muted-foreground">All taxes & butler gratuity included</p>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="rounded-lg border border-border bg-accent/40 p-3.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--champagne)]">
                Concierge Instructions & Preferences:
              </span>
              <p className="mt-1 leading-relaxed text-muted-foreground">
                {booking.specialRequests}
              </p>
            </div>
          )}

          {/* Status Actions */}
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/80 pt-4">
            {booking.status === "Confirmed" && (
              <Button
                onClick={() => {
                  onUpdateStatus(booking.id, "Checked In");
                  onClose();
                }}
                className="bg-[var(--sage)] text-white hover:bg-[var(--sage)]/90"
              >
                Mark In-House (Check In)
              </Button>
            )}

            {booking.status === "Checked In" && (
              <Button
                onClick={() => {
                  onUpdateStatus(booking.id, "Checked Out");
                  onClose();
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Settle & Check Out
              </Button>
            )}

            <Button variant="outline" onClick={onClose} className="border-border">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
