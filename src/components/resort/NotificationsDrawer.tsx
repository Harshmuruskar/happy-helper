import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResortNotification } from "./types";
import { CasinoSlotNumber } from "./CasinoSlotNumber";

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
  notifications: ResortNotification[];
  onMarkAllRead: () => void;
}

export function NotificationsDrawer({
  open,
  onClose,
  notifications,
  onMarkAllRead,
}: NotificationsDrawerProps) {
  if (!open) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel - Crisp solid surface, no blur */}
      <div className="resort-card relative z-10 flex h-full w-full max-w-md flex-col border-l border-border bg-card p-6 shadow-2xl rise">
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg border border-[var(--champagne)]/30 bg-[var(--champagne)]/10 text-[var(--champagne)]">
              <Bell className="size-4" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                Resort Live Dispatch
              </h2>
              <p className="text-xs text-muted-foreground">
                <CasinoSlotNumber value={unreadCount} interactive={false} /> unread operational alerts
              </p>
            </div>
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

        {/* Action Bar */}
        <div className="flex items-center justify-between py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Latest Alerts
          </span>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-xs font-semibold text-[var(--champagne)] hover:underline"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-lg border p-3.5 transition-all ${
                n.unread
                  ? "border-[var(--champagne)]/40 bg-[var(--champagne)]/5 shadow-sm"
                  : "border-border/70 bg-accent/30"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--champagne)]">
                  {n.department}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">{n.time}</span>
              </div>

              <h3 className="mt-1 font-display text-sm font-semibold text-foreground">
                {n.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {n.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-border/80 pt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[var(--sage)]" />
              Operational Network Secure
            </span>
            <span>Channel: Front Desk Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
