import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BedDouble,
  Bell,
  CalendarCheck2,
  CheckCircle2,
  CloudFog,
  Coins,
  ConciergeBell,
  LayoutDashboard,
  LogOut,
  Menu,
  MoonStar,
  Plus,
  Search,
  Settings,
  Shield,
  Sparkles,
  SunMedium,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Waves,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Booking,
  BookingStatus,
  Guest,
  HousekeepingTask,
  ModuleTab,
  OrderStage,
  ResortNotification,
  RestaurantOrder,
  Room,
  RoomStatus,
} from "@/components/resort/types";
import {
  initialBookings,
  initialGuests,
  initialHousekeeping,
  initialNotifications,
  initialOrders,
  initialRooms,
} from "@/components/resort/resortData";
import { DashboardView } from "@/components/resort/DashboardView";
import { BookingsView } from "@/components/resort/BookingsView";
import { RoomsView } from "@/components/resort/RoomsView";
import { GuestsView } from "@/components/resort/GuestsView";
import { RestaurantView } from "@/components/resort/RestaurantView";
import { HousekeepingView } from "@/components/resort/HousekeepingView";
import { FinanceView } from "@/components/resort/FinanceView";
import { SettingsView } from "@/components/resort/SettingsView";
import { NewBookingModal } from "@/components/resort/NewBookingModal";
import { BookingDetailModal } from "@/components/resort/BookingDetailModal";
import { NotificationsDrawer } from "@/components/resort/NotificationsDrawer";
import sidebarGoldenSunrise from "@/assets/sidebar-golden-sunrise.jpg";
import sidebarLuxurySunset from "@/assets/sidebar-luxury-sunset.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Palm Grove Coastal Resort — 5-Star Luxury Management" },
      {
        name: "description",
        content:
          "A 5-star luxury hospitality management experience for Palm Grove Coastal Resort. Seamless operations for reservations, rooms, guest relations, fine dining, and finance.",
      },
      { property: "og:title", content: "Palm Grove Coastal Resort — Luxury Operations" },
      {
        property: "og:description",
        content:
          "5-Star Luxury Resort Management System with Golden Sunrise and Luxury Sunset atmospheres.",
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
  const [theme, setTheme] = useState<"day" | "night">("day");
  const [themeReady, setThemeReady] = useState(false);
  const [currentRole, setCurrentRole] = useState("General Manager");

  // Resort State
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [orders, setOrders] = useState<RestaurantOrder[]>(initialOrders);
  const [tasks, setTasks] = useState<HousekeepingTask[]>(initialHousekeeping);
  const [notifications, setNotifications] = useState<ResortNotification[]>(initialNotifications);

  // Modals & Panels
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("palm-grove-theme");
    const initialTheme =
      savedTheme === "day" || savedTheme === "night"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "night"
        : "day";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "night");
    setThemeReady(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Day ↔ Night 950ms Smooth Atmosphere Transition
  const toggleTheme = () => {
    const nextTheme = theme === "day" ? "night" : "day";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "night");
    window.localStorage.setItem("palm-grove-theme", nextTheme);
    showToast(
      nextTheme === "night"
        ? "Atmosphere transitioned to Luxury Sunset (Night)"
        : "Atmosphere transitioned to Golden Sunrise (Day)"
    );
  };

  // Navigation handlers
  const handleNavigate = (tab: ModuleTab) => {
    setActiveTab(tab);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // State update handlers
  const handleUpdateBookingStatus = (id: string, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    showToast(`Reservation ${id} updated to "${newStatus}"`);
  };

  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    showToast(`New reservation created for ${newBooking.guestName} (${newBooking.roomCode})`);
  };

  const handleUpdateRoomStatus = (id: string, newStatus: RoomStatus) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast(`Suite status updated to "${newStatus}"`);
  };

  const handleAdvanceOrder = (id: string) => {
    const stageFlow: Record<OrderStage, OrderStage> = {
      Received: "Preparing",
      Preparing: "Plated",
      Plated: "Served",
      Served: "Served",
    };

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const nextStage = stageFlow[o.stage];
          showToast(`KOT ${id} advanced to "${nextStage}"`);
          return { ...o, stage: nextStage };
        }
        return o;
      })
    );
  };

  const handleUpdateTask = (id: string, newStatus: HousekeepingTask["status"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    showToast(`Housekeeping task updated to "${newStatus}"`);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast("All operational alerts marked as read");
  };

  const unreadAlertsCount = notifications.filter((n) => n.unread).length;

  const navItems = [
    {
      tab: "dashboard" as ModuleTab,
      label: "Dashboard",
      icon: LayoutDashboard,
      iconClass: "",
      badge: undefined,
    },
    {
      tab: "bookings" as ModuleTab,
      label: "Reservations",
      icon: CalendarCheck2,
      iconClass: "icon-calendar-item",
      badge: `${bookings.length}`,
    },
    {
      tab: "rooms" as ModuleTab,
      label: "Suites & Villas",
      icon: BedDouble,
      iconClass: "icon-rooms-item",
      badge: undefined,
    },
    {
      tab: "guests" as ModuleTab,
      label: "VIP Guests",
      icon: Users,
      iconClass: "",
      badge: undefined,
    },
    {
      tab: "restaurant" as ModuleTab,
      label: "Dining & Cellar",
      icon: ConciergeBell,
      iconClass: "icon-restaurant-item",
      badge: `${orders.filter((o) => o.stage !== "Served").length} KOT`,
    },
    {
      tab: "housekeeping" as ModuleTab,
      label: "Housekeeping",
      icon: Sparkles,
      iconClass: "",
      badge: undefined,
    },
    {
      tab: "finance" as ModuleTab,
      label: "Financial Ledger",
      icon: TrendingUp,
      iconClass: "icon-finance-item",
      badge: undefined,
    },
    {
      tab: "settings" as ModuleTab,
      label: "Settings",
      icon: Settings,
      iconClass: "icon-settings-item",
      badge: undefined,
    },
  ];

  return (
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

      {/* SECTION 6: LUXURY SIDEBAR
          DAY: Deep Ocean #173B4D
          NIGHT: Deep Navy #101B29
          Small Champagne Gold indicator, consistent premium icons, smooth hover animation
      */}
      <aside
        className={`resort-sidebar fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[var(--sidebar-border)] px-5 py-6 text-[var(--sidebar-foreground)] transition-transform duration-300 lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <img
          src={sidebarGoldenSunrise}
          alt=""
          width={768}
          height={1536}
          aria-hidden="true"
          className="sidebar-atmosphere sidebar-atmosphere-day"
        />
        <img
          src={sidebarLuxurySunset}
          alt=""
          width={768}
          height={1536}
          aria-hidden="true"
          className="sidebar-atmosphere sidebar-atmosphere-night"
        />
        <div className="sidebar-atmosphere-overlay" aria-hidden="true" />

        {/* Brand Header */}
        <div className="flex items-start justify-between border-b border-[var(--sidebar-border)] pb-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full border border-[var(--champagne)]/60 bg-[var(--champagne)] text-black shadow-md">
              <Waves className="size-5" />
            </span>
            <div>
              <p className="font-display text-lg font-bold leading-tight tracking-tight text-[var(--sidebar-foreground)]">
                Palm Grove
              </p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--champagne)]">
                Coastal Resort · 5★
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-[var(--sidebar-muted)] hover:text-white lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--sidebar-muted)]">
            Operations
          </p>

          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;
              const IconComp = item.icon;

              return (
                <li key={item.tab}>
                  <button
                    onClick={() => handleNavigate(item.tab)}
                    className={`group ${item.iconClass} relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? "border border-[var(--champagne)]/40 bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] shadow-sm font-semibold"
                        : "text-[var(--sidebar-muted)] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {/* Small Champagne Gold active indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-[var(--champagne)] shadow-[0_0_8px_var(--champagne)]" />
                    )}

                    <IconComp
                      className={`size-4 transition-transform duration-300 group-hover:scale-110 ${
                        isActive ? "text-[var(--champagne)]" : "text-[var(--sidebar-muted)]"
                      }`}
                      strokeWidth={1.75}
                    />

                    <span className="truncate">{item.label}</span>

                    {item.badge && (
                      <span
                        className={`ml-auto rounded-full px-1.5 py-0.2 font-mono text-[9px] font-semibold ${
                          isActive
                            ? "bg-[var(--champagne)] text-black"
                            : "bg-white/10 text-[var(--sidebar-muted)]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Medallion & Status */}
        <div className="border-t border-[var(--sidebar-border)] pt-4">
          <div className="mb-3.5 flex items-center gap-2 text-[11px] text-[var(--sidebar-muted)]">
            <span className="size-1.5 rounded-full bg-[var(--champagne)] shadow-[0_0_6px_var(--champagne)]" />
            <span>All Resort Systems Online</span>
          </div>

          <div
            onClick={() => handleNavigate("settings")}
            className="flex cursor-pointer items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-white/10"
          >
            <span className="flex size-9 items-center justify-center rounded-full border border-[var(--champagne)]/50 bg-[var(--champagne)] font-display text-xs font-bold text-black shadow-sm">
              AM
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">Amol</p>
              <p className="truncate text-[10px] text-[var(--sidebar-muted)]">{currentRole}</p>
            </div>
            <Settings className="size-3.5 text-[var(--sidebar-muted)]" />
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="relative z-10 lg:pl-64">
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
                placeholder="Search guests, rooms, bookings…"
                onClick={() => {
                  if (activeTab !== "bookings") setActiveTab("bookings");
                }}
                className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-xs text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-[var(--champagne)] focus:ring-1 focus:ring-[var(--champagne)]"
              />
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            {/* Marine & Weather Pill */}
            <div className="hidden items-center gap-2 rounded-full border border-border bg-accent/40 px-3 py-1.5 text-xs sm:flex">
              <CloudFog className="size-4 text-[var(--sky)]" />
              <span className="font-medium text-foreground">24°C · Ocean Breeze</span>
            </div>

            {/* Day ↔ Night Atmosphere Switch (700-1200ms transition) */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              disabled={!themeReady}
              title={theme === "day" ? "Switch to Luxury Sunset (Night)" : "Switch to Golden Sunrise (Day)"}
              className="theme-toggle relative size-9 border-[var(--champagne)]/50 bg-background text-[var(--champagne)] shadow-sm hover:bg-accent"
            >
              <SunMedium
                className={`absolute size-4 transition-all duration-700 ${
                  theme === "day"
                    ? "rotate-0 scale-100 opacity-100"
                    : "rotate-90 scale-50 opacity-0"
                }`}
              />
              <MoonStar
                className={`absolute size-4 transition-all duration-700 ${
                  theme === "night"
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-90 scale-50 opacity-0"
                }`}
              />
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
                <span className="absolute right-2 top-2 size-2 rounded-full bg-[var(--sunset)] shadow-[0_0_6px_var(--sunset)]" />
              )}
            </Button>

            {/* Quick "New Booking" button */}
            <Button
              size="sm"
              onClick={() => setNewBookingModalOpen(true)}
              className="hidden sm:inline-flex h-8 gap-1.5 bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="size-3.5" />
              Reservation
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          {activeTab === "dashboard" && (
            <DashboardView
              bookings={bookings}
              rooms={rooms}
              theme={theme}
              onNewBooking={() => setNewBookingModalOpen(true)}
              onNavigateTab={handleNavigate}
              onSelectBooking={(bk) => setSelectedBooking(bk)}
            />
          )}

          {activeTab === "bookings" && (
            <BookingsView
              bookings={bookings}
              onNewBooking={() => setNewBookingModalOpen(true)}
              onUpdateStatus={handleUpdateBookingStatus}
              onSelectBooking={(bk) => setSelectedBooking(bk)}
            />
          )}

          {activeTab === "rooms" && (
            <RoomsView
              rooms={rooms}
              onUpdateRoomStatus={handleUpdateRoomStatus}
            />
          )}

          {activeTab === "guests" && (
            <GuestsView
              guests={guests}
              onSelectGuest={(gst) => {
                const found = bookings.find((b) => b.guestName === gst.name);
                if (found) setSelectedBooking(found);
                else {
                  showToast(`Viewing VIP guest profile for ${gst.name}`);
                }
              }}
            />
          )}

          {activeTab === "restaurant" && (
            <RestaurantView
              orders={orders}
              onAdvanceOrder={handleAdvanceOrder}
            />
          )}

          {activeTab === "housekeeping" && (
            <HousekeepingView
              tasks={tasks}
              onUpdateTask={handleUpdateTask}
            />
          )}

          {activeTab === "finance" && <FinanceView />}

          {activeTab === "settings" && (
            <SettingsView
              currentRole={currentRole}
              onChangeRole={(newRole) => {
                setCurrentRole(newRole);
                showToast(`Role context switched to: ${newRole}`);
              }}
              theme={theme}
              onToggleTheme={toggleTheme}
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
    </div>
  );
}