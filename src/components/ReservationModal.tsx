import React, { useState, useEffect } from 'react';
import { X, Sparkles, Store } from 'lucide-react';
import confetti from 'canvas-confetti';
import { reservationService } from '../services/reservationService';
import { SeatingType, Reservation, RestaurantTable } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { TableSelector } from './TableSelector';
import { useAuth } from '../context/AuthContext';
import { useRestaurantStatus } from '../hooks/useRestaurantStatus';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const restaurantStatus = useRestaurantStatus();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('10:30 PM');
  const [guests, setGuests] = useState(2);
  const [seatingPreference, setSeatingPreference] = useState<SeatingType>('cozy-booth');
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [specialRequest, setSpecialRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.name);
      if (!phone) setPhone(currentUser.phone);
      if (!email) setEmail(currentUser.email);
    }
  }, [currentUser]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await reservationService.createReservation({
        userId: currentUser?.id,
        name,
        phone,
        email,
        date,
        time,
        guests,
        seatingPreference: selectedTable ? selectedTable.type : seatingPreference,
        tableId: selectedTable?.id,
        specialRequest
      });

      setConfirmedReservation(res);
      setIsSubmitting(false);

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFDAC1', '#B2A4FF', '#E98316', '#7CAFD1']
        });
      } catch {
        // ignore
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  const lateNightTimes = [
    '7:00 PM', '8:15 PM', '9:30 PM', '10:30 PM',
    '11:45 PM', '12:45 AM', '1:45 AM', '2:45 AM'
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[var(--text-primary)]/65 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-2xl bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {confirmedReservation ? (
          /* Confirmation View */
          <div className="p-8 sm:p-10 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-[#E98316]/20 text-[#E98316] mx-auto flex items-center justify-center border border-[#E98316]/40">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#E98316] font-semibold">
                Table Reservation Confirmed
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)]">
                Your bowl is waiting.
              </h3>
              <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto font-light">
                We have prepared a sanctuary table for you. When midnight arrives, simply give your reservation code at the lantern entrance.
              </p>
            </div>

            {/* Ticket Summary */}
            <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-left space-y-3 font-mono text-xs shadow-xs">
              <div className="flex justify-between border-b border-[var(--border-subtle)]/60 pb-2">
                <span className="text-[var(--text-muted)]">RESERVATION ID</span>
                <span className="font-bold text-[var(--text-primary)] text-sm">{confirmedReservation.id}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-subtle)]/60 pb-2">
                <span className="text-[var(--text-muted)]">GUEST NAME</span>
                <span className="text-[var(--text-primary)]">{confirmedReservation.name}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-subtle)]/60 pb-2">
                <span className="text-[var(--text-muted)]">DATE & TIME</span>
                <span className="text-[var(--text-primary)]">{confirmedReservation.date} at {confirmedReservation.time}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-subtle)]/60 pb-2">
                <span className="text-[var(--text-muted)]">TABLE & SEATS</span>
                <span className="text-[var(--text-primary)] font-semibold">
                  {confirmedReservation.tableName} · {confirmedReservation.guests} {confirmedReservation.guests === 1 ? 'Guest' : 'Guests'}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[var(--text-muted)]">LOCATION</span>
                <span className="text-[var(--text-primary)]">{RESTAURANT_INFO.location.address}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setConfirmedReservation(null);
                  onClose();
                }}
                type="button"
                className="w-full py-3.5 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-all duration-300"
              >
                Close & Return to Retreat
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form with Table Selector */
          <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden text-left">
            <div className="p-6 sm:p-8 border-b border-[var(--border-subtle)]/60 bg-[var(--bg-secondary)]/50">
              <span className="text-[10px] uppercase tracking-widest text-[#E98316] font-semibold block">
                Intimate Late-Night Sanctuary
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-normal mt-0.5">
                Book Your Bowl
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-light">
                Select your party size, date, time slot, and preferred table from our floor plan.
              </p>
            </div>

            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              
              {/* Date & Guests & Time Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  >
                    {lateNightTimes.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                    Guests *
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  >
                    {[1, 2, 3, 4, 5, 6, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest (Solitary Slurp)' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Visual Table Floor Plan Selector */}
              <TableSelector
                date={date}
                time={time}
                guests={guests}
                selectedTableId={selectedTable?.id || null}
                onSelectTable={(table) => {
                  setSelectedTable(table);
                  setSeatingPreference(table.type);
                }}
              />

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ren"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nightretreat.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                  Special Quiet Notes (Optional)
                </label>
                <input
                  type="text"
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="Anniversary table, corner seating, dietary notes..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[#E98316]"
                />
              </div>

              {/* Closed Kitchen Warning */}
              {!restaurantStatus.isOpen && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-3">
                  <Store className="w-5 h-5 shrink-0 text-amber-500" />
                  <div>
                    <p className="font-semibold text-xs">The kitchen is resting. Come back after dark.</p>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Online table reservations are paused while the restaurant is closed. Doors open at 7:00 PM.</p>
                  </div>
                </div>
              )}

            </div>

            {/* Footer Submit */}
            <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/50 border-t border-[var(--border-subtle)]">
              <button
                type="submit"
                disabled={isSubmitting || !restaurantStatus.isOpen}
                className="w-full py-4 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E98316]" />
                <span>
                  {isSubmitting 
                    ? 'Reserving Table...' 
                    : !restaurantStatus.isOpen
                      ? 'Kitchen Resting (Closed)'
                      : selectedTable 
                        ? `Confirm Reservation at ${selectedTable.name}` 
                        : 'Confirm Table Reservation'}
                </span>
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
