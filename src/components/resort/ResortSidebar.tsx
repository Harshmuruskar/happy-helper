import React, { useState } from "react";
import {
  ArrowLeftRight,
  BedDouble,
  CalendarCheck2,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  ConciergeBell,
  FileText,
  KeyRound,
  Layers,
  LayoutDashboard,
  MessageSquare,
  PanelLeft,
  PanelLeftClose,
  Plus,
  Receipt,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Waves,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CasinoSlotNumber } from "./CasinoSlotNumber";
import { Account, ModuleTab } from "./types";
import sidebarGoldenSunrise from "@/assets/sidebar-golden-sunrise.jpg";

export interface ResortSidebarProps {
  activeTab: ModuleTab;
  onNavigate: (tab: ModuleTab) => void;
  currentAccount: Account;
  onOpenPersonaModal: () => void;
  allowedTabs: ModuleTab[];
  bookingsCount: number;
  openTicketsCount: number;
  pendingServicesCount: number;
  pendingTasksCount: number;
  dirtyRoomsCount: number;
  readyRoomsCount: number;
  vaultItemsCount: number;
  reviewsCount: number;
  menuOpen: boolean;
  onCloseMenu: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenNewTaskModal?: () => void;
  onOpenNewTicketModal?: () => void;
}

export function ResortSidebar({
  activeTab,
  onNavigate,
  currentAccount,
  onOpenPersonaModal,
  allowedTabs,
  bookingsCount,
  openTicketsCount,
  pendingServicesCount,
  pendingTasksCount,
  dirtyRoomsCount,
  readyRoomsCount,
  vaultItemsCount,
  reviewsCount,
  menuOpen,
  onCloseMenu,
  isCollapsed,
  onToggleCollapse,
  onOpenNewTaskModal,
  onOpenNewTicketModal,
}: ResortSidebarProps) {
  // Accordion section states
  const [operationsExpanded, setOperationsExpanded] = useState(true);
  const [guestCareExpanded, setGuestCareExpanded] = useState(true);
  const [imgFailed, setImgFailed] = useState(false);

  // Main navigation items
  const mainNavItems = [
    {
      tab: "dashboard" as ModuleTab,
      label: currentAccount.role === "Guest" ? "Guest Sanctuary" : "Overview",
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      tab: "bookings" as ModuleTab,
      label: "Reservations",
      icon: CalendarCheck2,
      badge: `${bookingsCount}`,
    },
    {
      tab: "rooms" as ModuleTab,
      label: "Suites & Villas",
      icon: BedDouble,
      badge: undefined,
    },
    {
      tab: "billing" as ModuleTab,
      label: "Folio Billing",
      icon: Receipt,
      badge: undefined,
    },
    {
      tab: "amenities" as ModuleTab,
      label: "Concierge & Dining",
      icon: ConciergeBell,
      badge: pendingServicesCount > 0 ? `${pendingServicesCount}` : undefined,
    },
  ];

  // Secondary / system items
  const secondaryNavItems = [
    {
      tab: "people" as ModuleTab,
      label: "People & Duty Roster",
      icon: Users,
      badge: openTicketsCount > 0 ? `${openTicketsCount} New` : undefined,
    },
    {
      tab: "operations" as ModuleTab,
      label: "Operations & Vault",
      icon: Sparkles,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined,
    },
    {
      tab: "administration" as ModuleTab,
      label: "Administration & RBAC",
      icon: ShieldCheck,
      badge: undefined,
    },
  ];

  const visibleMainItems = mainNavItems.filter((i) => allowedTabs.includes(i.tab));
  const visibleSecondaryItems = secondaryNavItems.filter((i) => allowedTabs.includes(i.tab));

  return (
    <aside
      className={`resort-sidebar fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card text-foreground transition-all duration-300 ease-in-out lg:translate-x-0 ${
        isCollapsed ? "w-[72px]" : "w-64"
      } ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* 1. TOP MAC-OS TRAFFIC LIGHTS & MOBILE CLOSE */}
      <div className="flex h-11 items-center justify-between px-3.5 pt-2 border-b border-border/40">
        <div className="flex items-center gap-1.5" title="Palm Grove RRMS Desktop Suite">
          <span className="size-2.5 rounded-full bg-[#FF5F56] transition-opacity hover:opacity-80" />
          <span className="size-2.5 rounded-full bg-[#FFBD2E] transition-opacity hover:opacity-80" />
          <span className="size-2.5 rounded-full bg-[#27C93F] transition-opacity hover:opacity-80" />
        </div>
        <div className="flex items-center gap-1">
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground lg:hidden"
            onClick={onCloseMenu}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* 2. WORKSPACE / RESORT PROPERTY HEADER */}
      <div className="border-b border-border/70 p-3">
        {isCollapsed ? (
          <div className="flex flex-col items-center">
            <button
              onClick={onToggleCollapse}
              title="Expand Palm Grove Resort Sidebar"
              className="flex size-10 items-center justify-center rounded-xl bg-[var(--ocean)] text-[var(--champagne)] shadow-sm ring-1 ring-border/50 transition-transform hover:scale-105"
            >
              <Waves className="size-5" />
            </button>
          </div>
        ) : (
          <div>
            <div
              onClick={onOpenPersonaModal}
              title="Switch Persona / Workspace"
              className="group flex cursor-pointer items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-muted/50"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--ocean)] text-[var(--champagne)] shadow-xs ring-1 ring-border/50">
                <Waves className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-xs font-bold leading-tight text-foreground">
                    Palm Grove
                  </p>
                  <span className="rounded bg-[var(--gold-soft)]/30 px-1 py-0.2 font-mono text-[9px] font-semibold text-[var(--ocean)]">
                    5★
                  </span>
                </div>
                <p className="truncate text-[10px] text-muted-foreground">
                  palmgrove.luxuryresort.com
                </p>
              </div>
              <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:text-foreground" />
            </div>

            {/* Quick Switch Persona Pill (matches "Switch stores" in inspiration) */}
            <button
              onClick={onOpenPersonaModal}
              className="mt-2.5 flex w-full items-center justify-between gap-1.5 rounded-lg border border-border/80 bg-muted/30 px-2.5 py-1.5 text-xs font-medium text-foreground transition-all hover:border-[var(--champagne)]/60 hover:bg-muted/70"
            >
              <div className="flex items-center gap-2 truncate">
                <ArrowLeftRight className="size-3.5 text-muted-foreground shrink-0" />
                <span className="truncate text-[11px] font-medium">Switch Persona</span>
              </div>
              <span className="shrink-0 rounded bg-background px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[var(--ocean)] border border-border/60">
                {currentAccount.role}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 3. SCROLLABLE NAVIGATION CONTENT */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 scrollbar-thin">
        {/* Main Nav Items */}
        <div className="space-y-1">
          {visibleMainItems.map((item) => {
            const isActive = activeTab === item.tab;
            const Icon = item.icon;

            if (isCollapsed) {
              return (
                <button
                  key={item.tab}
                  onClick={() => onNavigate(item.tab)}
                  title={`${item.label}${item.badge ? ` (${item.badge})` : ""}`}
                  className={`group relative flex size-10 mx-auto items-center justify-center rounded-lg transition-all ${
                    isActive
                      ? "bg-[var(--gold-soft)]/35 text-[var(--ocean)] shadow-2xs ring-1 ring-[var(--champagne)]/40 font-semibold"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[var(--ocean)] text-[9px] font-mono font-bold text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            }

            return (
              <button
                key={item.tab}
                onClick={() => onNavigate(item.tab)}
                className={`group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[var(--gold-soft)]/30 text-[var(--ocean)] font-semibold border border-[var(--champagne)]/30 shadow-2xs"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Icon
                  className={`size-4 shrink-0 transition-colors ${
                    isActive ? "text-[var(--champagne)]" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-auto rounded-full px-1.5 py-0.2 font-mono text-[9px] font-semibold ${
                      isActive
                        ? "bg-[var(--ocean)] text-[var(--champagne)]"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <CasinoSlotNumber value={item.badge} interactive={false} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Accordion / Nested Sections (Drafts 10, Scheduled 2, Published 28 style) */}
        {!isCollapsed && allowedTabs.includes("operations") && (
          <div className="border-t border-border/50 pt-3">
            <div className="flex items-center justify-between px-2 pb-1.5">
              <button
                onClick={() => setOperationsExpanded(!operationsExpanded)}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                {operationsExpanded ? (
                  <ChevronDown className="size-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="size-3 text-muted-foreground" />
                )}
                <span>Live Operations</span>
              </button>
              <button
                onClick={() => {
                  onNavigate("operations");
                  onOpenNewTaskModal?.();
                }}
                title="Create Operations Task"
                className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Plus className="size-3.5" />
              </button>
            </div>

            {operationsExpanded && (
              <div className="mt-1 space-y-0.5 pl-3">
                <button
                  onClick={() => onNavigate("bookings")}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  <span className="truncate">Arrivals Today</span>
                  <span className="rounded-md bg-[var(--ocean)] px-1.5 py-0.2 font-mono text-[10px] font-bold text-white shadow-2xs">
                    {bookingsCount}
                  </span>
                </button>

                <button
                  onClick={() => onNavigate("rooms")}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  <span className="truncate">Dirty / Turnaround</span>
                  <span className="rounded-md bg-[#B86F63] px-1.5 py-0.2 font-mono text-[10px] font-bold text-white shadow-2xs">
                    {dirtyRoomsCount}
                  </span>
                </button>

                <button
                  onClick={() => onNavigate("rooms")}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  <span className="truncate">Inspected Ready</span>
                  <span className="rounded-md bg-[#718B7A] px-1.5 py-0.2 font-mono text-[10px] font-bold text-white shadow-2xs">
                    {readyRoomsCount}
                  </span>
                </button>

                <button
                  onClick={() => onNavigate("operations")}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  <span className="truncate">Vault Custody</span>
                  <span className="rounded-md bg-[var(--ocean)] px-1.5 py-0.2 font-mono text-[10px] font-bold text-white shadow-2xs">
                    {vaultItemsCount}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Section 2: Guest Experience Accordion */}
        {!isCollapsed && allowedTabs.includes("people") && (
          <div className="border-t border-border/50 pt-3">
            <div className="flex items-center justify-between px-2 pb-1.5">
              <button
                onClick={() => setGuestCareExpanded(!guestCareExpanded)}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                {guestCareExpanded ? (
                  <ChevronDown className="size-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="size-3 text-muted-foreground" />
                )}
                <span>Guest Care</span>
              </button>
              <button
                onClick={() => {
                  onNavigate("people");
                  onOpenNewTicketModal?.();
                }}
                title="Create Concierge Ticket"
                className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Plus className="size-3.5" />
              </button>
            </div>

            {guestCareExpanded && (
              <div className="mt-1 space-y-0.5 pl-3">
                <button
                  onClick={() => onNavigate("people")}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  <span className="truncate">Open Requests</span>
                  <span className="rounded-md bg-[var(--ocean)] px-1.5 py-0.2 font-mono text-[10px] font-bold text-white shadow-2xs">
                    {openTicketsCount}
                  </span>
                </button>

                <button
                  onClick={() => onNavigate("amenities")}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  <span className="truncate">Active Dispatches</span>
                  <span className="rounded-md bg-[var(--champagne)] px-1.5 py-0.2 font-mono text-[10px] font-bold text-black shadow-2xs">
                    {pendingServicesCount}
                  </span>
                </button>

                <button
                  onClick={() => onNavigate("people")}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  <span className="truncate">Verified 5★ Reviews</span>
                  <span className="rounded-md bg-[var(--ocean)] px-1.5 py-0.2 font-mono text-[10px] font-bold text-white shadow-2xs">
                    {reviewsCount}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Secondary Navigation (People, Operations, Administration) */}
        {!isCollapsed && visibleSecondaryItems.length > 0 && (
          <div className="border-t border-border/50 pt-3 space-y-1">
            <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              System & Management
            </p>
            {visibleSecondaryItems.map((item) => {
              const isActive = activeTab === item.tab;
              const Icon = item.icon;

              return (
                <button
                  key={item.tab}
                  onClick={() => onNavigate(item.tab)}
                  className={`group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[var(--gold-soft)]/30 text-[var(--ocean)] font-semibold border border-[var(--champagne)]/30 shadow-2xs"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`size-4 shrink-0 ${
                      isActive ? "text-[var(--champagne)]" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-muted px-1.5 py-0.2 font-mono text-[9px] font-semibold text-muted-foreground">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 4. FEATURED RESORT ATMOSPHERE CARD (Image never breaks!) */}
        {!isCollapsed && (
          <div className="pt-2">
            <div className="overflow-hidden rounded-xl border border-border/80 bg-muted/30 shadow-2xs">
              <div className="relative h-24 w-full overflow-hidden bg-muted">
                {!imgFailed ? (
                  <img
                    src={sidebarGoldenSunrise}
                    alt="Palm Grove Sanctuary"
                    loading="eager"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    onError={() => setImgFailed(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--ocean)] to-[#24313A] p-2 text-center text-white">
                    <span className="font-display text-xs text-[var(--champagne)]">
                      Palm Grove Sanctuary
                    </span>
                  </div>
                )}
                {/* Crisp dark gradient overlay for text readability */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div className="absolute inset-x-2.5 bottom-2 flex items-center justify-between text-white">
                  <div>
                    <p className="font-display text-[11px] font-bold leading-tight text-white drop-shadow-sm">
                      Ocean Pavilion
                    </p>
                    <p className="text-[9px] font-medium text-[var(--champagne)] drop-shadow-sm">
                      Calm Surf · 24°C
                    </p>
                  </div>
                  <span className="rounded bg-white/20 px-1.5 py-0.5 text-[8px] font-mono font-bold text-white uppercase tracking-wider">
                    Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. FOOTER UTILITIES & USER PROFILE */}
      <div className="border-t border-border/70 p-2.5 bg-muted/15">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => onNavigate("people")}
              title="Guest Support & Help Desk"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <MessageSquare className="size-4" />
            </button>
            <button
              onClick={() => onNavigate("administration")}
              title="Administration & Security Settings"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Settings className="size-4" />
            </button>
            <button
              onClick={onToggleCollapse}
              title="Expand Sidebar"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <PanelLeft className="size-4" />
            </button>
            <button
              onClick={onOpenPersonaModal}
              title={`Active: ${currentAccount.name} (${currentAccount.role})`}
              className="mt-1 flex size-8 items-center justify-center rounded-full bg-[var(--champagne)] font-bold text-[11px] text-black shadow-2xs ring-1 ring-border"
            >
              {currentAccount.avatar}
            </button>
          </div>
        ) : (
          <div>
            {/* Utility action row matching inspiration bottom icons */}
            <div className="mb-2 flex items-center justify-between px-1 text-muted-foreground">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onNavigate("people")}
                  title="Concierge & Guest Support"
                  className="flex size-7 items-center justify-center rounded-md hover:bg-muted hover:text-foreground transition-colors"
                >
                  <MessageSquare className="size-3.5" />
                </button>
                <button
                  onClick={() => onNavigate("administration")}
                  title="Resort Administration"
                  className="flex size-7 items-center justify-center rounded-md hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Settings className="size-3.5" />
                </button>
              </div>

              {/* Collapse/Expand Sidebar toggle button */}
              <button
                onClick={onToggleCollapse}
                title="Collapse Sidebar"
                className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <PanelLeftClose className="size-3.5" />
                <span className="text-[10px]">Collapse</span>
              </button>
            </div>

            {/* Current user card with quick role switch */}
            <div
              onClick={onOpenPersonaModal}
              title="Click to switch active role (General Manager, Staff, Guest)"
              className="group flex cursor-pointer items-center gap-2.5 rounded-lg border border-border/60 bg-card p-2 shadow-2xs transition-all hover:border-[var(--champagne)]/60 hover:bg-muted/40"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--champagne)] font-display text-xs font-bold text-black shadow-xs ring-1 ring-border">
                {currentAccount.avatar}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground group-hover:text-[var(--ocean)]">
                  {currentAccount.name}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {currentAccount.role}
                </p>
              </div>
              <KeyRound className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-[var(--champagne)]" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
