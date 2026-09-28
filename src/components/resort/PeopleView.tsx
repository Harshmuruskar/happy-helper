import { useState } from "react";
import {
  Award,
  CheckCircle2,
  Clock,
  Edit3,
  Filter,
  Gift,
  HelpCircle,
  LifeBuoy,
  MessageSquare,
  Plus,
  Search,
  Send,
  Sparkles,
  Star,
  User,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Account,
  Guest,
  GuestReview,
  SupportTicket,
  SupportTicketCategory,
  SupportTicketStatus,
} from "./types";
import { CasinoSlotNumber } from "./CasinoSlotNumber";
import { useCasino } from "./CasinoControl";
import { initialAccounts } from "./resortData";

interface PeopleViewProps {
  guests: Guest[];
  supportTickets: SupportTicket[];
  reviews: GuestReview[];
  currentAccount: Account;
  onSelectGuest: (guest: Guest) => void;
  onCreateSupportTicket: (ticket: Omit<SupportTicket, "id" | "createdAt">) => void;
  onUpdateSupportTicket: (ticketId: string, status: SupportTicketStatus, response?: string) => void;
  onSubmitReview: (review: Omit<GuestReview, "id" | "date">) => void;
  onUpdateReview: (reviewId: string, review: Partial<GuestReview>) => void;
  onRedeemLoyalty: (guestId: string, points: number, creditAmount: number) => void;
}

export function PeopleView({
  guests,
  supportTickets,
  reviews,
  currentAccount,
  onSelectGuest,
  onCreateSupportTicket,
  onUpdateSupportTicket,
  onSubmitReview,
  onUpdateReview,
  onRedeemLoyalty,
}: PeopleViewProps) {
  const { spinKey } = useCasino();
  const [activeTab, setActiveTab] = useState<"guests" | "staff" | "support" | "loyalty" | "reviews">("guests");

  // Support ticket form modal state
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketCategory, setTicketCategory] = useState<SupportTicketCategory>("Request");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketPriority, setTicketPriority] = useState<"Standard" | "High" | "Urgent">("Standard");
  const [ticketGuestName, setTicketGuestName] = useState(
    currentAccount.role === "Guest" ? currentAccount.name : "Dr. Elena Rostova"
  );
  const [ticketRoomCode, setTicketRoomCode] = useState(
    currentAccount.role === "Guest" ? currentAccount.assignedRoomCode || "C-102" : "C-102"
  );

  // Ticket reply modal state (for staff)
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [staffReplyText, setStaffReplyText] = useState("");
  const [staffReplyStatus, setStaffReplyStatus] = useState<SupportTicketStatus>("Resolved");

  // Review form modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewOverall, setReviewOverall] = useState(5);
  const [reviewRoom, setReviewRoom] = useState(5);
  const [reviewService, setReviewService] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  const supportCategories: SupportTicketCategory[] = [
    "Request",
    "Complaint",
    "Maintenance",
    "Food & Beverage",
    "Housekeeping",
    "Property care",
    "Inspections",
    "Lost & found",
    "Receptionist",
    "Cashier",
    "Gardener",
    "Spa",
  ];

  const handleOpenTicketModal = () => {
    if (currentAccount.role === "Guest") {
      setTicketGuestName(currentAccount.name);
      setTicketRoomCode(currentAccount.assignedRoomCode || "C-102");
    }
    setTicketModalOpen(true);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSupportTicket({
      guestId: currentAccount.assignedGuestId || "GST-5",
      guestName: ticketGuestName,
      roomCode: ticketRoomCode,
      subject: ticketSubject,
      description: ticketDescription,
      category: ticketCategory,
      priority: ticketPriority,
      status: "Open",
    });

    setTicketModalOpen(false);
    setTicketSubject("");
    setTicketDescription("");
  };

  const handleOpenReplyModal = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setStaffReplyText(ticket.response || "");
    setStaffReplyStatus(ticket.status === "Open" ? "In progress" : ticket.status);
    setReplyModalOpen(true);
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    onUpdateSupportTicket(selectedTicket.id, staffReplyStatus, staffReplyText);
    setReplyModalOpen(false);
    setSelectedTicket(null);
  };

  // Review submission
  const handleOpenNewReview = () => {
    setEditingReviewId(null);
    setReviewOverall(5);
    setReviewRoom(5);
    setReviewService(5);
    setReviewTitle("");
    setReviewComment("");
    setReviewModalOpen(true);
  };

  const handleOpenEditReview = (rev: GuestReview) => {
    setEditingReviewId(rev.id);
    setReviewOverall(rev.overallRating);
    setReviewRoom(rev.roomRating);
    setReviewService(rev.serviceRating);
    setReviewTitle(rev.title);
    setReviewComment(rev.comment);
    setReviewModalOpen(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReviewId) {
      onUpdateReview(editingReviewId, {
        overallRating: reviewOverall,
        roomRating: reviewRoom,
        serviceRating: reviewService,
        title: reviewTitle,
        comment: reviewComment,
      });
    } else {
      onSubmitReview({
        reservationId: "BK-8095",
        guestId: currentAccount.assignedGuestId || "GST-5",
        guestName: currentAccount.role === "Guest" ? currentAccount.name : "Dr. Elena Rostova",
        roomName: "Cliffside Sanctuary Villa (C-102)",
        overallRating: reviewOverall,
        roomRating: reviewRoom,
        serviceRating: reviewService,
        title: reviewTitle,
        comment: reviewComment,
        verifiedStay: true,
      });
    }

    setReviewModalOpen(false);
    setEditingReviewId(null);
  };

  // Interactive 5-star rating component
  const renderStarInput = (val: number, setVal: (n: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setVal(star)}
            className="p-1 transition-transform hover:scale-125 focus:outline-none"
          >
            <Star
              className={`size-5 ${
                star <= val
                  ? "fill-[var(--champagne)] text-[var(--champagne)]"
                  : "text-border fill-transparent"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const filteredGuests = guests.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.loyaltyTier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--champagne)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--champagne)]">
              Guest Relations & Staff Directory
            </p>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            People, Loyalty & Guest Support
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground sm:text-sm">
            Profiles for high-net-worth VIP patrons, staff duty shifts, help & support ticketing desk, loyalty point redemptions, and verified reviews.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            {[
              { id: "guests", label: "Guests" },
              { id: "staff", label: "Staff Roster" },
              { id: "support", label: "Help & Support" },
              { id: "loyalty", label: "Loyalty Club" },
              { id: "reviews", label: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "support" && (
            <Button
              size="sm"
              onClick={handleOpenTicketModal}
              className="h-8 gap-1.5 bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="size-3.5" />
              New Request Ticket
            </Button>
          )}

          {activeTab === "reviews" && (
            <Button
              size="sm"
              onClick={handleOpenNewReview}
              className="h-8 gap-1.5 bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90"
            >
              <Star className="size-3.5" />
              Write Review
            </Button>
          )}
        </div>
      </div>

      {/* TAB 1: GUESTS DIRECTORY */}
      {activeTab === "guests" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search guest name, tier, country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-xs text-foreground outline-none focus:border-[var(--champagne)]"
              />
            </div>
            <Badge variant="gold">
              {filteredGuests.length} VIP Patrons Registered
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGuests.map((gst) => (
              <div
                key={gst.id}
                onClick={() => onSelectGuest(gst)}
                className="resort-card flex cursor-pointer flex-col justify-between p-5 transition-all hover:border-[var(--champagne)]/60"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="flex size-11 items-center justify-center rounded-full border border-[var(--champagne)]/60 bg-[var(--champagne)] font-display text-sm font-bold text-black shadow-sm">
                      {gst.avatar}
                    </span>
                    <Badge variant={gst.loyaltyTier === "VIP" ? "sunset" : "gold"}>
                      {gst.loyaltyTier} Tier
                    </Badge>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-bold text-foreground">
                    {gst.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {gst.country} · {gst.email}
                  </p>

                  <div className="mt-4 rounded-lg border border-border/60 bg-accent/40 p-2.5 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground text-[11px] mb-0.5">
                      Bespoke Guest Preferences
                    </p>
                    <p className="italic line-clamp-2">{gst.preferences}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-3 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                      Lifetime Spend
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {gst.totalSpent}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                      Loyalty Points
                    </span>
                    <span className="font-mono font-bold text-[var(--champagne)]">
                      <CasinoSlotNumber value={gst.loyaltyPoints} spinTrigger={spinKey} /> Pts
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: STAFF ROSTER */}
      {activeTab === "staff" && (
        <div className="resort-card p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Resort Executive & Operational Staff Roster
              </h2>
              <p className="text-xs text-muted-foreground">
                Department duties, active roster shifts, and communication directory.
              </p>
            </div>
            <Badge variant="outline">
              {initialAccounts.filter((a) => a.module !== "Guest").length} Active Personnel
            </Badge>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="resort-table w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-3 px-3">Staff Member</th>
                  <th className="py-3 px-3">Designation / Role</th>
                  <th className="py-3 px-3">Department Module</th>
                  <th className="py-3 px-3">Shift Roster</th>
                  <th className="py-3 px-3">Official Email</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {initialAccounts
                  .filter((a) => a.module !== "Guest")
                  .map((staff) => (
                    <tr key={staff.id} className="border-b border-border/50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex size-8 items-center justify-center rounded-full bg-accent font-display font-bold text-foreground">
                            {staff.avatar}
                          </span>
                          <div>
                            <p className="font-semibold text-foreground">{staff.name}</p>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {staff.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-foreground">
                        {staff.role}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={staff.module === "Management" ? "gold" : "secondary"}>
                          {staff.module}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">
                        {staff.shift}
                      </td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">
                        {staff.email}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="inline-flex items-center gap-1 font-semibold text-[var(--sage)]">
                          <span className="size-1.5 rounded-full bg-[var(--sage)]" />
                          On Duty
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: HELP & SUPPORT TICKETS */}
      {activeTab === "support" && (
        <div className="resort-card p-6">
          <div className="flex flex-col justify-between gap-2 border-b border-border pb-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Help & Concierge Support Desk
              </h2>
              <p className="text-xs text-muted-foreground">
                Real-time tickets across 12 resort categories with instant staff resolution.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="sunset">
                {supportTickets.filter((t) => t.status !== "Resolved").length} Open / In Progress
              </Badge>
              <Button size="sm" onClick={handleOpenTicketModal} className="h-7 text-xs">
                <Plus className="size-3 mr-1" /> Request Support
              </Button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="resort-table w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-3 px-3">Ticket ID</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Subject & Details</th>
                  <th className="py-3 px-3">Guest & Suite</th>
                  <th className="py-3 px-3">Assigned Staff</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {supportTickets.map((tck) => (
                  <tr key={tck.id} className="border-b border-border/50">
                    <td className="py-3 px-3 font-mono font-semibold text-foreground">
                      {tck.id}
                    </td>
                    <td className="py-3 px-3">
                      <span className="rounded bg-accent px-2 py-0.5 text-[11px] font-semibold text-foreground">
                        {tck.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <p className="font-semibold text-foreground">{tck.subject}</p>
                      <p className="text-muted-foreground line-clamp-1">{tck.description}</p>
                      {tck.response && (
                        <p className="mt-1 text-[11px] text-[var(--sage)] italic">
                          Staff response: {tck.response}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-foreground">{tck.guestName}</p>
                      <span className="font-mono text-[11px] text-[var(--champagne)]">
                        Suite {tck.roomCode}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {tck.assignedStaff || "Front Desk Pool"}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={tck.status === "Resolved" ? "gold" : tck.status === "In progress" ? "sunset" : "outline"}>
                        {tck.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenReplyModal(tck)}
                        className="h-7 text-[11px]"
                      >
                        {currentAccount.role === "Guest" ? "View" : "Reply / Update"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: LOYALTY CLUB & REWARDS */}
      {activeTab === "loyalty" && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 resort-card p-6 sm:p-8">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--champagne)]">
                  Palm Grove Privileges Club
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold text-foreground">
                  Tier Privileges & Rewards Ledger
                </h2>
                <p className="text-xs text-muted-foreground">
                  Earn 10 points for every ₹1,000 spent across villas, dining, yacht charters, and spa rituals.
                </p>
              </div>
              <Award className="size-8 text-[var(--champagne)]" />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-accent/30 p-4">
                <Badge variant="outline">Silver Tier</Badge>
                <p className="mt-2 text-xs font-semibold text-foreground">0 — 999 Pts</p>
                <ul className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                  <li>• Welcome tropical fruit platter</li>
                  <li>• High-speed fiber internet</li>
                  <li>• 5% discount on yacht charters</li>
                </ul>
              </div>

              <div className="rounded-xl border border-[var(--champagne)]/40 bg-[var(--gold-soft)]/20 p-4">
                <Badge variant="gold">Gold Tier</Badge>
                <p className="mt-2 text-xs font-semibold text-foreground">1,000 — 4,999 Pts</p>
                <ul className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                  <li>• Priority villa upgrade at check-in</li>
                  <li>• Daily Ayurvedic herbal bath prep</li>
                  <li>• Late checkout up to 14:00 PM</li>
                </ul>
              </div>

              <div className="rounded-xl border border-[var(--sunset)]/40 bg-[var(--sunset)]/10 p-4">
                <Badge variant="sunset">Platinum / VIP</Badge>
                <p className="mt-2 text-xs font-semibold text-foreground">5,000+ Pts</p>
                <ul className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                  <li>• Rolls-Royce Ghost airport transfer</li>
                  <li>• Dedicated 24/7 private butler</li>
                  <li>• Unlimited Sommelier reserve tasting</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 resort-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground">
              Redeem Loyalty Folio Credits
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Instant ₹ conversion applied directly to your stay invoice.
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Active Guest Account</p>
                <p className="text-base font-bold text-foreground">
                  {currentAccount.role === "Guest" ? currentAccount.name : "Dr. Elena Rostova"}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Current Balance:</span>
                  <span className="font-mono text-base font-bold text-[var(--champagne)]">
                    <CasinoSlotNumber value="1250" spinTrigger={spinKey} /> Points
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-border/80 bg-accent/30 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">Redeem 500 Pts:</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRedeemLoyalty("GST-5", 500, 2500)}
                    className="h-7 text-xs"
                  >
                    Apply ₹2,500 Folio Credit
                  </Button>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-border/60 pt-3">
                  <span className="font-medium text-foreground">Redeem 1,000 Pts:</span>
                  <Button
                    size="sm"
                    onClick={() => onRedeemLoyalty("GST-5", 1000, 5000)}
                    className="h-7 bg-[var(--champagne)] text-black hover:bg-[var(--champagne)]/90 text-xs"
                  >
                    Apply ₹5,000 Folio Credit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REVIEWS & FEEDBACK */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Verified Guest Reviews & Hospitality Ratings
              </h2>
              <p className="text-xs text-muted-foreground">
                5-star multi-dimensional feedback from verified villa residents.
              </p>
            </div>
            <Button size="sm" onClick={handleOpenNewReview} className="h-8 gap-1.5 text-xs">
              <Star className="size-3.5" />
              Write a Review
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="resort-card flex flex-col justify-between p-6 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1 text-[var(--champagne)]">
                      {Array.from({ length: rev.overallRating }).map((_, i) => (
                        <Star key={i} className="size-4 fill-[var(--champagne)] text-[var(--champagne)]" />
                      ))}
                    </div>
                    {rev.verifiedStay && (
                      <Badge variant="gold">Verified Stay</Badge>
                    )}
                  </div>

                  <h3 className="mt-3 font-display text-base font-bold text-foreground">
                    "{rev.title}"
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {rev.comment}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                    <div>
                      <span>Room Quality: </span>
                      <strong className="text-foreground">{rev.roomRating}/5</strong>
                    </div>
                    <div>
                      <span>Service Level: </span>
                      <strong className="text-foreground">{rev.serviceRating}/5</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3 text-xs">
                  <div>
                    <p className="font-semibold text-foreground">{rev.guestName}</p>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {rev.roomName} · {rev.date}
                    </span>
                  </div>

                  {rev.guestId === (currentAccount.assignedGuestId || "GST-5") && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEditReview(rev)}
                      className="h-7 text-xs text-[var(--champagne)] hover:text-[var(--champagne)]/80"
                    >
                      <Edit3 className="size-3 mr-1" /> Edit
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Support Ticket Modal */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setTicketModalOpen(false)}
          />

          <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Submit Support / Service Request
                </h3>
                <p className="text-xs text-muted-foreground">
                  Front Desk, In-Suite Butler, Housekeeping, or Maintenance dispatch.
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setTicketModalOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmitTicket} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Request Category
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  >
                    {supportCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Urgency Priority
                  </label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  >
                    <option value="Standard">Standard</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent / Immediate Attention</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  placeholder="e.g. In-suite dining table setting request"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Full Description & Timing Details
                </label>
                <textarea
                  rows={3}
                  required
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  placeholder="Describe your request or concern in detail..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setTicketModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Transmit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Reply / Update Modal */}
      {replyModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setReplyModalOpen(false)}
          />

          <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <Badge variant="gold">Ticket #{selectedTicket.id}</Badge>
                <h3 className="mt-1 font-display text-lg font-bold text-foreground">
                  {selectedTicket.subject}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Guest: {selectedTicket.guestName} · Suite {selectedTicket.roomCode}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setReplyModalOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>

            <div className="my-3 rounded-lg border border-border/60 bg-accent/30 p-3 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Guest Request:</p>
              <p className="mt-1">{selectedTicket.description}</p>
            </div>

            <form onSubmit={handleSubmitReply} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">
                  Update Ticket Status
                </label>
                <select
                  value={staffReplyStatus}
                  onChange={(e) => setStaffReplyStatus(e.target.value as any)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                >
                  <option value="Open">Open</option>
                  <option value="In progress">In Progress</option>
                  <option value="Resolved">Resolved & Closed</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Staff Response / Resolution Message
                </label>
                <textarea
                  rows={3}
                  required
                  value={staffReplyText}
                  onChange={(e) => setStaffReplyText(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  placeholder="Explain actions taken or timeline for resolution..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setReplyModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Save Ticket Response
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal (Create / Edit) */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setReviewModalOpen(false)}
          />

          <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  {editingReviewId ? "Edit Your Review" : "Leave a 5-Star Stay Review"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Share your experience at Palm Grove Coastal Resort.
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setReviewModalOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmitReview} className="mt-4 space-y-4 text-xs">
              <div className="space-y-3 rounded-lg border border-border bg-accent/30 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Overall Resort Experience:</span>
                  {renderStarInput(reviewOverall, setReviewOverall)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Villa Suite & Comfort:</span>
                  {renderStarInput(reviewRoom, setReviewRoom)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Staff & Concierge Hospitality:</span>
                  {renderStarInput(reviewService, setReviewService)}
                </div>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  placeholder="e.g. Unforgettable beachfront serenity"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Detailed Guest Feedback
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  placeholder="Tell future visitors about the culinary offerings, villa features, and sunset vistas..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setReviewModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {editingReviewId ? "Update Review" : "Publish Review"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
