import { useState } from "react";
import {
  Archive,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Tag,
  User,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Account,
  HousekeepingTask,
  LostAndFoundItem,
  Room,
  TaskPriority,
  TaskStatus,
} from "./types";

interface OperationsViewProps {
  tasks: HousekeepingTask[];
  rooms: Room[];
  lostAndFound: LostAndFoundItem[];
  currentAccount: Account;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (task: Omit<HousekeepingTask, "id">) => void;
  onAddLostAndFound: (item: Omit<LostAndFoundItem, "id">) => void;
  onReturnLostItem: (itemId: string, guestName: string, phone: string) => void;
}

export function OperationsView({
  tasks,
  rooms,
  lostAndFound,
  currentAccount,
  onUpdateTaskStatus,
  onAddTask,
  onAddLostAndFound,
  onReturnLostItem,
}: OperationsViewProps) {
  const [activeTab, setActiveTab] = useState<"tasks" | "lost_found">("tasks");
  const [taskFilter, setTaskFilter] = useState<string>("All");

  // Task Modal state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskRoomCode, setTaskRoomCode] = useState(rooms[0]?.code || "R-204");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("Standard");
  const [taskAssignee, setTaskAssignee] = useState("Sunita Rao");
  const [taskDue, setTaskDue] = useState("03:30 PM");

  // Lost & Found Modal state
  const [lfModalOpen, setLfModalOpen] = useState(false);
  const [lfItemName, setLfItemName] = useState("");
  const [lfCategory, setLfCategory] = useState<any>("Accessories");
  const [lfLocation, setLfLocation] = useState("Beach Cabana 3");
  const [lfFinder, setLfFinder] = useState(currentAccount.name);
  const [lfVault, setLfVault] = useState("Front Desk Vault A-12");
  const [lfNotes, setLfNotes] = useState("");

  // Claim item modal state
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedLfItem, setSelectedLfItem] = useState<LostAndFoundItem | null>(null);
  const [claimGuestName, setClaimGuestName] = useState("");
  const [claimGuestPhone, setClaimGuestPhone] = useState("");

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === "All") return true;
    return t.status === taskFilter || t.priority === taskFilter;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const targetRoom = rooms.find((r) => r.code === taskRoomCode);

    onAddTask({
      roomCode: taskRoomCode,
      roomName: targetRoom ? targetRoom.name : `Villa ${taskRoomCode}`,
      priority: taskPriority,
      taskType: taskTitle || "Suite Sanitation & Linen Preparation",
      assignedTo: taskAssignee,
      dueTime: taskDue,
      status: "Pending",
      kind: "Cleaning",
    });

    setTaskModalOpen(false);
    setTaskTitle("");
  };

  const handleCreateLf = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLostAndFound({
      itemName: lfItemName,
      category: lfCategory,
      foundLocation: lfLocation,
      foundDate: new Date().toISOString().split("T")[0],
      foundBy: lfFinder,
      storageLocation: lfVault,
      status: "Stored in Vault",
      notes: lfNotes,
    });

    setLfModalOpen(false);
    setLfItemName("");
    setLfNotes("");
  };

  const handleOpenClaim = (item: LostAndFoundItem) => {
    setSelectedLfItem(item);
    setClaimModalOpen(true);
  };

  const handleConfirmClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLfItem) return;
    onReturnLostItem(selectedLfItem.id, claimGuestName, claimGuestPhone);
    setClaimModalOpen(false);
    setSelectedLfItem(null);
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "VIP Arrival":
        return <Badge variant="gold">VIP Arrival</Badge>;
      case "High":
      case "Urgent":
        return <Badge variant="sunset">{priority}</Badge>;
      case "Turn-down":
        return <Badge variant="secondary">Turn-down</Badge>;
      default:
        return <Badge variant="outline">Standard</Badge>;
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
              Operational Logistics & Property Excellence
            </p>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Resort Operations & Housekeeping
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground sm:text-sm">
            Centralized work dispatch, 5-star turnaround inspections, maintenance workflows, and secure lost & found vault custody.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            <button
              onClick={() => setActiveTab("tasks")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "tasks"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tasks & Inspections
            </button>
            <button
              onClick={() => setActiveTab("lost_found")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "lost_found"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Lost & Found Vault
            </button>
          </div>

          {activeTab === "tasks" ? (
            <Button
              size="sm"
              onClick={() => setTaskModalOpen(true)}
              className="h-8 gap-1.5 bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="size-3.5" />
              New Work Task
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setLfModalOpen(true)}
              className="h-8 gap-1.5 bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90"
            >
              <Archive className="size-3.5" />
              Log Found Item
            </Button>
          )}
        </div>
      </div>

      {/* Tasks Tab */}
      {activeTab === "tasks" && (
        <div className="space-y-6">
          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
            {["All", "Pending", "In Progress", "Inspection", "Completed", "VIP Arrival"].map((f) => (
              <button
                key={f}
                onClick={() => setTaskFilter(f)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  taskFilter === f
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border/80 bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Tasks Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                className="resort-card flex flex-col justify-between p-5 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--champagne)]">
                      Suite {t.roomCode}
                    </span>
                    {getPriorityBadge(t.priority)}
                  </div>

                  <h3 className="mt-2.5 font-display text-base font-semibold text-foreground">
                    {t.roomName}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {t.taskType}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-3">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <User className="size-3.5 text-muted-foreground" />
                      {t.assignedTo}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="size-3" />
                      Due {t.dueTime}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3">
                  <Badge variant={t.status === "Completed" ? "gold" : "outline"}>
                    {t.status}
                  </Badge>

                  <div className="flex items-center gap-1.5">
                    {t.status === "Pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateTaskStatus(t.id, "In Progress")}
                        className="h-7 text-[11px]"
                      >
                        Start
                      </Button>
                    )}
                    {t.status === "In Progress" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateTaskStatus(t.id, "Inspection")}
                        className="h-7 text-[11px] text-[var(--champagne)] border-[var(--champagne)]/60"
                      >
                        Request QA Inspection
                      </Button>
                    )}
                    {t.status === "Inspection" && (
                      <Button
                        size="sm"
                        onClick={() => onUpdateTaskStatus(t.id, "Completed")}
                        className="h-7 bg-[var(--champagne)] text-black hover:bg-[var(--champagne)]/90 text-[11px]"
                      >
                        Approve QA
                      </Button>
                    )}
                    {t.status === "Completed" && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--sage)]">
                        <CheckCircle2 className="size-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lost & Found Tab */}
      {activeTab === "lost_found" && (
        <div className="resort-card p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Lost & Found Vault Registry
              </h2>
              <p className="text-xs text-muted-foreground">
                Documented custody of guest articles found in suites, beachfront cabanas, and public pavilions.
              </p>
            </div>
            <Badge variant="gold">
              {lostAndFound.length} Items Logged
            </Badge>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="resort-table w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-3 px-3">Item ID</th>
                  <th className="py-3 px-3">Item Description</th>
                  <th className="py-3 px-3">Found Location</th>
                  <th className="py-3 px-3">Found By / Date</th>
                  <th className="py-3 px-3">Storage Location</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lostAndFound.map((item) => (
                  <tr key={item.id} className="border-b border-border/50">
                    <td className="py-3 px-3 font-mono font-semibold text-foreground">
                      {item.id}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-foreground">{item.itemName}</p>
                      <span className="text-[11px] text-muted-foreground">
                        {item.category} {item.notes && `· ${item.notes}`}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-foreground">
                      {item.foundLocation}
                    </td>
                    <td className="py-3 px-3">
                      <p className="text-foreground">{item.foundBy}</p>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {item.foundDate}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[var(--champagne)]">
                      {item.storageLocation}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={item.status === "Returned to Guest" ? "gold" : "outline"}>
                        {item.status}
                      </Badge>
                      {item.claimedByGuest && (
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          Claimed by {item.claimedByGuest}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {item.status === "Stored in Vault" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenClaim(item)}
                          className="h-7 text-[11px] border-border hover:border-[var(--champagne)]"
                        >
                          Return to Guest
                        </Button>
                      ) : (
                        <span className="flex items-center justify-end gap-1 text-[11px] font-medium text-[var(--sage)]">
                          <CheckCircle2 className="size-3.5" />
                          Handover Complete
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setTaskModalOpen(false)}
          />

          <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Dispatch New Operational Task
                </h3>
                <p className="text-xs text-muted-foreground">
                  Assign housekeeping, engineering, or inspection duties to on-duty staff.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTaskModalOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Target Suite / Villa
                  </label>
                  <select
                    value={taskRoomCode}
                    onChange={(e) => setTaskRoomCode(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  >
                    {rooms.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.code} — {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Priority Tier
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  >
                    <option value="VIP Arrival">VIP Arrival</option>
                    <option value="High">High</option>
                    <option value="Standard">Standard</option>
                    <option value="Turn-down">Turn-down</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Task Title & Scope
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  placeholder="e.g. Deep steam sanitize teak daybeds & refill bath oils"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Assigned Staff Member
                  </label>
                  <input
                    type="text"
                    required
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Target Completion Time
                  </label>
                  <input
                    type="text"
                    required
                    value={taskDue}
                    onChange={(e) => setTaskDue(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                    placeholder="03:30 PM"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTaskModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Dispatch Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Found Item Modal */}
      {lfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setLfModalOpen(false)}
          />

          <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Log Found Article in Vault
                </h3>
                <p className="text-xs text-muted-foreground">
                  Secure cataloging of guest property into front desk vault storage.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLfModalOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>

            <form onSubmit={handleCreateLf} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">
                  Item Name & Description
                </label>
                <input
                  type="text"
                  required
                  value={lfItemName}
                  onChange={(e) => setLfItemName(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  placeholder="e.g. Gold signet ring with emerald stone"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Category
                  </label>
                  <select
                    value={lfCategory}
                    onChange={(e) => setLfCategory(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  >
                    <option value="Jewelry">Jewelry & Watches</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories & Eyewear</option>
                    <option value="Apparel">Apparel & Footwear</option>
                    <option value="Documents">Passports & Documents</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Found Location
                  </label>
                  <input
                    type="text"
                    required
                    value={lfLocation}
                    onChange={(e) => setLfLocation(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Found By (Staff Name)
                  </label>
                  <input
                    type="text"
                    required
                    value={lfFinder}
                    onChange={(e) => setLfFinder(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Vault Storage Code
                  </label>
                  <input
                    type="text"
                    required
                    value={lfVault}
                    onChange={(e) => setLfVault(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows={2}
                  value={lfNotes}
                  onChange={(e) => setLfNotes(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  placeholder="Distinguishing marks, engraving, serial number..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLfModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Store in Vault
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Claim / Return Modal */}
      {claimModalOpen && selectedLfItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setClaimModalOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <Badge variant="gold">Item #{selectedLfItem.id}</Badge>
                <h3 className="mt-1 font-display text-lg font-bold text-foreground">
                  Confirm Handover to Guest
                </h3>
                <p className="text-xs text-muted-foreground">
                  {selectedLfItem.itemName} ({selectedLfItem.storageLocation})
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setClaimModalOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>

            <form onSubmit={handleConfirmClaim} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">
                  Claimant Guest Name
                </label>
                <input
                  type="text"
                  required
                  value={claimGuestName}
                  onChange={(e) => setClaimGuestName(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  placeholder="e.g. Sir Julian Vance"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Contact Phone / Room Verification
                </label>
                <input
                  type="text"
                  required
                  value={claimGuestPhone}
                  onChange={(e) => setClaimGuestPhone(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-[var(--champagne)]"
                  placeholder="+44 7700 900142"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setClaimModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Confirm Handover
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
