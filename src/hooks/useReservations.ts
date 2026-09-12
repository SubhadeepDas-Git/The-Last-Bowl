import { useState, useEffect, useCallback } from 'react';
import { Reservation, SeatingType } from '../types';

const RESERVATION_STORAGE_KEY = 'tlb_reservations_v2';

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(RESERVATION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(RESERVATION_STORAGE_KEY, JSON.stringify(reservations));
    } catch (e) {
      console.error('Failed to save reservations', e);
    }
  }, [reservations]);

  const createReservation = useCallback((data: {
    name: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    guests: number;
    seatingPreference: SeatingType;
    specialRequest?: string;
  }): Reservation => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newRes: Reservation = {
      id: `TLB-2026-${randomCode}`,
      ...data,
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };

    setReservations(prev => [newRes, ...prev]);
    return newRes;
  }, []);

  return {
    reservations,
    createReservation
  };
}
