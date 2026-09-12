import React, { useState, useEffect } from 'react';
import { Sparkles, BookmarkCheck, Store } from 'lucide-react';
import confetti from 'canvas-confetti';
import { reservationService } from '../services/reservationService';
import { SeatingType, Reservation, RestaurantTable } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { TableSelector } from '../components/TableSelector';
import { useAuth } from '../context/AuthContext';
import { useRestaurantStatus } from '../hooks/useRestaurantStatus';

export const ReservationSection: React.FC = () => {
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
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.name);
      if (!phone) setPhone(currentUser.phone);
      if (!email) setEmail(currentUser.email);
    }
  }, [currentUser]);

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
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
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

  const existingReservations = reservationService.getReservations(currentUser?.id);

  return (
    <section id="reservation" className="py-20 md:py-32 relative bg-[var(--bg-primary)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--text-muted)]">
            TABLE SANCTUARY
          </div>
          
          <h2 className="font-serif text-4xl sm:text-6xl text-[var(--text-primary)] font-normal tracking-tight">
            Book Your Bowl
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light">
            Reserve an intimate table for the midnight hours. View real-time floor availability and choose your preferred nook.
          </p>
        </div>

        {/* Confirmation State or Booking Form */}
        <div className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl overflow-hidden p-6 sm:p-12 relative">
          
          {confirmedReservation ? (
            /* Confirmation Screen */
            <div className="text-center space-y-6 animate-in zoom-in-95 duration-500 py-4">
              <div className="w-16 h-16 rounded-full bg-[#E98316]/20 text-[#E98316] mx-auto flex items-center justify-center border border-[#E98316]/40 shadow-sm">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#E98316] font-semibold">
                  Reservation Confirmed
                </span>
                <h3 className="font-serif text-3xl sm:text-5xl text-[var(--text-primary)]">
                  Your bowl is waiting.
                </h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto font-light">
                  We look forward to welcoming you into the warmth. Simply mention your reservation ID or name when entering Midnight Alley.
                </p>
              </div>

              {/* Ticket Card */}
              <div className="max-w-md mx-auto p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-left space-y-3 font-mono text-xs shadow-xs">
                <div className="flex justify-between border-b border-[var(--border-subtle)]/60 pb-2">
                  <span className="text-[var(--text-muted)]">RESERVATION ID</span>
                  <span className="font-bold text-[var(--text-primary)] text-sm">{confirmedReservation.id}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--border-subtle)]/60 pb-2">
                  <span className="text-[var(--text-muted)]">GUEST</span>
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

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => setConfirmedReservation(null)}
                  type="button"
                  className="px-6 py-3 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-all"
                >
                  Make Another Reservation
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form with Table Availability */
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              
              {/* Date & Time & Guests Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1.5">
                    Time Slot *
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  >
                    {lateNightTimes.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1.5">
                    Number of Guests *
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  >
                    {[1, 2, 3, 4, 5, 6, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest (Quiet Solitude)' : 'Guests'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mia Hawthorne"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 234-5678"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mia@midnightretreat.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1.5">
                  Special Quiet Request (Optional)
                </label>
                <input
                  type="text"
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="Corner table, celebrating late birthday, quiet writing table..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[#E98316]"
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

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !restaurantStatus.isOpen}
                  className="w-full py-4 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-medium hover:opacity-90 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E98316]" />
                  <span>
                    {isSubmitting 
                      ? 'Reserving Table...' 
                      : !restaurantStatus.isOpen
                        ? 'Kitchen Resting (Closed)'
                        : selectedTable 
                          ? `Confirm Reservation at ${selectedTable.name}` 
                          : 'Reserve Your Table · Book Your Bowl'}
                  </span>
                </button>
              </div>

            </form>
          )}

          {/* Stored reservations indicator if user has any */}
          {existingReservations.length > 0 && !confirmedReservation && (
            <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]/60 text-xs text-[var(--text-muted)] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-[#E98316]" />
                You have {existingReservations.length} saved booking in this browser.
              </span>
              <span className="font-mono text-[var(--text-primary)]">
                Latest: {existingReservations[0].id}
              </span>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
