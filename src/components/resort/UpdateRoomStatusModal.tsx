import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Room, RoomStatus } from "./types";

interface UpdateRoomStatusModalProps {
  open: boolean;
  onClose: () => void;
  room: Room | null;
  onSave: (id: string, newStatus: RoomStatus, notes: string) => void;
}

export function UpdateRoomStatusModal({ open, onClose, room, onSave }: UpdateRoomStatusModalProps) {
  const [status, setStatus] = useState<RoomStatus>("Ready");
  const [notes, setNotes] = useState("");

  // Sync state when room changes
  React.useEffect(() => {
    if (room) {
      setStatus(room.status);
      setNotes("");
    }
  }, [room]);

  if (!open || !room) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(room.id, status, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={onClose} />

      {/* Modal Surface */}
      <div className="resort-card relative z-10 w-full max-w-md border border-border bg-card p-8 shadow-2xl rise">
        <button
          onClick={onClose}
          type="button"
          className="absolute right-6 top-6 flex size-8 items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
        >
          <X className="size-4" />
        </button>

        <p className="editorial-kicker">Status Update</p>
        <h2 className="editorial-heading mt-2 mb-6">
          Suite <em>{room.code}</em>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="editorial-label">New Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as RoomStatus)}
              className="mt-2 flex h-10 w-full rounded-none border-0 border-b border-border/60 bg-transparent px-0 py-2 text-base outline-none focus:border-foreground transition-colors"
            >
              <option value="Ready">Ready</option>
              <option value="Occupied">Occupied</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>

          {room.currentGuest && status !== "Occupied" && (
            <div className="rounded border border-border bg-accent/40 p-3 text-sm text-foreground">
              <strong>Warning:</strong> Changing status from Occupied will affect the current guest: <em>{room.currentGuest}</em>. Transfer may be required.
            </div>
          )}

          <div>
            <label className="editorial-label">Notes (Optional)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Needs deep cleaning, AC repair requested"
              className="mt-2 w-full rounded-md border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-foreground transition-colors"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90">
              Update Status
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
