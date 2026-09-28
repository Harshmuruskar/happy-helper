import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Booking, Room } from "./types";
import { CasinoSlotNumber } from "./CasinoSlotNumber";

interface NewBookingModalProps {
  open: boolean;
  onClose: () => void;
  rooms: Room[];
  onAddBooking: (booking: Booking) => void;
}

export function NewBookingModal({
  open,
  onClose,
  rooms,
  onAddBooking,
}: NewBookingModalProps) {
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || "");
  const [checkIn, setCheckIn] = useState("2026-10-01");
  const [checkOut, setCheckOut] = useState("2026-10-05");
  const [guestsCount, setGuestsCount] = useState(2);
  const [loyaltyTier, setLoyaltyTier] = useState<"Platinum" | "Gold" | "Silver" | "VIP">("Gold");
  const [specialRequests, setSpecialRequests] = useState("");
  const [selectedAddon, setSelectedAddon] = useState<string>("helicopter");

  if (!open) return null;

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];
  const rateNum = Number.parseInt(selectedRoom?.ratePerNight.replace(/\D/g, "") || "30000", 10);
  const nights = 4;
  const addonCost = selectedAddon === "helicopter" ? 45000 : selectedAddon === "yacht" ? 35000 : 0;
  const totalAmountNum = rateNum * nights + addonCost;
  const formattedTotal = `₹${totalAmountNum.toLocaleString("en-IN")}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const newBk: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName,
      guestEmail: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, ".")}@guest.resort.com`,
      guestPhone: guestPhone || "+91 98000 00000",
      roomName: selectedRoom.name,
      roomCode: selectedRoom.code,
      checkIn,
      checkOut,
      nights,
      totalAmount: formattedTotal,
      status: "Confirmed",
      loyaltyTier,
      guestsCount,
      specialRequests: specialRequests || "Standard 5-star welcome VIP amenity",
    };

    onAddBooking(newBk);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Crisp Solid Overlay */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface - Solid Crisp Surface, No blur */}
      <div className="resort-card relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto border border-border bg-card p-6 shadow-2xl rise">
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[var(--champagne)]" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--champagne)]">
                Reservations Desk
              </p>
            </div>
            <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
              New Guest Reservation
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Guest Name & Email */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-foreground">Guest Full Name *</label>
              <input
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Lord Alistair Finch"
                className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-[var(--champagne)]"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Guest Contact Email</label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="alistair@finchholdings.com"
                className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-[var(--champagne)]"
              />
            </div>
          </div>

          {/* Phone & Loyalty Tier */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-foreground">Contact Phone</label>
              <input
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+91 98200 12345"
                className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-[var(--champagne)]"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Loyalty Tier</label>
              <select
                value={loyaltyTier}
                onChange={(e) => setLoyaltyTier(e.target.value as any)}
                className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-[var(--champagne)]"
              >
                <option value="VIP">VIP Tier (Highest Recognition)</option>
                <option value="Platinum">Platinum Palm Member</option>
                <option value="Gold">Gold Orchid Member</option>
                <option value="Silver">Silver Coral Member</option>
              </select>
            </div>
          </div>

          {/* Suite Selection & Capacity */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-foreground">Select Villa / Suite</label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-[var(--champagne)]"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.code} - {r.name} ({r.ratePerNight}/nt)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-foreground">Guests Count</label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number.parseInt(e.target.value, 10))}
                className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-[var(--champagne)]"
              >
                <option value={1}>1 Guest (Solo Traveler)</option>
                <option value={2}>2 Guests (Couples Stay)</option>
                <option value={3}>3 Guests (Family)</option>
                <option value={4}>4 Guests (Suite Max)</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-foreground">Check-in Date</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-[var(--champagne)]"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Check-out Date</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-[var(--champagne)]"
              />
            </div>
          </div>

          {/* VIP Package Add-on */}
          <div>
            <label className="font-semibold text-foreground">Bespoke Experience Package</label>
            <div className="mt-1.5 grid gap-2 sm:grid-cols-3">
              <label
                className={`flex cursor-pointer flex-col rounded-md border p-2.5 transition-all ${
                  selectedAddon === "helicopter"
                    ? "border-[var(--champagne)] bg-[var(--champagne)]/10"
                    : "border-border bg-card"
                }`}
              >
                <input
                  type="radio"
                  name="addon"
                  value="helicopter"
                  checked={selectedAddon === "helicopter"}
                  onChange={() => setSelectedAddon("helicopter")}
                  className="sr-only"
                />
                <span className="font-semibold text-foreground">Helicopter Transfer</span>
                <span className="text-[10px] text-muted-foreground">+₹45,000 (Helipad arrival)</span>
              </label>

              <label
                className={`flex cursor-pointer flex-col rounded-md border p-2.5 transition-all ${
                  selectedAddon === "yacht"
                    ? "border-[var(--champagne)] bg-[var(--champagne)]/10"
                    : "border-border bg-card"
                }`}
              >
                <input
                  type="radio"
                  name="addon"
                  value="yacht"
                  checked={selectedAddon === "yacht"}
                  onChange={() => setSelectedAddon("yacht")}
                  className="sr-only"
                />
                <span className="font-semibold text-foreground">Sunset Yacht Charter</span>
                <span className="text-[10px] text-muted-foreground">+₹35,000 (Private cruise)</span>
              </label>

              <label
                className={`flex cursor-pointer flex-col rounded-md border p-2.5 transition-all ${
                  selectedAddon === "none"
                    ? "border-[var(--champagne)] bg-[var(--champagne)]/10"
                    : "border-border bg-card"
                }`}
              >
                <input
                  type="radio"
                  name="addon"
                  value="none"
                  checked={selectedAddon === "none"}
                  onChange={() => setSelectedAddon("none")}
                  className="sr-only"
                />
                <span className="font-semibold text-foreground">No Add-on</span>
                <span className="text-[10px] text-muted-foreground">Standard resort stay</span>
              </label>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="font-semibold text-foreground">Concierge Notes & Dietary Needs</label>
            <textarea
              rows={2}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. Chilled Dom Pérignon on arrival, non-dairy, feather-free pillows"
              className="mt-1.5 w-full rounded-md border border-border bg-background p-2.5 text-sm text-foreground outline-none focus:border-[var(--champagne)]"
            />
          </div>

          {/* Total Cost Estimation */}
          <div className="rounded-lg border border-border bg-accent/40 p-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Estimated Total (4 Nights + Add-on):</span>
              <div className="font-mono text-base font-bold text-[var(--champagne)]">
                <CasinoSlotNumber value={formattedTotal} mode="jackpot" />
              </div>
            </div>
          </div>

          {/* Submit / Cancel Buttons */}
          <div className="flex items-center justify-end gap-2.5 border-t border-border/80 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Confirm & Book Suite
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
