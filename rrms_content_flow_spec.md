# Resort Resource Management System (RRMS) - Content & Flow Specification

This document serves as the complete functional specification, content structure, and user flow for the RRMS project. It is designed so that you can apply a completely new theme or design system while retaining 100% of the application's underlying logic, data, and user experience flow.

## 1. Core Data Models (State)
The application relies on a centralized state management system containing the following entities:

*   **Rooms**: `id`, `number`, `type`, `floor`, `rate`, `capacity`, `status` (Ready, Occupied, Dirty, Inspection, Maintenance, Out of Service), `amenityIds`.
*   **Guests**: `id`, `name`, `email`, `phone`, `address`, `preferences`, `document`, `points` (loyalty).
*   **Accounts**: User accounts linked to `Module` (Guest, Management, Staff, Owner) and `Role` (Receptionist, Housekeeping, Cashier, Maintenance, Gardener, F&B, Spa).
*   **Reservations**: `id`, `guestId`, `roomId`, `checkIn`, `checkOut`, `status` (Confirmed, Checked in, Completed, Cancelled, No-show), `rate`, `discount`, `taxRate`, `source`, `adults`, `history`.
*   **Services**: Guest requests (e.g., Spa, Dining). `id`, `reservationId`, `name`, `category`, `amount`, `status` (Requested, Accepted, In progress, Completed, Cancelled).
*   **Tasks**: Staff duties. `id`, `title`, `role`, `roomId`, `priority`, `deadline`, `status` (Pending, In progress, Inspection, Completed), `kind` (Cleaning, Maintenance, Property, etc.).
*   **Payments**: `id`, `reservationId`, `amount`, `type` (Payment, Refund), `method`, `date`.
*   **Complaints/Support**: `id`, `guestId`, `subject`, `description`, `category`, `status` (Open, In progress, Resolved), `response`.
*   **Reviews**: `id`, `reservationId`, `guestId`, `rating`, `roomRating`, `serviceRating`, `text` (Uses a 5-star interactive input).
*   **Other Entities**: Amenities, Changes (Reservation modifications), Notifications, Expenses, Promotions, Found (Lost & Found), Policies (Resort rules & settings), Permissions.

## 2. User Roles & Modules
The UI flow adapts based on the logged-in user:
*   **Management / Owner**: Full access to all dashboards, analytics, settings, and staff management.
*   **Staff**: Access restricted to their specific role (e.g., Housekeeping sees cleaning tasks; Receptionist sees bookings).
*   **Guest**: Can view their own profile, past/current stays, request services, submit support tickets, view loyalty points, and leave reviews.

## 3. Page Flow & Content Breakdown

### 3.1. Login Flow (`/`)
*   **Content**: A splash page allowing the user to select a demo persona (Guest, Receptionist, Manager, etc.) or manually enter email/password.
*   **Flow**: Authenticates the user and sets the global `actor`. Redirects to the appropriate dashboard based on their role.

### 3.2. Global Layout
*   **Sidebar Navigation**: Links to Dashboard, Reservations, Rooms, People, Amenities, Billing, Operations, Administration. (Visibility filtered by Role Permissions).
*   **Top Bar**: Shows current user context, notifications dropdown, and a logout button.

### 3.3. Dashboard (`Dashboard.tsx` & `StaffDashboard.tsx`)
*   **Management**: Key metrics (Occupancy %, Revenue, Available rooms, Arrivals/Departures). Charts for revenue trends.
*   **Staff**: A simplified view showing "My Tasks" for the day (e.g., Housekeeper sees rooms to clean).
*   **Guest**: Welcome message, quick links to "Request Service", "View Folio", or "Contact Reception".

### 3.4. Reservations (`Reservations.tsx`)
*   **List View**: Data table of all bookings. Filters by status (Active, Upcoming, Completed).
*   **Actions**:
    *   **New Booking**: Modal form selecting guest, dates, room type.
    *   **Check-in / Check-out**: State transitions that automatically create cleaning tasks or update loyalty points.
    *   **Edit Stay**: Form to change dates, room, or add a discount.
*   **Guest View**: Guests only see their own stays. They can request modifications or cancellations (which creates a `ChangeRequest` for management to approve).

### 3.5. Room Management (`RoomManagement.tsx`)
*   **List View**: Grid or table of all rooms. Shows real-time status (Dirty, Ready, Maintenance).
*   **Actions**:
    *   **Set Status**: Mark a room as "Out of Service" or "Maintenance".
    *   **Assign Task**: Quickly create a cleaning or repair task for a specific room.

### 3.6. People & Support (`People.tsx`)
*   **Guest Directory (Management/Reception)**: List of all guests, their loyalty tiers, and stay history.
*   **Staff Directory (Management)**: List of staff, their shifts, and performance metrics (tasks completed).
*   **Help & Requests (Support)**:
    *   **Guest Side**: Form to submit a request. Category dropdown includes: `Request`, `Complaint`, `Maintenance`, `Food & Beverage`, `Housekeeping`, `Property care`, `Inspections`, `Lost & found`, `Receptionist`, `Cashier`, `Gardener`, `Spa`.
    *   **Staff Side**: Kanban or table view to manage open tickets, assign to staff, and reply to guests.
*   **Loyalty**: Guests can view their points balance and redeem them for folio credits.
*   **Reviews & Feedback**: Guests can leave a review after checking out (5-star ratings for Resort, Room, Service + Text description). Guests can also *Edit* their existing reviews.

### 3.7. Amenities & Services (`Amenities.tsx`)
*   **Service Menu**: Guests can browse services (Spa, Dining, Laundry) and book them for a specific date/time.
*   **Management**: Staff can update the status of these service requests (Requested -> In Progress -> Completed). Completed services are added to the guest's billing folio.

### 3.8. Billing (`Billing.tsx`)
*   **Guest Folio**: A detailed invoice view for a reservation. Shows Room Charges + Services - Discounts + Taxes.
*   **Payments**: Form to record a payment (Card, Cash, UPI) or process a refund.
*   **Expenses (Owner/Management)**: Track resort operational expenses.

### 3.9. Operations (`Operations.tsx`)
*   **Task Management**: A centralized view of all `Tasks`. Filterable by department. Staff can mark tasks as "In progress", "Inspection" (requires manager approval), or "Completed".
*   **Lost & Found**: Log items found in rooms, update status when returned to guest.

### 3.10. Administration (`Administration.tsx`)
*   **Policies**: Owner settings for Tax rate, check-in/out times, cancellation windows.
*   **Promotions**: Create discount codes for bookings.
*   **Permissions**: Matrix to toggle which staff roles can access which pages/features.

## 4. Key UI Components & Interactions (To be themed)
When applying the new theme, ensure these core components are styled and interactive:
*   **DataTables**: Sortable, searchable tables for listings.
*   **Modals / Dialogs (`FormModal`)**: Used heavily for creating/editing entities. Must support forms with text, selects, textareas, and the custom `rating` (star) input.
*   **Badges**: Status indicators (e.g., Green for "Ready", Red for "Dirty", Yellow for "Pending").
*   **Tabs**: For switching between views (e.g., All vs Open requests).
*   **Cards**: Container elements for dashboard widgets and forms.

## 5. Summary of Flow
1. **Authentication** dictates what is visible in the **Sidebar**.
2. **Lists (DataTables)** display data from the global state.
3. **Actions (Buttons in lists)** open **Modals**.
4. **Forms (Inside Modals)** capture user input.
5. **Submission** triggers a state mutation (`act({ type: 'entity.action', payload })`), which updates the state and re-renders the UI with a success toast notification.
