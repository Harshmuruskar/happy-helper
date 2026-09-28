import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Filter,
  Flame,
  Plus,
  Search,
  Sparkles,
  UtensilsCrossed,
  Waves,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Account,
  Booking,
  ResortServiceItem,
  ServiceBooking,
  ServiceBookingStatus,
} from "./types";
import { CasinoSlotNumber } from "./CasinoSlotNumber";
import { useCasino } from "./CasinoControl";

interface AmenitiesViewProps {
  services: ResortServiceItem[];
  serviceBookings: ServiceBooking[];
  bookings: Booking[];
  currentAccount: Account;
  onBookService: (booking: Omit<ServiceBooking, "id">) => void;
  onUpdateServiceStatus: (id: string, newStatus: ServiceBookingStatus) => void;
}

export function AmenitiesView({
  services,
  serviceBookings,
  bookings,
  currentAccount,
  onBookService,
  onUpdateServiceStatus,
}: AmenitiesViewProps) {
  const { spinKey } = useCasino();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ResortServiceItem | null>(null);

  // Form state
  const [formGuestName, setFormGuestName] = useState(
    currentAccount.role === "Guest" ? currentAccount.name : ""
  );
  const [formRoomCode, setFormRoomCode] = useState(
    currentAccount.role === "Guest" ? currentAccount.assignedRoomCode || "C-102" : ""
  );
  const [formDate, setFormDate] = useState("2026-09-28");
  const [formTime, setFormTime] = useState("16:00");
  const [formNotes, setFormNotes] = useState("");

  const categories = ["All", "Spa", "Dining", "Experience", "Transport", "Laundry"];

  const filteredServices = services.filter((srv) => {
    if (selectedCategory === "All") return true;
    return srv.category === selectedCategory;
  });

  const handleOpenBookModal = (srv: ResortServiceItem) => {
    setSelectedService(srv);
    if (currentAccount.role === "Guest") {
      setFormGuestName(currentAccount.name);
      setFormRoomCode(currentAccount.assignedRoomCode || "C-102");
    } else if (bookings.length > 0) {
      setFormGuestName(bookings[0].guestName);
      setFormRoomCode(bookings[0].roomCode);
    }
    setBookingModalOpen(true);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    // Find linked reservation
    const matched = bookings.find((b) => b.guestName.toLowerCase() === formGuestName.toLowerCase()) || bookings[0];

    onBookService({
      reservationId: matched?.id || "BK-8095",
      guestName: formGuestName || "Dr. Elena Rostova",
      roomCode: formRoomCode || "C-102",
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      category: selectedService.category,
      amount: selectedService.price,
      scheduledDate: formDate,
      scheduledTime: formTime,
      status: "Requested",
      notes: formNotes || "Requested via RRMS Service Desk",
    });

    setBookingModalOpen(false);
    setSelectedService(null);
    setFormNotes("");
  };

  const getStatusBadge = (status: ServiceBookingStatus) => {
    switch (status) {
      case "Requested":
        return <Badge variant="outline">Requested</Badge>;
      case "Accepted":
        return <Badge variant="secondary">Accepted</Badge>;
      case "In progress":
        return <Badge variant="sunset">In Progress</Badge>;
      case "Completed":
        return <Badge variant="gold">Completed · Folio Posted</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--champagne)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--champagne)]">
              5-Star Bespoke Hospitality Experiences
            </p>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Resort Amenities & Concierge Services
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground sm:text-sm">
            Browse world-class spa rituals, private beachfront culinary experiences, yacht charters, and bespoke chauffeur services.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            onClick={() => handleOpenBookModal(services[0])}
            className="h-8 gap-1.5 bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-3.5" />
            Book Service
          </Button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border/80 bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Menu Grid */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Curated Service Catalog
        </h2>
        <p className="text-xs text-muted-foreground">
          Available on-demand with private villa dispatch and direct folio integration.
        </p>

        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="resort-card flex flex-col justify-between p-5 transition-all hover:border-[var(--champagne)]/60"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline">{srv.category}</Badge>
                  <span className="font-mono text-xs text-muted-foreground">
                    {srv.duration}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-lg font-bold text-foreground">
                  {srv.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {srv.description}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Tariff
                  </p>
                  <p className="font-mono text-base font-bold text-[var(--champagne)]">
                    <CasinoSlotNumber
                      value={srv.price}
                      spinTrigger={spinKey}
                      prefix="₹"
                    />
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenBookModal(srv)}
                  className="h-8 border-border text-xs hover:border-[var(--champagne)] hover:text-[var(--champagne)]"
                >
                  Book Service
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Bookings Pipeline (Operations & Guest view) */}
      <div className="resort-card p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              Scheduled Guest Service Bookings
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Active concierge dispatches, wellness appointments, and dining orders.
            </p>
          </div>
          <Badge variant="gold">
            {serviceBookings.length} Active Requests
          </Badge>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="resort-table w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-3 px-3">Booking ID</th>
                <th className="py-3 px-3">Service</th>
                <th className="py-3 px-3">Guest & Suite</th>
                <th className="py-3 px-3">Schedule</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {serviceBookings.map((sbk) => (
                <tr key={sbk.id} className="border-b border-border/60">
                  <td className="py-3 px-3 font-mono font-semibold text-foreground">
                    {sbk.id}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-foreground">{sbk.serviceName}</p>
                    <span className="text-[11px] text-muted-foreground">
                      {sbk.category} · {sbk.notes}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-foreground">{sbk.guestName}</p>
                    <span className="font-mono text-[11px] text-[var(--champagne)]">
                      Suite {sbk.roomCode}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 font-mono text-[11px] text-foreground">
                      <Calendar className="size-3 text-muted-foreground" />
                      {sbk.scheduledDate}
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                      <Clock className="size-3" />
                      {sbk.scheduledTime}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-foreground">
                    ₹{sbk.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    {getStatusBadge(sbk.status)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {sbk.status === "Requested" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateServiceStatus(sbk.id, "Accepted")}
                          className="h-7 text-[11px]"
                        >
                          Accept
                        </Button>
                      )}
                      {sbk.status === "Accepted" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateServiceStatus(sbk.id, "In progress")}
                          className="h-7 text-[11px]"
                        >
                          Start
                        </Button>
                      )}
                      {sbk.status === "In progress" && (
                        <Button
                          size="sm"
                          onClick={() => onUpdateServiceStatus(sbk.id, "Completed")}
                          className="h-7 bg-[var(--champagne)] text-black hover:bg-[var(--champagne)]/90 text-[11px]"
                        >
                          Complete & Post Folio
                        </Button>
                      )}
                      {sbk.status === "Completed" && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--sage)]">
                          <CheckCircle2 className="size-3.5" />
                          Folio Updated
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Service Modal */}
      {bookingModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setBookingModalOpen(false)}
          />

          <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-border pb-3.5">
              <div>
                <Badge variant="gold">{selectedService.category}</Badge>
                <h3 className="mt-1.5 font-display text-xl font-bold text-foreground">
                  Book {selectedService.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Tariff: ₹{selectedService.price.toLocaleString()} ({selectedService.duration})
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setBookingModalOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmitBooking} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">
                  Guest Name
                </label>
                <input
                  type="text"
                  required
                  value={formGuestName}
                  onChange={(e) => setFormGuestName(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  placeholder="e.g. Dr. Elena Rostova"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Suite / Villa Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formRoomCode}
                    onChange={(e) => setFormRoomCode(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                    placeholder="e.g. C-102"
                  />
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Preferred Time Slot
                </label>
                <select
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                >
                  <option value="09:00">09:00 AM (Morning Ocean Sanctuary)</option>
                  <option value="11:30">11:30 AM (Midday Calm)</option>
                  <option value="14:00">02:00 PM (Afternoon Retreat)</option>
                  <option value="16:00">04:00 PM (Sunset Warmth)</option>
                  <option value="17:30">05:30 PM (Golden Hour Special)</option>
                  <option value="19:30">07:30 PM (Evening Twilight)</option>
                  <option value="21:00">09:00 PM (Night Starlight)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Special Notes & Preferences
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  placeholder="Aroma preferences, dietary allergies, sommelier requests..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setBookingModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Confirm Reservation (₹{selectedService.price.toLocaleString()})
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
