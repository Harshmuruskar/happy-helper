import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Edit2,
  KeyRound,
  Lock,
  Percent,
  Plus,
  Save,
  Shield,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Tag,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Account,
  PromotionCode,
  ResortPolicy,
  RolePermission,
  UserRole,
} from "./types";
import { CasinoSlotNumber } from "./CasinoSlotNumber";
import { useCasino } from "./CasinoControl";
import { rolePermissions as initialRolePermissions } from "./resortData";

interface AdministrationViewProps {
  policies: ResortPolicy[];
  promotions: PromotionCode[];
  currentAccount: Account;
  onUpdatePolicy: (policyId: string, newValue: string) => void;
  onCreatePromotion: (promo: Omit<PromotionCode, "id" | "usageCount">) => void;
  onTogglePromoStatus: (promoId: string) => void;
}

export function AdministrationView({
  policies,
  promotions,
  currentAccount,
  onUpdatePolicy,
  onCreatePromotion,
  onTogglePromoStatus,
}: AdministrationViewProps) {
  const { spinKey } = useCasino();
  const [activeTab, setActiveTab] = useState<"policies" | "promotions" | "permissions">("policies");

  // Edit policy state
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Promo modal state
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(15);
  const [promoDesc, setPromoDesc] = useState("");
  const [promoValid, setPromoValid] = useState("2026-12-31");
  const [promoMax, setPromoMax] = useState(100);

  const [permissionsState, setPermissionsState] = useState<RolePermission[]>(initialRolePermissions);

  const handleStartEditPolicy = (p: ResortPolicy) => {
    setEditingPolicyId(p.id);
    setEditValue(p.value);
  };

  const handleSavePolicy = (id: string) => {
    onUpdatePolicy(id, editValue);
    setEditingPolicyId(null);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePromotion({
      code: promoCode.toUpperCase(),
      discountPercent: Number(promoDiscount),
      description: promoDesc,
      validUntil: promoValid,
      status: "Active",
      maxUsage: Number(promoMax),
    });
    setPromoModalOpen(false);
    setPromoCode("");
    setPromoDesc("");
  };

  const handleTogglePermission = (role: UserRole, key: "canCheckInOut" | "canManageRates" | "canEditPolicies" | "canSettleFolio") => {
    setPermissionsState((prev) =>
      prev.map((rp) => (rp.role === role ? { ...rp, [key]: !rp[key] } : rp))
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--champagne)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--champagne)]">
              Executive Governance & Administrative Policies
            </p>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Resort Administration & Controls
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground sm:text-sm">
            Configure resort operational policies, promotional discount vouchers, luxury tax schedules, and staff role permission matrices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            {[
              { id: "policies", label: "Resort Policies" },
              { id: "promotions", label: "Promotions & Codes" },
              { id: "permissions", label: "Permissions Matrix" },
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

          {activeTab === "promotions" && (
            <Button
              size="sm"
              onClick={() => setPromoModalOpen(true)}
              className="h-8 gap-1.5 bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="size-3.5" />
              New Promo Code
            </Button>
          )}
        </div>
      </div>

      {/* TAB 1: RESORT POLICIES */}
      {activeTab === "policies" && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="resort-card p-6 space-y-4">
            <div className="border-b border-border pb-3">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Operational Policies & Benchmarks
              </h2>
              <p className="text-xs text-muted-foreground">
                Configure timing standards, cancellation grace periods, and tax schedules.
              </p>
            </div>

            <div className="space-y-4">
              {policies.map((p) => {
                const isEditing = editingPolicyId === p.id;

                return (
                  <div
                    key={p.id}
                    className="rounded-lg border border-border/70 bg-accent/30 p-4 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge variant="outline">{p.category}</Badge>
                        <h3 className="mt-1 font-semibold text-sm text-foreground">
                          {p.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {p.description}
                        </p>
                      </div>

                      {!isEditing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartEditPolicy(p)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                      )}
                    </div>

                    <div className="mt-3 border-t border-border/50 pt-2.5">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 rounded border border-[var(--champagne)] bg-background px-2.5 py-1 text-xs text-foreground font-mono outline-none"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSavePolicy(p.id)}
                            className="h-7 px-2 text-xs bg-[var(--champagne)] text-black"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingPolicyId(null)}
                            className="h-7 px-2 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Current Value:</span>
                          <span className="font-mono font-bold text-[var(--champagne)]">
                            {p.value}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aesthetic Standard Card */}
          <div className="resort-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <SunMedium className="size-6 text-[var(--champagne)]" />
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Signature Atmosphere & Palette
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Active Design System: Golden Sunrise
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-xs leading-relaxed text-muted-foreground">
                <div className="rounded-lg border border-[var(--champagne)]/40 bg-[var(--gold-soft)]/20 p-4">
                  <Badge variant="gold">Active Standard</Badge>
                  <p className="mt-2 font-bold text-foreground">
                    Golden Sunrise Luxury Tokens
                  </p>
                  <p className="mt-1">
                    Palm Grove operates on crisp solid surfaces with Ivory base (#F8F6F0), Deep Ocean primary (#173B4D), Champagne Gold highlights (#C9A45C), and Coastal Sage accents (#718B7A).
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-4 space-y-2">
                  <p className="font-semibold text-foreground">Resort Integrity Guidelines</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Zero blur/glassmorphism for maximum readability and crisp solid contrast.</li>
                    <li>Tabular numeric reels for financial metrics and room occupancy.</li>
                    <li>Full state synchronization across front desk, culinary, and guest portal.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
              <span>Security Hash: <strong className="font-mono text-foreground">SHA256:7e9b01..pg-active</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROMOTIONS */}
      {activeTab === "promotions" && (
        <div className="resort-card p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Active Promotional Discount Vouchers
              </h2>
              <p className="text-xs text-muted-foreground">
                Discount codes applied at booking reservation check-in and concierge checkout.
              </p>
            </div>
            <Button size="sm" onClick={() => setPromoModalOpen(true)} className="h-8 gap-1.5 text-xs">
              <Plus className="size-3.5" /> New Promo Code
            </Button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="resort-table w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-3 px-3">Promo Code</th>
                  <th className="py-3 px-3">Discount</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3">Valid Until</th>
                  <th className="py-3 px-3">Redemption Usage</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Toggle</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((pr) => (
                  <tr key={pr.id} className="border-b border-border/50">
                    <td className="py-3 px-3">
                      <span className="rounded bg-[var(--gold-soft)] px-2 py-1 font-mono font-bold text-xs text-[var(--champagne)]">
                        {pr.code}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-foreground">
                      {pr.discountPercent}% OFF
                    </td>
                    <td className="py-3 px-3 max-w-xs text-muted-foreground">
                      {pr.description}
                    </td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">
                      {pr.validUntil}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-foreground font-semibold">
                        <CasinoSlotNumber value={pr.usageCount} spinTrigger={spinKey} />
                      </span>{" "}
                      / {pr.maxUsage}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={pr.status === "Active" ? "gold" : "outline"}>
                        {pr.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onTogglePromoStatus(pr.id)}
                        className="h-7 text-[11px]"
                      >
                        {pr.status === "Active" ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ROLE PERMISSIONS MATRIX */}
      {activeTab === "permissions" && (
        <div className="resort-card p-6">
          <div className="border-b border-border pb-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Role-Based Access Control (RBAC) Permission Matrix
            </h2>
            <p className="text-xs text-muted-foreground">
              Define operational privileges for each account role across front desk, finance, and engineering.
            </p>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="resort-table w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Module Context</th>
                  <th className="py-3 px-3 text-center">Check-In / Out</th>
                  <th className="py-3 px-3 text-center">Manage Tariffs</th>
                  <th className="py-3 px-3 text-center">Edit Policies</th>
                  <th className="py-3 px-3 text-center">Settle Folios</th>
                  <th className="py-3 px-3">Navigation Modules</th>
                </tr>
              </thead>
              <tbody>
                {permissionsState.map((perm) => (
                  <tr key={perm.role} className="border-b border-border/50">
                    <td className="py-3 px-3">
                      <p className="font-bold text-foreground">{perm.role}</p>
                      <span className="text-[11px] text-muted-foreground">
                        {perm.description}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={perm.module === "Management" ? "gold" : perm.module === "Guest" ? "sunset" : "secondary"}>
                        {perm.module}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleTogglePermission(perm.role, "canCheckInOut")}
                        className={`size-6 rounded inline-flex items-center justify-center transition-all ${
                          perm.canCheckInOut
                            ? "bg-[var(--champagne)] text-black"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {perm.canCheckInOut && <Check className="size-3.5" strokeWidth={3} />}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleTogglePermission(perm.role, "canManageRates")}
                        className={`size-6 rounded inline-flex items-center justify-center transition-all ${
                          perm.canManageRates
                            ? "bg-[var(--champagne)] text-black"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {perm.canManageRates && <Check className="size-3.5" strokeWidth={3} />}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleTogglePermission(perm.role, "canEditPolicies")}
                        className={`size-6 rounded inline-flex items-center justify-center transition-all ${
                          perm.canEditPolicies
                            ? "bg-[var(--champagne)] text-black"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {perm.canEditPolicies && <Check className="size-3.5" strokeWidth={3} />}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleTogglePermission(perm.role, "canSettleFolio")}
                        className={`size-6 rounded inline-flex items-center justify-center transition-all ${
                          perm.canSettleFolio
                            ? "bg-[var(--champagne)] text-black"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {perm.canSettleFolio && <Check className="size-3.5" strokeWidth={3} />}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {perm.allowedTabs.map((t) => (
                          <span
                            key={t}
                            className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-mono text-foreground uppercase"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Promo Modal */}
      {promoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setPromoModalOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Create Promotional Code
                </h3>
                <p className="text-xs text-muted-foreground">
                  Generate marketing vouchers for high-value guest reservations.
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setPromoModalOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>

            <form onSubmit={handleCreatePromo} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">
                  Promo Code Identifier
                </label>
                <input
                  type="text"
                  required
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground font-mono font-bold uppercase outline-none focus:border-[var(--champagne)]"
                  placeholder="e.g. MONSOON2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={promoDiscount}
                    onChange={(e) => setPromoDiscount(Number(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground font-mono outline-none focus:border-[var(--champagne)]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={promoValid}
                    onChange={(e) => setPromoValid(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Maximum Redemption Cap
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={promoMax}
                  onChange={(e) => setPromoMax(Number(e.target.value))}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Promotion Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={promoDesc}
                  onChange={(e) => setPromoDesc(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  placeholder="e.g. Exclusive seasonal luxury privilege discount on villas"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setPromoModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Publish Promo Code
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
