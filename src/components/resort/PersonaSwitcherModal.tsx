import { useState } from "react";
import {
  Check,
  Crown,
  KeyRound,
  Sparkles,
  UserCheck,
  Users,
  UtensilsCrossed,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Account, UserRole } from "./types";
import { initialAccounts } from "./resortData";

interface PersonaSwitcherModalProps {
  open: boolean;
  onClose: () => void;
  currentAccount: Account;
  onSelectAccount: (account: Account) => void;
}

export function PersonaSwitcherModal({
  open,
  onClose,
  currentAccount,
  onSelectAccount,
}: PersonaSwitcherModalProps) {
  if (!open) return null;

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "General Manager":
        return <Crown className="size-4 text-[var(--champagne)]" />;
      case "Receptionist":
        return <KeyRound className="size-4 text-[var(--sky)]" />;
      case "Housekeeper":
        return <Sparkles className="size-4 text-[var(--sage)]" />;
      case "Cashier":
        return <UserCheck className="size-4 text-[var(--champagne)]" />;
      case "Chef F&B":
        return <UtensilsCrossed className="size-4 text-[var(--sunset)]" />;
      case "Maintenance":
        return <Wrench className="size-4 text-[var(--copper)]" />;
      case "Guest":
        return <Sparkles className="size-4 text-[var(--gold)]" />;
      default:
        return <Users className="size-4" />;
    }
  };

  const getRoleBadgeVariant = (module: string) => {
    switch (module) {
      case "Management":
        return "gold";
      case "Guest":
        return "sunset";
      default:
        return "secondary";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/70 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[var(--champagne)]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--champagne)]">
                Role-Based Authentication & Personas
              </p>
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">
              Switch Operational Persona
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Select a persona to test role-specific workflows, navigation permissions, and guest portal features.
            </p>
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

        {/* Persona Grid */}
        <div className="mt-5 grid gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {initialAccounts.map((acc) => {
            const isSelected = acc.id === currentAccount.id;

            return (
              <div
                key={acc.id}
                onClick={() => {
                  onSelectAccount(acc);
                  onClose();
                }}
                className={`group relative flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition-all ${
                  isSelected
                    ? "border-[var(--champagne)] bg-[var(--gold-soft)]/40 shadow-sm"
                    : "border-border/80 bg-background/60 hover:border-[var(--champagne)]/60 hover:bg-accent/40"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Avatar medallion */}
                  <span
                    className={`flex size-11 items-center justify-center rounded-full font-display text-sm font-bold shadow-sm ${
                      isSelected
                        ? "border border-[var(--champagne)] bg-[var(--champagne)] text-black"
                        : "border border-border bg-accent text-foreground group-hover:border-[var(--champagne)]/50"
                    }`}
                  >
                    {acc.avatar}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-foreground">
                        {acc.name}
                      </p>
                      <Badge variant={getRoleBadgeVariant(acc.module) as any}>
                        {acc.module}
                      </Badge>
                      {acc.role === "Guest" && (
                        <span className="rounded bg-[var(--gold-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--champagne)]">
                          Suite {acc.assignedRoomCode}
                        </span>
                      )}
                    </div>

                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium text-foreground/80">
                        {getRoleIcon(acc.role)}
                        {acc.role}
                      </span>
                      <span>·</span>
                      <span className="truncate max-w-[260px]">
                        {acc.shift || acc.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <span className="flex size-7 items-center justify-center rounded-full bg-[var(--champagne)] text-black shadow-sm">
                      <Check className="size-4" strokeWidth={3} />
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-border/80 group-hover:border-[var(--champagne)] group-hover:text-[var(--champagne)]"
                    >
                      Select
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4 text-xs text-muted-foreground">
          <span>Current Active: <strong className="text-foreground">{currentAccount.name} ({currentAccount.role})</strong></span>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
