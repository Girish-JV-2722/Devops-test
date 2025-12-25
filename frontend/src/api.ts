import axios from 'axios';
import { ParkingSpot, ParkingTicket, DashboardStats, PaymentMethod } from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE}/api/parking`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const parkingApi = {
  // Dashboard
  getDashboard: async (): Promise<DashboardStats> => {
    const { data } = await api.get('/dashboard');
    return data;
  },

  // Spots
  getAllSpots: async (): Promise<ParkingSpot[]> => {
    const { data } = await api.get('/spots');
    return data;
  },

  getAvailableSpots: async (): Promise<ParkingSpot[]> => {
    const { data } = await api.get('/spots/available');
    return data;
  },

  // Parking operations
  parkVehicle: async (vehiclePlate: string, spotId: number): Promise<ParkingTicket> => {
    const { data } = await api.post('/park', { vehiclePlate, spotId });
    return data;
  },

  exitVehicle: async (ticketNumber: string, paymentMethod: PaymentMethod): Promise<ParkingTicket> => {
    const { data } = await api.post('/exit', { ticketNumber, paymentMethod });
    return data;
  },

  // Tickets
  getAllTickets: async (): Promise<ParkingTicket[]> => {
    const { data } = await api.get('/tickets');
    return data;
  },

  getActiveTickets: async (): Promise<ParkingTicket[]> => {
    const { data } = await api.get('/tickets/active');
    return data;
  },
};

