import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Room } from "./types";

interface AddRoomModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (room: Partial<Room>) => void;
}

export function AddRoomModal({ open, onClose, onSave }: AddRoomModalProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("Villa");
  const [floor, setFloor] = useState("");
  const [rate, setRate] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [wing, setWing] = useState("North Coral Bay");
  const [view, setView] = useState("Ocean View");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `R-${Math.random().toString(36).substr(2, 9)}`,
      code,
      name,
      type,
      floor,
      ratePerNight: rate,
      capacity,
      wing,
      view,
      status: "Ready",
      sqm: 120,
      features: ["King Bed", "Private Pool", "Butler Service"],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={onClose} />

      {/* Modal Surface */}
      <div className="resort-card relative z-10 w-full max-w-lg border border-border bg-card p-8 shadow-2xl rise">
        <button
          onClick={onClose}
          type="button"
          className="absolute right-6 top-6 flex size-8 items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
        >
          <X className="size-4" />
        </button>

        <p className="editorial-kicker">Property Management</p>
        <h2 className="editorial-heading mt-2 mb-6">
          Add <em>New Suite</em>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="editorial-label">Room Code</label>
              <Input
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. V-101"
              />
            </div>
            <div>
              <label className="editorial-label">Suite Name</label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ocean Pavilion"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="editorial-label">Suite Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-2 flex h-10 w-full rounded-none border-0 border-b border-border/60 bg-transparent px-0 py-2 text-base outline-none focus:border-foreground transition-colors"
              >
                <option value="Villa">Villa</option>
                <option value="Suite">Suite</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Standard">Standard Room</option>
              </select>
            </div>
            <div>
              <label className="editorial-label">Base Rate</label>
              <Input
                required
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="e.g. ₹45,000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="editorial-label">Architectural Wing</label>
              <select
                value={wing}
                onChange={(e) => setWing(e.target.value)}
                className="mt-2 flex h-10 w-full rounded-none border-0 border-b border-border/60 bg-transparent px-0 py-2 text-base outline-none focus:border-foreground transition-colors"
              >
                <option value="North Coral Bay">North Coral Bay</option>
                <option value="The Grand Pavilion">The Grand Pavilion</option>
                <option value="Orchid Sanctuary">Orchid Sanctuary</option>
              </select>
            </div>
            <div>
              <label className="editorial-label">Max Capacity</label>
              <Input
                type="number"
                required
                min={1}
                value={capacity}
                onChange={(e) => setCapacity(Number.parseInt(e.target.value, 10))}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90">
              Save Suite Inventory
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
