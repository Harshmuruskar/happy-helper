export type ModuleTab =
  | "dashboard"
  | "bookings"
  | "rooms"
  | "guests"
  | "restaurant"
  | "housekeeping"
  | "finance"
  | "settings";

export type BookingStatus = "Checked In" | "Confirmed" | "Pending" | "Checked Out" | "Cancelled";

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomName: string;
  roomCode: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalAmount: string;
  status: BookingStatus;
  loyaltyTier: "Platinum" | "Gold" | "Silver" | "VIP";
  guestsCount: number;
  specialRequests?: string;
}

export type RoomStatus = "Ready" | "Occupied" | "Housekeeping" | "Maintenance";

export interface Room {
  id: string;
  code: string;
  name: string;
  type: string;
  view: string;
  wing: string;
  ratePerNight: string;
  status: RoomStatus;
  capacity: number;
  sqm: number;
  features: string[];
  currentGuest?: string;
  assignedStaff?: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  country: string;
  avatar: string;
  loyaltyTier: "Platinum" | "Gold" | "Silver";
  totalStays: number;
  totalSpent: string;
  currentRoom?: string;
  preferences: string;
  status: "In Residence" | "Arriving Today" | "Departed" | "Upcoming";
}

export type OrderStage = "Received" | "Preparing" | "Plated" | "Served";

export interface RestaurantOrder {
  id: string;
  table: string;
  venue: string;
  guestName: string;
  items: string[];
  totalAmount: string;
  time: string;
  stage: OrderStage;
}

export interface HousekeepingTask {
  id: string;
  roomCode: string;
  roomName: string;
  priority: "VIP Arrival" | "High" | "Standard" | "Turn-down";
  taskType: string;
  assignedTo: string;
  dueTime: string;
  status: "Pending" | "In Progress" | "Completed" | "Inspected";
}

export interface ResortNotification {
  id: string;
  title: string;
  detail: string;
  time: string;
  department: "Front Desk" | "Concierge" | "Housekeeping" | "Kitchen" | "General";
  unread: boolean;
  priority?: "urgent" | "info";
}
