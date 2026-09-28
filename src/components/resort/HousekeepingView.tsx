import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Filter,
  Sparkles,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HousekeepingTask } from "./types";

interface HousekeepingViewProps {
  tasks: HousekeepingTask[];
  onUpdateTask: (id: string, newStatus: HousekeepingTask["status"]) => void;
}

export function HousekeepingView({ tasks, onUpdateTask }: HousekeepingViewProps) {
  const [priorityFilter, setPriorityFilter] = useState<string>("All");

  const priorities = ["All", "VIP Arrival", "High", "Standard", "Turn-down"];

  const filtered = tasks.filter(
    (t) => priorityFilter === "All" || t.priority === priorityFilter
  );

  return (
    <div className="space-y-6">
      {/* Header section with Module Accent: Soft Sage */}
      <section className="rise flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--sage)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--sage)]">
              Housekeeping & Turn-Down Operations · Soft Sage Accent
            </p>
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">
            Villa Housekeeping & QA Inspection
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Daily suite sanitization, VIP arrival prep, linen turns, and quality assurance inspections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="sage" className="px-3 py-1 text-xs">
            <Sparkles className="mr-1 size-3.5" />
            88% Suites Inspected & Approved
          </Badge>
        </div>
      </section>

      {/* Filter toolbar */}
      <section className="resort-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Priority Queue:
          </span>
          {priorities.map((pr) => (
            <button
              key={pr}
              onClick={() => setPriorityFilter(pr)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                priorityFilter === pr
                  ? "border border-[var(--sage)] bg-[var(--sage)] text-white shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {pr}
            </button>
          ))}
        </div>
      </section>

      {/* Task List Table */}
      <section className="resort-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="resort-table w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-accent/30 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-5 py-4 font-semibold">Suite Code</th>
                <th className="px-5 py-4 font-semibold">Suite Name & Task Details</th>
                <th className="px-5 py-4 font-semibold">Priority</th>
                <th className="px-5 py-4 font-semibold">Assigned Staff</th>
                <th className="px-5 py-4 font-semibold">Due Time</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((task) => (
                <tr key={task.id}>
                  <td className="px-5 py-4 font-mono font-bold text-[var(--champagne)]">
                    {task.roomCode}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-foreground">{task.roomName}</div>
                    <div className="text-xs text-muted-foreground">{task.taskType}</div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant={
                        task.priority === "VIP Arrival"
                          ? "gold"
                          : task.priority === "High"
                          ? "sunset"
                          : "outline"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                      <User className="size-3.5 text-muted-foreground" />
                      {task.assignedTo}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                    {task.dueTime}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant={
                        task.status === "Inspected"
                          ? "sage"
                          : task.status === "Completed"
                          ? "gold"
                          : task.status === "In Progress"
                          ? "sunset"
                          : "outline"
                      }
                    >
                      {task.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {task.status === "Pending" && (
                      <Button
                        size="sm"
                        onClick={() => onUpdateTask(task.id, "In Progress")}
                        className="h-7 text-xs bg-[var(--sage)] text-white hover:bg-[var(--sage)]/90"
                      >
                        Start
                      </Button>
                    )}
                    {task.status === "In Progress" && (
                      <Button
                        size="sm"
                        onClick={() => onUpdateTask(task.id, "Completed")}
                        className="h-7 text-xs bg-[var(--champagne)] text-black hover:bg-[var(--champagne)]/90"
                      >
                        Complete
                      </Button>
                    )}
                    {task.status === "Completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateTask(task.id, "Inspected")}
                        className="h-7 text-xs border-[var(--sage)] text-[var(--sage)] hover:bg-[var(--sage)]/10"
                      >
                        Approve QA
                      </Button>
                    )}
                    {task.status === "Inspected" && (
                      <span className="flex items-center justify-end gap-1 text-xs text-[var(--sage)] font-semibold">
                        <CheckCircle2 className="size-4" /> Ready
                      </span>
                    )}
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
