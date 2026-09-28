import { useState } from "react";
import {
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Download,
  Gem,
  PieChart,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const transactions = [
  {
    id: "TXN-9041",
    guest: "Sir Julian Vance",
    suite: "S-301 · Presidential Suite",
    method: "Amex Centurion Black",
    amount: "₹3,40,000",
    date: "2026-09-24",
    department: "Lodging & Butler",
    status: "Settled",
  },
  {
    id: "TXN-9042",
    guest: "Vikramaditya Singhania",
    suite: "V-04 · Ocean Pool Villa",
    method: "Wire Transfer / HDFC Escrow",
    amount: "₹1,88,000",
    date: "2026-09-26",
    department: "Full Folio & Cellar",
    status: "Settled",
  },
  {
    id: "TXN-9043",
    guest: "Lady Ananya Iyer",
    suite: "V-07 · Premier Villa",
    method: "Visa Infinite Reserve",
    amount: "₹2,10,000",
    date: "2026-09-26",
    department: "Villa & Yacht Charter",
    status: "Pre-Authorized",
  },
  {
    id: "TXN-9044",
    guest: "Priya Sharma",
    suite: "R-204 · Deluxe Sea View",
    method: "Mastercard World Elite",
    amount: "₹96,000",
    date: "2026-09-25",
    department: "Lodging & Spa",
    status: "Settled",
  },
  {
    id: "TXN-9045",
    guest: "Rahul Mehta",
    suite: "G-12 · Garden Villa",
    method: "Amex Platinum",
    amount: "₹84,000",
    date: "2026-09-25",
    department: "Lodging & Dining",
    status: "Settled",
  },
];

export function FinanceView() {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header section with Module Accent: Emerald/Sage + Champagne */}
      <section className="rise flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--champagne)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--champagne)]">
              Revenue & Financial Intelligence · Sage + Champagne Accent
            </p>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">
            Financial Ledger & Settlement
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ADR benchmarks, RevPAR indices, department revenues, and audited transaction settlements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleExport}
            className="border-border bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Download className="size-4" />
            {downloadSuccess ? "Ledger Exported (CSV)" : "Export Statement"}
          </Button>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="resort-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Season Revenue (Q3)
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-foreground">₹1.84 Cr</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg border border-[var(--champagne)]/30 bg-[var(--champagne)]/10 text-[var(--champagne)]">
              <Gem className="size-5" />
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--sage)]">+18.4% above budget forecast</p>
        </article>

        <article className="resort-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Average Daily Rate (ADR)
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-foreground">₹28,500</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg border border-[var(--sage)]/30 bg-[var(--sage)]/10 text-[var(--sage)]">
              <TrendingUp className="size-5" />
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--sage)]">+₹3,200 higher vs. last year</p>
        </article>

        <article className="resort-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                RevPAR (Yield Index)
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-foreground">₹23,940</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg border border-[var(--champagne)]/30 bg-[var(--champagne)]/10 text-[var(--champagne)]">
              <Wallet className="size-5" />
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--sage)]">84% Occupancy factor applied</p>
        </article>

        <article className="resort-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Operating Margin
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-foreground">34.2%</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg border border-[var(--sage)]/30 bg-[var(--sage)]/10 text-[var(--sage)]">
              <ShieldCheck className="size-5" />
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--sage)]">Audited EBITDA ratio</p>
        </article>
      </section>

      {/* Department Breakdown */}
      <section className="resort-card p-6">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Departmental Revenue Composition
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Percentage contribution to resort gross receipts
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Suites, Penthouses & Villas</span>
              <span className="font-semibold text-[var(--champagne)]">62% (₹1,14,08,000)</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full bg-[var(--champagne)]" style={{ width: "62%" }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Fine Dining, Lounge & Wine Cellar</span>
              <span className="font-semibold text-[var(--sunset)]">22% (₹40,48,000)</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full bg-[var(--sunset)]" style={{ width: "22%" }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Oceanfront Ayurvedic Spa & Wellness</span>
              <span className="font-semibold text-[var(--sage)]">11% (₹20,24,000)</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full bg-[var(--sage)]" style={{ width: "11%" }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Yacht Charters & Helicopter Transfers</span>
              <span className="font-semibold text-[var(--sky)]">5% (₹9,20,000)</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full bg-[var(--sky)]" style={{ width: "5%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Transaction Settlement Ledger */}
      <section className="resort-card overflow-hidden">
        <div className="border-b border-border/80 px-6 py-4">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Audited Settlement Ledger
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Real-time pre-authorizations and settled high-value folios
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="resort-table w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-accent/30 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-5 py-4 font-semibold">Transaction ID</th>
                <th className="px-5 py-4 font-semibold">Guest & Suite</th>
                <th className="px-5 py-4 font-semibold">Payment Instrument</th>
                <th className="px-5 py-4 font-semibold">Department</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Amount</th>
                <th className="px-5 py-4 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-[var(--champagne)]">
                    {txn.id}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-foreground">{txn.guest}</div>
                    <div className="text-xs text-muted-foreground">{txn.suite}</div>
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                      <CreditCard className="size-3.5 text-muted-foreground" />
                      {txn.method}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">
                    {txn.department}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                    {txn.date}
                  </td>
                  <td className="px-5 py-4 font-mono font-semibold text-foreground">
                    {txn.amount}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Badge
                      variant={txn.status === "Settled" ? "sage" : "gold"}
                    >
                      {txn.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
