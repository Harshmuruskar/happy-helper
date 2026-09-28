export type ModuleTab =
  | "dashboard"
  | "bookings"
  | "rooms"
  | "people"
  | "amenities"
  | "billing"
  | "operations"
  | "administration"
  // Legacy aliases
  | "guests"
  | "restaurant"
  | "housekeeping"
  | "finance"
  | "settings";

export type UserRole =
  | "General Manager"
  | "Receptionist"
  | "Housekeeper"
  | "Cashier"
  | "Chef F&B"
  | "Maintenance"
  | "Guest";

export interface Account {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  module: "Management" | "Staff" | "Guest";
  avatar: string;
  assignedGuestId?: string;
  assignedRoomCode?: string;
  shift?: string;
}

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

export type RoomStatus = "Ready" | "Occupied" | "Dirty" | "Inspection" | "Maintenance" | "Out of Service";

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
  loyaltyTier: "Platinum" | "Gold" | "Silver" | "VIP";
  loyaltyPoints: number;
  totalStays: number;
  totalSpent: string;
  currentRoom?: string;
  preferences: string;
  documentId?: string;
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

export type TaskKind = "Cleaning" | "Maintenance" | "Property" | "Turn-down" | "Inspection";
export type TaskPriority = "VIP Arrival" | "High" | "Standard" | "Urgent" | "Turn-down";
export type TaskStatus = "Pending" | "In Progress" | "Inspection" | "Completed";

export interface HousekeepingTask {
  id: string;
  roomCode: string;
  roomName: string;
  priority: TaskPriority;
  taskType: string;
  assignedTo: string;
  dueTime: string;
  status: TaskStatus;
  kind?: TaskKind;
}

export interface ResortNotification {
  id: string;
  title: string;
  detail: string;
  time: string;
  department: "Front Desk" | "Concierge" | "Housekeeping" | "Kitchen" | "General" | "Billing";
  unread: boolean;
  priority?: "urgent" | "info";
}

// -------------------------------------------------------------
// RRMS Extended Entities: Services, Billing, Support, Reviews, Lost & Found, Admin
// -------------------------------------------------------------

export interface ResortServiceItem {
  id: string;
  name: string;
  category: "Spa" | "Dining" | "Experience" | "Transport" | "Laundry";
  price: number;
  duration: string;
  description: string;
  availability: string;
}

export type ServiceBookingStatus = "Requested" | "Accepted" | "In progress" | "Completed" | "Cancelled";

export interface ServiceBooking {
  id: string;
  reservationId: string;
  guestName: string;
  roomCode: string;
  serviceId: string;
  serviceName: string;
  category: string;
  amount: number;
  scheduledDate: string;
  scheduledTime: string;
  status: ServiceBookingStatus;
  notes?: string;
}

export interface FolioCharge {
  id: string;
  date: string;
  description: string;
  category: "Room" | "Service" | "Dining" | "Tax" | "Discount";
  amount: number;
}

export interface FolioPayment {
  id: string;
  date: string;
  amount: number;
  method: "Credit Card" | "UPI" | "Cash" | "Loyalty Points" | "Wire Transfer";
  type: "Payment" | "Refund";
  reference: string;
}

export interface ReservationFolio {
  reservationId: string;
  guestName: string;
  roomCode: string;
  charges: FolioCharge[];
  payments: FolioPayment[];
  taxRatePercent: number;
  discountAmount: number;
}

export type SupportTicketCategory =
  | "Request"
  | "Complaint"
  | "Maintenance"
  | "Food & Beverage"
  | "Housekeeping"
  | "Property care"
  | "Inspections"
  | "Lost & found"
  | "Receptionist"
  | "Cashier"
  | "Gardener"
  | "Spa";

export type SupportTicketStatus = "Open" | "In progress" | "Resolved";

export interface SupportTicket {
  id: string;
  guestId: string;
  guestName: string;
  roomCode: string;
  subject: string;
  description: string;
  category: SupportTicketCategory;
  priority: "Standard" | "High" | "Urgent";
  status: SupportTicketStatus;
  createdAt: string;
  assignedStaff?: string;
  response?: string;
}

export interface GuestReview {
  id: string;
  reservationId: string;
  guestId: string;
  guestName: string;
  roomName: string;
  overallRating: number; // 1-5
  roomRating: number;    // 1-5
  serviceRating: number; // 1-5
  title: string;
  comment: string;
  date: string;
  verifiedStay: boolean;
}

export type LostAndFoundStatus = "Stored in Vault" | "Returned to Guest" | "Unclaimed";

export interface LostAndFoundItem {
  id: string;
  itemName: string;
  category: "Electronics" | "Jewelry" | "Apparel" | "Documents" | "Accessories" | "Other";
  foundLocation: string;
  foundDate: string;
  foundBy: string;
  storageLocation: string;
  status: LostAndFoundStatus;
  claimedByGuest?: string;
  contactNumber?: string;
  notes?: string;
}

export interface ResortPolicy {
  id: string;
  key: string;
  title: string;
  value: string;
  category: "Check-in/Out" | "Financial" | "Operational" | "Guest Experience";
  description: string;
}

export interface PromotionCode {
  id: string;
  code: string;
  discountPercent: number;
  description: string;
  validUntil: string;
  status: "Active" | "Expired";
  usageCount: number;
  maxUsage: number;
}

export interface RolePermission {
  role: UserRole;
  module: "Management" | "Staff" | "Guest";
  description: string;
  allowedTabs: ModuleTab[];
  canCheckInOut: boolean;
  canManageRates: boolean;
  canEditPolicies: boolean;
  canSettleFolio: boolean;
}
