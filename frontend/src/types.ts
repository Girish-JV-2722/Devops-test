export interface ParkingSpot {
  id: number;
  spotNumber: string;
  level: string;
  type: string;
  isOccupied: boolean;
  hourlyRate: number;
  occupiedSince: string | null;
  vehiclePlate: string | null;
}

export interface ParkingTicket {
  id: number;
  ticketNumber: string;
  vehiclePlate: string;
  spotNumber: string;
  entryTime: string;
  exitTime: string | null;
  totalAmount: number | null;
  isPaid: boolean;
  paymentMethod: string | null;
}

export interface DashboardStats {
  totalSpots: number;
  occupiedSpots: number;
  availableSpots: number;
  todayRevenue: number;
  todayVehicles: number;
}

export type PaymentMethod = 'Cash' | 'CreditCard' | 'DebitCard' | 'Mobile';

