import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  const [step, setStep] = useState(1);
  
  // Form State
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [loyaltyTier, setLoyaltyTier] = useState<"Platinum" | "Gold" | "Silver" | "VIP">("Gold");
  
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || "");
  const [checkIn, setCheckIn] = useState("2026-10-01");
  const [checkOut, setCheckOut] = useState("2026-10-05");
  const [guestsCount, setGuestsCount] = useState(2);
  const [bookingSource, setBookingSource] = useState("Direct");
  
  const [specialRequests, setSpecialRequests] = useState("");
  const [selectedAddon, setSelectedAddon] = useState<string>("none");
  const [discountCode, setDiscountCode] = useState("");

  if (!open) return null;

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];
  const rateNum = Number.parseInt(selectedRoom?.ratePerNight.replace(/\D/g, "") || "30000", 10);
  const nights = 4; // Hardcoded for demo, normally diff(checkIn, checkOut)
  const addonCost = selectedAddon === "helicopter" ? 45000 : selectedAddon === "yacht" ? 35000 : 0;
  const discountMultiplier = discountCode.toLowerCase() === "vip10" ? 0.9 : 1;
  
  const totalAmountNum = (rateNum * nights + addonCost) * discountMultiplier;
  const formattedTotal = `₹${totalAmountNum.toLocaleString("en-IN")}`;

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = () => {
    if (!guestName.trim() || !selectedRoom) return;

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
    setTimeout(() => setStep(1), 500); // reset step after close
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Crisp Solid Overlay */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div className="resort-card relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto border border-border bg-card p-8 shadow-2xl rise">
        <div className="flex items-center justify-between pb-4">
          <div>
            <p className="editorial-kicker">Reservation Wizard</p>
            <h2 className="editorial-heading mt-2">
              New <em>Guest Booking</em>
            </h2>
          </div>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
            onClick={onClose}
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Wizard Stepper */}
        <div className="mb-8 flex items-center justify-between px-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          {[1, 2, 3, 4, 5].map((st) => (
            <div key={st} className="flex items-center gap-2">
              <span
                className={`flex size-6 items-center justify-center rounded-full ${
                  step === st
                    ? "bg-foreground text-background"
                    : step > st
                    ? "bg-[var(--champagne)] text-black"
                    : "border border-border text-muted-foreground"
                }`}
              >
                {step > st ? <CheckCircle2 className="size-3.5" /> : st}
              </span>
              {st < 5 && <span className="h-px w-8 bg-border/60 max-sm:w-4" />}
            </div>
          ))}
        </div>

        <div className="min-h-[300px]">
          {/* STEP 1: GUEST DETAILS */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="font-display text-xl text-foreground">Step 1: Guest Information</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="editorial-label">Guest Full Name *</label>
                  <Input
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Lord Alistair Finch"
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="editorial-label">Contact Email</label>
                  <Input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="alistair@finchholdings.com"
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="editorial-label">Contact Phone</label>
                  <Input
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="editorial-label">Loyalty Tier</label>
                  <select
                    value={loyaltyTier}
                    onChange={(e) => setLoyaltyTier(e.target.value as any)}
                    className="mt-2 flex h-10 w-full rounded-none border-0 border-b border-border/60 bg-transparent px-0 py-2 text-base outline-none focus:border-foreground transition-colors"
                  >
                    <option value="VIP">VIP Tier</option>
                    <option value="Platinum">Platinum Palm</option>
                    <option value="Gold">Gold Orchid</option>
                    <option value="Silver">Silver Coral</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DATES & ROOM */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="font-display text-xl text-foreground">Step 2: Dates & Suite Selection</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="editorial-label">Check-in Date</label>
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="editorial-label">Check-out Date</label>
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="editorial-label">Suite / Villa</label>
                  <select
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="mt-2 flex h-10 w-full rounded-none border-0 border-b border-border/60 bg-transparent px-0 py-2 text-base outline-none focus:border-foreground transition-colors"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.code} - {r.name} ({r.ratePerNight}/nt)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="editorial-label">Guests Count</label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number.parseInt(e.target.value, 10))}
                    className="mt-2 flex h-10 w-full rounded-none border-0 border-b border-border/60 bg-transparent px-0 py-2 text-base outline-none focus:border-foreground transition-colors"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                  </select>
                </div>
                <div>
                  <label className="editorial-label">Booking Source</label>
                  <select
                    value={bookingSource}
                    onChange={(e) => setBookingSource(e.target.value)}
                    className="mt-2 flex h-10 w-full rounded-none border-0 border-b border-border/60 bg-transparent px-0 py-2 text-base outline-none focus:border-foreground transition-colors"
                  >
                    <option value="Direct">Direct</option>
                    <option value="OTA">OTA (Booking/Expedia)</option>
                    <option value="Agent">Travel Agent</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: OFFERS & NOTES */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="font-display text-xl text-foreground">Step 3: Offers & Requests</h3>
              <div>
                <label className="editorial-label">Experience Add-ons</label>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label
                    className={`flex cursor-pointer flex-col rounded-lg border p-4 transition-all ${
                      selectedAddon === "helicopter"
                        ? "border-foreground bg-accent"
                        : "border-border/60 bg-transparent"
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
                    <span className="mt-1 text-sm text-muted-foreground">+₹45,000</span>
                  </label>
                  <label
                    className={`flex cursor-pointer flex-col rounded-lg border p-4 transition-all ${
                      selectedAddon === "none"
                        ? "border-foreground bg-accent"
                        : "border-border/60 bg-transparent"
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
                    <span className="font-semibold text-foreground">No Add-ons</span>
                    <span className="mt-1 text-sm text-muted-foreground">Standard stay</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="editorial-label">Discount Code (Promo)</label>
                <Input
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="e.g. VIP10"
                  className="mt-2"
                />
              </div>
              <div>
                <label className="editorial-label">Concierge Notes</label>
                <Input
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Dietary needs, arrival preferences..."
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="font-display text-xl text-foreground">Step 4: Review Details</h3>
              <div className="rounded-xl border border-border/80 bg-accent/30 p-6 space-y-4">
                <div className="flex justify-between border-b border-border/80 pb-2">
                  <span className="text-sm text-muted-foreground">Guest</span>
                  <span className="font-medium text-foreground">{guestName || "—"}</span>
                </div>
                <div className="flex justify-between border-b border-border/80 pb-2">
                  <span className="text-sm text-muted-foreground">Suite</span>
                  <span className="font-medium text-foreground">{selectedRoom?.name}</span>
                </div>
                <div className="flex justify-between border-b border-border/80 pb-2">
                  <span className="text-sm text-muted-foreground">Stay</span>
                  <span className="font-medium text-foreground">{checkIn} to {checkOut} (4 Nights)</span>
                </div>
                <div className="flex justify-between border-b border-border/80 pb-2">
                  <span className="text-sm text-muted-foreground">Base Rate</span>
                  <span className="font-medium text-foreground">{selectedRoom?.ratePerNight} / nt</span>
                </div>
                {selectedAddon !== "none" && (
                  <div className="flex justify-between border-b border-border/80 pb-2">
                    <span className="text-sm text-muted-foreground">Add-on</span>
                    <span className="font-medium text-foreground">₹{addonCost.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {discountCode.toLowerCase() === "vip10" && (
                  <div className="flex justify-between border-b border-border/80 pb-2 text-[var(--sage)]">
                    <span className="text-sm">Discount</span>
                    <span className="font-medium">-10% applied</span>
                  </div>
                )}
                <div className="flex justify-between pt-2">
                  <span className="font-bold text-foreground">Estimated Total</span>
                  <span className="font-display text-xl font-bold text-[var(--champagne)]">
                    <CasinoSlotNumber value={formattedTotal} interactive={false} />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: CREDENTIALS */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col items-center justify-center text-center pt-8">
              <div className="flex size-16 items-center justify-center rounded-full bg-[var(--champagne)]/20 text-[var(--champagne)] mb-4">
                <Sparkles className="size-8" />
              </div>
              <h3 className="font-display text-2xl text-foreground">Generate Credentials</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                The reservation is ready to be confirmed. Would you like to generate the mobile key and guest portal access credentials now?
              </p>
              
              <div className="w-full max-w-xs mt-6 space-y-3">
                <div className="rounded border border-border bg-card p-3 text-sm flex justify-between">
                  <span className="text-muted-foreground">Portal Pin:</span>
                  <span className="font-mono font-bold tracking-widest">{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="rounded border border-border bg-card p-3 text-sm flex justify-between">
                  <span className="text-muted-foreground">WiFi Pass:</span>
                  <span className="font-mono font-bold text-[var(--ocean)]">PALM-{selectedRoom?.code}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Controls */}
        <div className="mt-10 flex items-center justify-between border-t border-border/80 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={step === 1 ? onClose : handlePrev}
            className="text-muted-foreground hover:text-foreground hover:bg-accent h-10 px-4"
          >
            {step === 1 ? "Cancel" : <><ChevronLeft className="mr-2 size-4" /> Back</>}
          </Button>

          {step < 5 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-foreground text-background hover:bg-foreground/90 h-10 px-6 font-medium"
            >
              Next Step <ChevronRight className="ml-2 size-4" />
            </Button>
          ) : (
             <Button
              type="button"
              onClick={handleSubmit}
              className="bg-[var(--champagne)] text-black hover:bg-[var(--champagne)]/90 h-10 px-6 font-semibold shadow-xl"
            >
              Confirm & Book Suite
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
