import { Reservation, RestaurantTable, SeatingType } from '../types';

const RESERVATION_STORAGE_KEY = 'tlb_reservations_v2';

export const RESTAURANT_TABLES: RestaurantTable[] = [
  // Counter Bar (1-2 guests)
  { id: 'tbl_c1', name: 'Bar Stool 01', type: 'counter-bar', capacity: 1, description: 'Front-row broth steam view', position: { x: 20, y: 30 }, status: 'available' },
  { id: 'tbl_c2', name: 'Bar Stool 02', type: 'counter-bar', capacity: 1, description: 'Front-row broth steam view', position: { x: 30, y: 30 }, status: 'available' },
  { id: 'tbl_c3', name: 'Bar Stool 03', type: 'counter-bar', capacity: 1, description: 'Chef interaction seat', position: { x: 40, y: 30 }, status: 'available' },
  { id: 'tbl_c4', name: 'Bar Stool 04', type: 'counter-bar', capacity: 2, description: 'Corner of the cedar bar', position: { x: 50, y: 30 }, status: 'available' },

  // Cozy Booths (2-4 guests)
  { id: 'tbl_b1', name: 'Pine Booth B1', type: 'cozy-booth', capacity: 4, description: 'Low lantern glow & partitions', position: { x: 20, y: 65 }, status: 'available' },
  { id: 'tbl_b2', name: 'Pine Booth B2', type: 'cozy-booth', capacity: 4, description: 'Private alcove for quiet meals', position: { x: 40, y: 65 }, status: 'available' },
  { id: 'tbl_b3', name: 'Pine Booth B3', type: 'cozy-booth', capacity: 4, description: 'Deep corner booth', position: { x: 60, y: 65 }, status: 'available' },

  // Window Nooks (2-3 guests)
  { id: 'tbl_w1', name: 'Window Nook W1', type: 'window-nook', capacity: 3, description: 'Overlooking Neon Alley rain reflections', position: { x: 75, y: 30 }, status: 'available' },
  { id: 'tbl_w2', name: 'Window Nook W2', type: 'window-nook', capacity: 3, description: 'Overlooking Lantern Way cobblestones', position: { x: 88, y: 30 }, status: 'available' },

  // Tatami Corner (4-8 guests)
  { id: 'tbl_t1', name: 'Tatami Mat T1', type: 'tatami-corner', capacity: 6, description: 'Shoe-off low table with silk cushions', position: { x: 80, y: 70 }, status: 'available' },
  { id: 'tbl_t2', name: 'Tatami Mat T2', type: 'tatami-corner', capacity: 8, description: 'Large communal gathering mat', position: { x: 88, y: 80 }, status: 'available' },
];

const SEED_RESERVATIONS: Reservation[] = [
  {
    id: 'TLB-2026-7821',
    userId: 'usr_demo_midnight',
    name: 'Ren Takahashi',
    phone: '+1 (555) 839-2695',
    email: 'wanderer@thelastbowl.com',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '11:45 PM',
    guests: 2,
    seatingPreference: 'cozy-booth',
    tableId: 'tbl_b2',
    tableName: 'Pine Booth B2',
    status: 'upcoming',
    specialRequest: 'Corner seat if possible, anniversary late dinner',
    createdAt: '2026-09-10T20:15:00.000Z'
  },
  {
    id: 'TLB-2026-4190',
    userId: 'usr_demo_midnight',
    name: 'Ren Takahashi',
    phone: '+1 (555) 839-2695',
    email: 'wanderer@thelastbowl.com',
    date: '2026-08-28',
    time: '1:00 AM',
    guests: 1,
    seatingPreference: 'counter-bar',
    tableId: 'tbl_c2',
    tableName: 'Bar Stool 02',
    status: 'completed',
    createdAt: '2026-08-28T00:30:00.000Z'
  }
];

class ReservationService {
  public getAllReservations(): Reservation[] {
    try {
      const saved = localStorage.getItem(RESERVATION_STORAGE_KEY);
      let list: Reservation[] = saved ? JSON.parse(saved) : [];
      if (list.length === 0) {
        list = SEED_RESERVATIONS;
        localStorage.setItem(RESERVATION_STORAGE_KEY, JSON.stringify(list));
      }
      return list;
    } catch {
      return SEED_RESERVATIONS;
    }
  }

  public getReservations(userId?: string): Reservation[] {
    const list = this.getAllReservations();
    if (userId) {
      return list.filter(r => r.userId === userId);
    }
    return list;
  }

  private saveReservations(reservations: Reservation[]): void {
    try {
      localStorage.setItem(RESERVATION_STORAGE_KEY, JSON.stringify(reservations));
    } catch (e) {
      console.error('Failed to save reservations', e);
    }
  }

  public getTables(date?: string, time?: string, guests?: number): RestaurantTable[] {
    const reservations = this.getAllReservations();
    
    return RESTAURANT_TABLES.map(table => {
      // Deterministic: table is occupied/unavailable if capacity is less than requested party size
      if (guests && table.capacity < guests) {
        return { ...table, status: 'occupied' };
      }

      // Deterministic: table is reserved if there is an existing upcoming reservation for the specified date & time
      if (date && time) {
        const isReserved = reservations.some(
          r => r.date === date && r.time === time && r.tableId === table.id && r.status === 'upcoming'
        );
        if (isReserved) {
          return { ...table, status: 'reserved' };
        }
      }

      return { ...table, status: 'available' };
    });
  }

  public createReservation(data: {
    userId?: string;
    name: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    guests: number;
    seatingPreference: SeatingType;
    tableId?: string;
    specialRequest?: string;
  }): Promise<Reservation> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const allReservations = this.getAllReservations();

        // Deterministic collision check: ensure table is not already booked for date & time
        if (data.tableId && data.date && data.time) {
          const conflict = allReservations.some(
            r => r.date === data.date && r.time === data.time && r.tableId === data.tableId && r.status === 'upcoming'
          );
          if (conflict) {
            reject(new Error('This specific table was just reserved for this time slot. Please choose another available table.'));
            return;
          }
        }

        const randomCode = Math.floor(1000 + Math.random() * 9000);
        
        let assignedTable = RESTAURANT_TABLES.find(t => t.id === data.tableId);
        if (!assignedTable) {
          // Auto-assign first table matching seating preference that is not booked
          assignedTable = RESTAURANT_TABLES.find(t => {
            if (t.type !== data.seatingPreference) return false;
            const conflict = allReservations.some(
              r => r.date === data.date && r.time === data.time && r.tableId === t.id && r.status === 'upcoming'
            );
            return !conflict;
          }) || RESTAURANT_TABLES[0];
        }

        const newReservation: Reservation = {
          id: `TLB-2026-${randomCode}`,
          userId: data.userId,
          name: data.name.trim(),
          phone: data.phone.trim(),
          email: data.email.trim(),
          date: data.date,
          time: data.time,
          guests: data.guests,
          seatingPreference: data.seatingPreference,
          tableId: assignedTable.id,
          tableName: assignedTable.name,
          status: 'upcoming',
          specialRequest: data.specialRequest?.trim(),
          createdAt: new Date().toISOString()
        };

        allReservations.unshift(newReservation);
        this.saveReservations(allReservations);
        resolve(newReservation);
      }, 400);
    });
  }

  public cancelReservation(reservationId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const all = this.getReservations();
      const target = all.find(r => r.id === reservationId);
      if (!target) {
        reject(new Error('Reservation not found'));
        return;
      }

      target.status = 'cancelled';
      this.saveReservations(all);
      resolve(true);
    });
  }
}

export const reservationService = new ReservationService();
