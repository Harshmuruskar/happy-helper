import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Archive,
  BedDouble,
  Bell,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  CloudFog,
  ConciergeBell,
  CreditCard,
  Crown,
  FileText,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Receipt,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  Users,
  UtensilsCrossed,
  Waves,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Account,
  Booking,
  BookingStatus,
  FolioPayment,
  Guest,
  GuestReview,
  HousekeepingTask,
  LostAndFoundItem,
  ModuleTab,
  OrderStage,
  PromotionCode,
  ReservationFolio,
  ResortNotification,
  ResortPolicy,
  ResortServiceItem,
  RestaurantOrder,
  Room,
  RoomStatus,
  ServiceBooking,
  ServiceBookingStatus,
  SupportTicket,
  SupportTicketStatus,
  TaskStatus,
} from "@/components/resort/types";
import {
  initialAccounts,
  initialBookings,
  initialFolios,
  initialGuests,
  initialHousekeeping,
  initialLostAndFound,
  initialNotifications,
  initialOrders,
  initialPolicies,
  initialPromotions,
  initialReviews,
  initialRooms,
  initialServiceBookings,
  initialServices,
  initialSupportTickets,
  rolePermissions,
} from "@/components/resort/resortData";

import { DashboardView } from "@/components/resort/DashboardView";
import { BookingsView } from "@/components/resort/BookingsView";
import { RoomsView } from "@/components/resort/RoomsView";
import { PeopleView } from "@/components/resort/PeopleView";
import { AmenitiesView } from "@/components/resort/AmenitiesView";
import { BillingView } from "@/components/resort/BillingView";
import { OperationsView } from "@/components/resort/OperationsView";
import { AdministrationView } from "@/components/resort/AdministrationView";
import { GuestPortalView } from "@/components/resort/GuestPortalView";

import { NewBookingModal } from "@/components/resort/NewBookingModal";
import { BookingDetailModal } from "@/components/resort/BookingDetailModal";
import { NotificationsDrawer } from "@/components/resort/NotificationsDrawer";
import { PersonaSwitcherModal } from "@/components/resort/PersonaSwitcherModal";
import { CasinoProvider, CasinoRollButton } from "@/components/resort/CasinoControl";
import { CasinoSlotNumber } from "@/components/resort/CasinoSlotNumber";
import { ResortSidebar } from "@/components/resort/ResortSidebar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Palm Grove Coastal Resort — 5-Star Luxury RRMS" },
      {
        name: "description",
        content:
          "5-Star Luxury Resort Resource Management System for Palm Grove Coastal Resort. Seamless front desk, reservations, concierge services, folio billing, operations, and guest portal.",
      },
      { property: "og:title", content: "Palm Grove Coastal Resort — RRMS Operations" },
      {
        property: "og:description",
        content:
          "5-Star Luxury Resort Management System with Golden Sunrise aesthetic.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResortApp,
});

export function ResortApp() {
  const [activeTab, setActiveTab] = useState<ModuleTab>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Authentication & Persona state (default General Manager)
  const [currentAccount, setCurrentAccount] = useState<Account>(initialAccounts[0]!);
  const [personaModalOpen, setPersonaModalOpen] = useState(false);

  // Core RRMS State
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [orders, setOrders] = useState<RestaurantOrder[]>(initialOrders);
  const [tasks, setTasks] = useState<HousekeepingTask[]>(initialHousekeeping);
  const [notifications, setNotifications] = useState<ResortNotification[]>(initialNotifications);

  // Extended RRMS State: Services, Billing, Support, Reviews, Lost & Found, Admin
  const [services, setServices] = useState<ResortServiceItem[]>(initialServices);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>(initialServiceBookings);
  const [folios, setFolios] = useState<ReservationFolio[]>(initialFolios);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);
  const [reviews, setReviews] = useState<GuestReview[]>(initialReviews);
  const [lostAndFound, setLostAndFound] = useState<LostAndFoundItem[]>(initialLostAndFound);
  const [policies, setPolicies] = useState<ResortPolicy[]>(initialPolicies);
  const [promotions, setPromotions] = useState<PromotionCode[]>(initialPromotions);

  // Modals & Panels
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Ensure clean Golden Sunrise palette without dark mode
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    window.localStorage.removeItem("palm-grove-theme");
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Navigation handlers
  const handleNavigate = (tab: ModuleTab) => {
    setActiveTab(tab);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Persona change handler
  const handleSelectAccount = (account: Account) => {
    setCurrentAccount(account);
    // If current tab is not allowed for the new role, switch to dashboard
    const perm = rolePermissions.find((p) => p.role === account.role);
    if (perm && !perm.allowedTabs.includes(activeTab)) {
      setActiveTab("dashboard");
    }
    showToast(`Operational persona switched to: ${account.name} (${account.role})`);
  };

  // -------------------------------------------------------------
  // Workflow State Transitions (Check-in, Check-out, Folio Sync)
  // -------------------------------------------------------------

  const handleUpdateBookingStatus = (id: string, newStatus: BookingStatus) => {
    const targetBooking = bookings.find((b) => b.id === id);

    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );

    if (targetBooking) {
      if (newStatus === "Checked In") {
        // Automatically mark room as Occupied
        setRooms((prev) =>
          prev.map((r) =>
            r.code === targetBooking.roomCode
              ? { ...r, status: "Occupied", currentGuest: targetBooking.guestName }
              : r
          )
        );
        // Add operational notification
        setNotifications((prev) => [
          {
            id: `NOTIF-${Date.now().toString().slice(-4)}`,
            title: `VIP Check-in: ${targetBooking.guestName}`,
            detail: `Guest checked into Suite ${targetBooking.roomCode}. In-suite amenities unlocked.`,
            time: "Just now",
            department: "Front Desk",
            unread: true,
            priority: "urgent",
          },
          ...prev,
        ]);
        showToast(`Check-in complete for ${targetBooking.guestName}. Suite ${targetBooking.roomCode} marked Occupied.`);
      } else if (newStatus === "Checked Out") {
        // Automatically mark room as Dirty
        setRooms((prev) =>
          prev.map((r) =>
            r.code === targetBooking.roomCode
              ? { ...r, status: "Dirty", currentGuest: undefined }
              : r
          )
        );
        // Automatically create cleaning turnaround task
        setTasks((prev) => [
          {
            id: `HK-${Date.now().toString().slice(-4)}`,
            roomCode: targetBooking.roomCode,
            roomName: targetBooking.roomName,
            priority: "VIP Arrival",
            taskType: "Post-checkout Deep Sanitation & Turnaround Inspection",
            assignedTo: "Sunita Rao",
            dueTime: "In 60 mins",
            status: "Pending",
            kind: "Cleaning",
          },
          ...prev,
        ]);
        // Award loyalty points to guest (+350 pts)
        setGuests((prev) =>
          prev.map((g) =>
            g.name === targetBooking.guestName
              ? { ...g, loyaltyPoints: g.loyaltyPoints + 350, totalStays: g.totalStays + 1 }
              : g
          )
        );
        showToast(`Checked out ${targetBooking.guestName}. Suite marked Dirty, cleaning task dispatched, +350 loyalty pts awarded!`);
      } else {
        showToast(`Reservation ${id} updated to "${newStatus}"`);
      }
    }
  };

  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    // Create new folio
    setFolios((prev) => [
      {
        reservationId: newBooking.id,
        guestName: newBooking.guestName,
        roomCode: newBooking.roomCode,
        taxRatePercent: 18,
        discountAmount: 0,
        charges: [
          {
            id: `CHG-${Date.now().toString().slice(-4)}`,
            date: newBooking.checkIn,
            description: `${newBooking.roomName} (${newBooking.nights} Nights)`,
            category: "Room",
            amount: Number.parseInt(newBooking.totalAmount.replace(/[^0-9]/g, "")) || 48000,
          },
        ],
        payments: [],
      },
      ...prev,
    ]);
    showToast(`Reservation ${newBooking.id} created for ${newBooking.guestName} (${newBooking.roomCode})`);
  };

  const handleUpdateRoomStatus = (id: string, newStatus: RoomStatus) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast(`Suite status updated to "${newStatus}"`);
  };

  // Amenities & Services
  const handleBookService = (newBooking: Omit<ServiceBooking, "id">) => {
    const newId = `SBK-${Date.now().toString().slice(-4)}`;
    setServiceBookings((prev) => [{ id: newId, ...newBooking }, ...prev]);
    showToast(`Service "${newBooking.serviceName}" booked for ${newBooking.guestName}`);
  };

  const handleUpdateServiceStatus = (id: string, newStatus: ServiceBookingStatus) => {
    const target = serviceBookings.find((s) => s.id === id);

    setServiceBookings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );

    // If completed, automatically post charge to folio
    if (newStatus === "Completed" && target) {
      setFolios((prev) =>
        prev.map((f) => {
          if (f.reservationId === target.reservationId || f.roomCode === target.roomCode) {
            return {
              ...f,
              charges: [
                ...f.charges,
                {
                  id: `CHG-${Date.now().toString().slice(-4)}`,
                  date: new Date().toISOString().slice(0, 10),
                  description: `${target.serviceName} (${target.category})`,
                  category: "Service",
                  amount: target.amount,
                },
              ],
            };
          }
          return f;
        })
      );
      showToast(`Service completed and ₹${target.amount.toLocaleString()} posted to Folio #${target.reservationId}!`);
    } else {
      showToast(`Service booking updated to "${newStatus}"`);
    }
  };

  // Billing & Payments
  const handleRecordPayment = (reservationId: string, payment: Omit<FolioPayment, "id">) => {
    const newPayId = `PAY-${Date.now().toString().slice(-4)}`;
    setFolios((prev) =>
      prev.map((f) =>
        f.reservationId === reservationId
          ? { ...f, payments: [...f.payments, { id: newPayId, ...payment }] }
          : f
      )
    );
    showToast(`Payment of ₹${payment.amount.toLocaleString()} received via ${payment.method}`);
  };

  // Help & Support Tickets
  const handleCreateSupportTicket = (ticket: Omit<SupportTicket, "id" | "createdAt">) => {
    const newId = `TCK-${Date.now().toString().slice(-4)}`;
    const newTck: SupportTicket = {
      id: newId,
      createdAt: "Just now",
      ...ticket,
    };
    setSupportTickets((prev) => [newTck, ...prev]);
    showToast(`Concierge request #${newId} transmitted to front desk.`);
  };

  const handleUpdateSupportTicket = (ticketId: string, status: SupportTicketStatus, response?: string) => {
    setSupportTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status, response: response ?? t.response }
          : t
      )
    );
    showToast(`Ticket #${ticketId} updated to "${status}"`);
  };

  // Reviews
  const handleSubmitReview = (review: Omit<GuestReview, "id" | "date">) => {
    const newId = `REV-${Date.now().toString().slice(-4)}`;
    setReviews((prev) => [
      {
        id: newId,
        date: new Date().toISOString().slice(0, 10),
        ...review,
      },
      ...prev,
    ]);
    showToast("Thank you! Your 5-star review has been published.");
  };

  const handleUpdateReview = (reviewId: string, patch: Partial<GuestReview>) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, ...patch } : r))
    );
    showToast("Review successfully updated.");
  };

  // Loyalty Redemption
  const handleRedeemLoyalty = (guestId: string, points: number, creditAmount: number) => {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === guestId
          ? { ...g, loyaltyPoints: Math.max(0, g.loyaltyPoints - points) }
          : g
      )
    );

    // Apply discount credit to folio
    setFolios((prev) =>
      prev.map((f) => {
        if (f.reservationId === "BK-8095" || f.guestName === "Dr. Elena Rostova") {
          return {
            ...f,
            discountAmount: f.discountAmount + creditAmount,
          };
        }
        return f;
      })
    );

    showToast(`Redeemed ${points} points! ₹${creditAmount.toLocaleString()} credit applied to your folio.`);
  };

  // Operations: Tasks & Lost and Found
  const handleAddTask = (task: Omit<HousekeepingTask, "id">) => {
    const newId = `TSK-${Date.now().toString().slice(-4)}`;
    setTasks((prev) => [{ id: newId, ...task }, ...prev]);
    showToast(`Operational task #${newId} dispatched to ${task.assignedTo}`);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    showToast(`Task status updated to "${newStatus}"`);
  };

  const handleAddLostAndFound = (item: Omit<LostAndFoundItem, "id">) => {
    const newId = `LF-${Date.now().toString().slice(-4)}`;
    setLostAndFound((prev) => [{ id: newId, ...item }, ...prev]);
    showToast(`Article "${item.itemName}" registered in vault ${item.storageLocation}`);
  };

  const handleReturnLostItem = (itemId: string, guestName: string, phone: string) => {
    setLostAndFound((prev) =>
      prev.map((lf) =>
        lf.id === itemId
          ? {
              ...lf,
              status: "Returned to Guest",
              claimedByGuest: guestName,
              contactNumber: phone,
            }
          : lf
      )
    );
    showToast(`Item returned and custody transferred to ${guestName}.`);
  };

  // Administration: Policies & Promotions
  const handleUpdatePolicy = (policyId: string, newValue: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === policyId ? { ...p, value: newValue } : p))
    );
    showToast("Resort policy benchmark updated.");
  };

  const handleCreatePromotion = (promo: Omit<PromotionCode, "id" | "usageCount">) => {
    const newId = `PROMO-${Date.now().toString().slice(-4)}`;
    setPromotions((prev) => [{ id: newId, usageCount: 0, ...promo }, ...prev]);
    showToast(`Promotional voucher "${promo.code}" created.`);
  };

  const handleTogglePromoStatus = (promoId: string) => {
    setPromotions((prev) =>
      prev.map((p) =>
        p.id === promoId
          ? { ...p, status: p.status === "Active" ? "Expired" : "Active" }
          : p
      )
    );
    showToast("Promotion voucher status toggled.");
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast("All operational alerts marked as read");
  };

  const unreadAlertsCount = notifications.filter((n) => n.unread).length;

  // -------------------------------------------------------------
  // Role-Based Navigation Filtering
  // -------------------------------------------------------------
  const currentPermission =
    rolePermissions.find((p) => p.role === currentAccount.role) ?? rolePermissions[0]!;
  const allowedTabs = currentPermission.allowedTabs;

  return (
    <CasinoProvider>
      <div className="resort-shell relative min-h-screen bg-background text-foreground antialiased selection:bg-[var(--champagne)] selection:text-black">
        {/* Subtle architectural watermark & ambient sunset/sunrise horizon glow */}
        <div className="resort-horizon-glow" />
        <div className="resort-pattern" />

        {/* Mobile drawer overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* SECTION 6: UNTITLED UI INSPIRED LUXURY RESORT SIDEBAR */}
        <ResortSidebar
          activeTab={activeTab}
          onNavigate={handleNavigate}
          currentAccount={currentAccount}
          onOpenPersonaModal={() => setPersonaModalOpen(true)}
          allowedTabs={allowedTabs}
          bookingsCount={bookings.length}
          openTicketsCount={supportTickets.filter((t) => t.status === "Open").length}
          pendingServicesCount={serviceBookings.filter((s) => s.status !== "Completed").length}
          pendingTasksCount={tasks.filter((t) => t.status === "Pending").length}
          dirtyRoomsCount={rooms.filter((r) => r.status === "Dirty" || r.status === "Housekeeping").length}
          readyRoomsCount={rooms.filter((r) => r.status === "Ready").length}
          vaultItemsCount={lostAndFound.filter((l) => l.status === "Stored in Vault").length}
          reviewsCount={reviews.length}
          menuOpen={menuOpen}
          onCloseMenu={() => setMenuOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenNewTaskModal={() => {
            handleNavigate("operations");
          }}
          onOpenNewTicketModal={() => {
            handleNavigate("people");
          }}
        />

        {/* Main Container */}
        <div
          className={`relative z-10 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
          }`}
        >
          {/* Header */}
          <header className="resort-header sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 shadow-sm backdrop-blur-none sm:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-foreground"
                onClick={() => setMenuOpen(true)}
              >
                <Menu className="size-5" />
              </Button>

              {/* Quick search input */}
              <div className="relative hidden w-72 sm:block">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search guests, rooms, folios, tasks…"
                  className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-xs text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-[var(--champagne)] focus:ring-1 focus:ring-[var(--champagne)]"
                />
              </div>
            </div>

            {/* Right Header Controls */}
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              {/* Marine & Weather Pill */}
              <div className="hidden items-center gap-2 rounded-full border border-border bg-accent/40 px-3 py-1.5 text-xs sm:flex">
                <CloudFog className="size-4 text-[var(--sky)]" />
                <span className="font-medium text-foreground">
                  <CasinoSlotNumber value="24" className="font-semibold text-[var(--champagne)]" />°C · Ocean Calm
                </span>
              </div>

              {/* Casino Reels Roll Button */}
              <CasinoRollButton />

              {/* Persona Switcher Quick Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPersonaModalOpen(true)}
                className="h-8 gap-1.5 border-[var(--champagne)]/60 bg-[var(--gold-soft)]/40 px-2.5 text-xs font-semibold text-foreground hover:border-[var(--champagne)]"
              >
                <span className="flex size-4 items-center justify-center rounded-full bg-[var(--champagne)] text-[9px] font-bold text-black">
                  {currentAccount.avatar}
                </span>
                <span className="hidden md:inline">{currentAccount.role}</span>
              </Button>

              {/* Notifications Bell with shake animation & badge */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNotificationsOpen(true)}
                className="icon-bell-button relative size-9 text-foreground hover:bg-accent"
              >
                <Bell className="size-4" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--sunset)] px-1 text-[9px] font-bold text-white shadow-[0_0_6px_var(--sunset)]">
                    <CasinoSlotNumber value={unreadAlertsCount} interactive={false} />
                  </span>
                )}
              </Button>

              {/* Primary Action Button */}
              {currentAccount.role === "Guest" ? (
                <Button
                  size="sm"
                  onClick={() => handleNavigate("amenities")}
                  className="hidden sm:inline-flex h-8 gap-1.5 bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90"
                >
                  <Sparkles className="size-3.5" />
                  Order Service
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setNewBookingModalOpen(true)}
                  className="hidden sm:inline-flex h-8 gap-1.5 bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="size-3.5" />
                  Reservation
                </Button>
              )}
            </div>
          </header>

          {/* Main Content Area */}
          <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
            {/* Dashboard / Guest Sanctuary */}
            {activeTab === "dashboard" && (
              currentAccount.role === "Guest" ? (
                <GuestPortalView
                  currentAccount={currentAccount}
                  bookings={bookings}
                  serviceBookings={serviceBookings}
                  services={services}
                  folios={folios}
                  supportTickets={supportTickets}
                  reviews={reviews}
                  onNavigateTab={handleNavigate}
                  onOpenBookService={() => handleNavigate("amenities")}
                  onOpenSupportTicket={() => handleNavigate("people")}
                  onOpenReviewModal={() => handleNavigate("people")}
                />
              ) : (
                <DashboardView
                  bookings={bookings}
                  rooms={rooms}
                  onNewBooking={() => setNewBookingModalOpen(true)}
                  onNavigateTab={handleNavigate}
                  onSelectBooking={(bk) => setSelectedBooking(bk)}
                />
              )
            )}

            {/* Reservations */}
            {activeTab === "bookings" && (
              <BookingsView
                bookings={bookings}
                onNewBooking={() => setNewBookingModalOpen(true)}
                onUpdateStatus={handleUpdateBookingStatus}
                onSelectBooking={(bk) => setSelectedBooking(bk)}
              />
            )}

            {/* Room Management */}
            {activeTab === "rooms" && (
              <RoomsView
                rooms={rooms}
                onUpdateRoomStatus={handleUpdateRoomStatus}
              />
            )}

            {/* People & Support (Guest Directory, Staff, Support Desk, Loyalty, Reviews) */}
            {(activeTab === "people" || activeTab === "guests") && (
              <PeopleView
                guests={guests}
                supportTickets={supportTickets}
                reviews={reviews}
                currentAccount={currentAccount}
                onSelectGuest={(gst) => {
                  const found = bookings.find((b) => b.guestName === gst.name);
                  if (found) setSelectedBooking(found);
                  else {
                    showToast(`Viewing VIP guest profile for ${gst.name}`);
                  }
                }}
                onCreateSupportTicket={handleCreateSupportTicket}
                onUpdateSupportTicket={handleUpdateSupportTicket}
                onSubmitReview={handleSubmitReview}
                onUpdateReview={handleUpdateReview}
                onRedeemLoyalty={handleRedeemLoyalty}
              />
            )}

            {/* Amenities & Concierge Services */}
            {(activeTab === "amenities" || activeTab === "restaurant") && (
              <AmenitiesView
                services={services}
                serviceBookings={serviceBookings}
                bookings={bookings}
                currentAccount={currentAccount}
                onBookService={handleBookService}
                onUpdateServiceStatus={handleUpdateServiceStatus}
              />
            )}

            {/* Folio Billing & Expenses */}
            {(activeTab === "billing" || activeTab === "finance") && (
              <BillingView
                folios={folios}
                bookings={bookings}
                currentAccount={currentAccount}
                onRecordPayment={handleRecordPayment}
              />
            )}

            {/* Operations & Lost and Found */}
            {(activeTab === "operations" || activeTab === "housekeeping") && (
              <OperationsView
                tasks={tasks}
                rooms={rooms}
                lostAndFound={lostAndFound}
                currentAccount={currentAccount}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onAddTask={handleAddTask}
                onAddLostAndFound={handleAddLostAndFound}
                onReturnLostItem={handleReturnLostItem}
              />
            )}

            {/* Administration & Policies */}
            {(activeTab === "administration" || activeTab === "settings") && (
              <AdministrationView
                policies={policies}
                promotions={promotions}
                currentAccount={currentAccount}
                onUpdatePolicy={handleUpdatePolicy}
                onCreatePromotion={handleCreatePromotion}
                onTogglePromoStatus={handleTogglePromoStatus}
              />
            )}
          </main>
        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-lg border border-[var(--champagne)]/40 bg-card px-4 py-3 text-xs font-semibold text-foreground shadow-2xl rise">
            <Sparkles className="size-4 text-[var(--champagne)]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modals & Slide-out Drawers */}
        <NewBookingModal
          open={newBookingModalOpen}
          onClose={() => setNewBookingModalOpen(false)}
          rooms={rooms}
          onAddBooking={handleAddBooking}
        />

        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={handleUpdateBookingStatus}
        />

        <NotificationsDrawer
          open={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          notifications={notifications}
          onMarkAllRead={handleMarkAllNotificationsRead}
        />

        <PersonaSwitcherModal
          open={personaModalOpen}
          onClose={() => setPersonaModalOpen(false)}
          currentAccount={currentAccount}
          onSelectAccount={handleSelectAccount}
        />
      </div>
    </CasinoProvider>
  );
}