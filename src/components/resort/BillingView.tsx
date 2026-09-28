import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Filter,
  Plus,
  Printer,
  Receipt,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Account,
  Booking,
  FolioCharge,
  FolioPayment,
  ReservationFolio,
} from "./types";
import { CasinoSlotNumber } from "./CasinoSlotNumber";
import { useCasino } from "./CasinoControl";

interface BillingViewProps {
  folios: ReservationFolio[];
  bookings: Booking[];
  currentAccount: Account;
  onRecordPayment: (reservationId: string, payment: Omit<FolioPayment, "id">) => void;
}

export function BillingView({
  folios,
  bookings,
  currentAccount,
  onRecordPayment,
}: BillingViewProps) {
  const { spinKey } = useCasino();
  const [activeTab, setActiveTab] = useState<"folios" | "expenses">("folios");
  const [selectedReservationId, setSelectedReservationId] = useState<string>(
    currentAccount.role === "Guest" ? "BK-8095" : folios[0]?.reservationId || "BK-8091"
  );
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Payment Form State
  const [payAmount, setPayAmount] = useState<number>(20000);
  const [payMethod, setPayMethod] = useState<"Credit Card" | "UPI" | "Cash" | "Loyalty Points" | "Wire Transfer">("Credit Card");
  const [payRef, setPayRef] = useState<string>("VISA-Card");

  const currentFolio = folios.find((f) => f.reservationId === selectedReservationId) || folios[0];

  // Calculations
  const totalCharges = currentFolio ? currentFolio.charges.reduce((acc, c) => acc + c.amount, 0) : 0;
  const taxAmount = Math.round((totalCharges - (currentFolio?.discountAmount || 0)) * ((currentFolio?.taxRatePercent || 18) / 100));
  const grandTotal = totalCharges - (currentFolio?.discountAmount || 0) + taxAmount;
  const totalPaid = currentFolio ? currentFolio.payments.reduce((acc, p) => acc + p.amount, 0) : 0;
  const balanceDue = grandTotal - totalPaid;

  const handleOpenPayment = () => {
    setPayAmount(Math.max(0, balanceDue));
    setPaymentModalOpen(true);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFolio) return;

    onRecordPayment(currentFolio.reservationId, {
      date: new Date().toISOString().slice(0, 10),
      amount: Number(payAmount),
      method: payMethod,
      type: "Payment",
      reference: payRef || `${payMethod}-TXN-${Date.now().toString().slice(-4)}`,
    });

    setPaymentModalOpen(false);
  };

  // Operational Expenses seed
  const expenses = [
    { id: "EXP-101", date: "2026-09-28", category: "Culinary & Fine Wines", vendor: "Bordeaux Premier Imports", amount: 145000, status: "Paid", authorizedBy: "Chef Marco Rossi" },
    { id: "EXP-102", date: "2026-09-27", category: "Eco Energy & Utilities", vendor: "Coastal Solar & Hydro Grid", amount: 84000, status: "Paid", authorizedBy: "Amol Muruskar" },
    { id: "EXP-103", date: "2026-09-26", category: "Spa & Aromatherapy Oils", vendor: "Kerala Ayurvedic Organics", amount: 32000, status: "Settled", authorizedBy: "Leila Nair" },
    { id: "EXP-104", date: "2026-09-25", category: "Linen & Egyptian Cotton", vendor: "Imperial Textile Mills", amount: 68000, status: "Pending", authorizedBy: "Sunita Rao" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--champagne)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--champagne)]">
              Financial Governance & Folio Settlement
            </p>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Resort Billing & Guest Folios
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground sm:text-sm">
            Itemized room night charges, in-suite dining transfers, concierge spa folios, tax schedules, and ledger reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            <button
              onClick={() => setActiveTab("folios")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "folios"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Guest Folios
            </button>
            <button
              onClick={() => setActiveTab("expenses")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "expenses"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Operational Expenses
            </button>
          </div>

          {activeTab === "folios" && (
            <Button
              size="sm"
              onClick={handleOpenPayment}
              className="h-8 gap-1.5 bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90"
            >
              <CreditCard className="size-3.5" />
              Record Payment
            </Button>
          )}
        </div>
      </div>

      {activeTab === "folios" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: Select Folio Reservation */}
          <div className="lg:col-span-4 space-y-4">
            <div className="resort-card p-5">
              <h2 className="font-display text-lg font-semibold text-foreground">
                In-House Guest Folios
              </h2>
              <p className="text-xs text-muted-foreground">
                Select a guest stay to view live itemized charges.
              </p>

              <div className="mt-4 space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {folios.map((folio) => {
                  const isSelected = folio.reservationId === currentFolio?.reservationId;
                  const fCharges = folio.charges.reduce((a, c) => a + c.amount, 0);
                  const fPaid = folio.payments.reduce((a, p) => a + p.amount, 0);
                  const fTax = Math.round((fCharges - folio.discountAmount) * (folio.taxRatePercent / 100));
                  const fTotal = fCharges - folio.discountAmount + fTax;
                  const fBal = fTotal - fPaid;

                  return (
                    <div
                      key={folio.reservationId}
                      onClick={() => setSelectedReservationId(folio.reservationId)}
                      className={`cursor-pointer rounded-lg border p-3 transition-all ${
                        isSelected
                          ? "border-[var(--champagne)] bg-[var(--gold-soft)]/30 shadow-sm"
                          : "border-border/80 bg-background/60 hover:border-border hover:bg-accent/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-foreground">
                          {folio.reservationId}
                        </span>
                        <span className="rounded bg-accent px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--champagne)]">
                          Suite {folio.roomCode}
                        </span>
                      </div>

                      <p className="mt-1 font-semibold text-xs text-foreground">
                        {folio.guestName}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Balance:</span>
                        <span
                          className={`font-mono font-bold ${
                            fBal > 0 ? "text-[var(--sunset)]" : "text-[var(--sage)]"
                          }`}
                        >
                          {fBal > 0 ? `₹${fBal.toLocaleString()} Due` : "Settled ✓"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Itemized Folio Invoice */}
          <div className="lg:col-span-8">
            <div className="resort-card p-6 sm:p-8">
              {/* Folio Brand Header */}
              <div className="flex flex-col justify-between gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[var(--champagne)]" />
                    <p className="font-display text-xl font-bold tracking-tight text-foreground">
                      Palm Grove Coastal Resort
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tax Invoice & Guest Hospitality Folio · GSTIN: 27AAACP0192Q1ZA
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <Badge variant="gold">
                    Folio #{currentFolio?.reservationId}
                  </Badge>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    Suite {currentFolio?.roomCode} · {currentFolio?.guestName}
                  </p>
                </div>
              </div>

              {/* KPI Summary Strip */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-border bg-accent/30 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Total Charges
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold text-foreground">
                    ₹{totalCharges.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-accent/30 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    GST & Service (18%)
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold text-foreground">
                    +₹{taxAmount.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-accent/30 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Payments Recorded
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold text-[var(--sage)]">
                    -₹{totalPaid.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg border border-[var(--champagne)]/40 bg-[var(--gold-soft)]/30 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--champagne)]">
                    Net Balance Due
                  </p>
                  <p className="mt-1 font-mono text-base font-bold text-foreground">
                    <CasinoSlotNumber
                      value={balanceDue}
                      spinTrigger={spinKey}
                      prefix="₹"
                    />
                  </p>
                </div>
              </div>

              {/* Itemized Charges Table */}
              <div className="mt-6">
                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                  Itemized Line Charges
                </h3>
                <div className="overflow-x-auto">
                  <table className="resort-table w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Description</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentFolio?.charges.map((chg) => (
                        <tr key={chg.id} className="border-b border-border/50">
                          <td className="py-2.5 px-3 font-mono text-muted-foreground">
                            {chg.date}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-foreground">
                            {chg.description}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
                              {chg.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-right text-foreground">
                            ₹{chg.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payments History Table */}
              <div className="mt-6">
                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                  Payments & Credits Applied
                </h3>
                <div className="overflow-x-auto">
                  <table className="resort-table w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Payment Method</th>
                        <th className="py-2.5 px-3">Reference</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentFolio?.payments.map((pmt) => (
                        <tr key={pmt.id} className="border-b border-border/50">
                          <td className="py-2.5 px-3 font-mono text-muted-foreground">
                            {pmt.date}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-foreground">
                            {pmt.method}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground">
                            {pmt.reference}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-right text-[var(--sage)]">
                            ₹{pmt.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="h-8 gap-1.5 text-xs border-border"
                  >
                    <Printer className="size-3.5" />
                    Print Folio
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  {balanceDue > 0 ? (
                    <Button
                      size="sm"
                      onClick={handleOpenPayment}
                      className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
                    >
                      <CreditCard className="size-3.5" />
                      Settle Balance (₹{balanceDue.toLocaleString()})
                    </Button>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--sage)]">
                      <CheckCircle2 className="size-4" />
                      Folio Fully Settled & Reconciled
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Operational Expenses View */}
      {activeTab === "expenses" && (
        <div className="resort-card p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Resort Operational Expenses Ledger
              </h2>
              <p className="text-xs text-muted-foreground">
                Audited operational outlays, wholesale culinary procurement, utilities, and linen replacements.
              </p>
            </div>
            <Badge variant="outline">
              Fiscal Year 2026–27
            </Badge>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="resort-table w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-3 px-3">Voucher ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Vendor / Recipient</th>
                  <th className="py-3 px-3">Authorized By</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id} className="border-b border-border/50">
                    <td className="py-3 px-3 font-mono font-semibold text-foreground">
                      {exp.id}
                    </td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">
                      {exp.date}
                    </td>
                    <td className="py-3 px-3 font-medium text-foreground">
                      {exp.category}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {exp.vendor}
                    </td>
                    <td className="py-3 px-3 text-foreground">
                      {exp.authorizedBy}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-right text-foreground">
                      ₹{exp.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={exp.status === "Paid" || exp.status === "Settled" ? "gold" : "secondary"}>
                        {exp.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {paymentModalOpen && currentFolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setPaymentModalOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <Badge variant="gold">Folio #{currentFolio.reservationId}</Badge>
                <h3 className="mt-1 font-display text-xl font-bold text-foreground">
                  Record Folio Payment
                </h3>
                <p className="text-xs text-muted-foreground">
                  Guest: {currentFolio.guestName} · Suite {currentFolio.roomCode}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPaymentModalOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmitPayment} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground font-mono font-bold text-sm outline-none focus:border-[var(--champagne)]"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Current balance remaining: ₹{balanceDue.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Settlement Method
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                >
                  <option value="Credit Card">Credit Card (Visa / Mastercard / Amex)</option>
                  <option value="UPI">UPI / Digital QR Code</option>
                  <option value="Wire Transfer">Direct Wire / Swift Transfer</option>
                  <option value="Loyalty Points">Redeem Loyalty Points</option>
                  <option value="Cash">Cash (Front Desk Safe Deposit)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Transaction / Card Reference
                </label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  placeholder="e.g. VISA-****4019 or UPI Ref ID"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPaymentModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Process Payment (₹{payAmount.toLocaleString()})
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
