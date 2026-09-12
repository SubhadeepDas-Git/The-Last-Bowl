import React, { useState, useEffect } from 'react';
import { 
  X, ShieldAlert, Store, Clock, Package, Calendar, 
  ChevronRight, RefreshCw, CheckCircle2, Ban
} from 'lucide-react';
import { restaurantService, RestaurantState } from '../services/restaurantService';
import { orderService } from '../services/orderService';
import { reservationService } from '../services/reservationService';
import { Order, Reservation, RestaurantTable, DeliveryStage } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STAGES: DeliveryStage[] = [
  'ORDER_PLACED',
  'ORDER_CONFIRMED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED'
];

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'restaurant' | 'orders' | 'reservations' | 'tables'>('restaurant');
  const [restaurantState, setRestaurantState] = useState<RestaurantState>(() => restaurantService.getState());
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [orderFilter, setOrderFilter] = useState<string>('all');

  // Load data whenever modal opens or tab changes
  useEffect(() => {
    if (isOpen) {
      setRestaurantState(restaurantService.getState());
      setOrders(orderService.getAllOrders());
      setReservations(reservationService.getAllReservations());
      setTables(reservationService.getTables());
    }
  }, [isOpen, activeTab]);

  // ESC key dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleStatus = (open: boolean) => {
    restaurantService.setOpen(open);
    setRestaurantState(restaurantService.getState());
  };

  const handleResetToAuto = () => {
    restaurantService.resetToAuto();
    setRestaurantState(restaurantService.getState());
  };

  const handleAdvanceStage = (orderId: string, currentStage: DeliveryStage) => {
    const nextIdx = STAGES.indexOf(currentStage) + 1;
    if (nextIdx < STAGES.length) {
      const nextStage = STAGES[nextIdx];
      orderService.updateOrderStage(orderId, nextStage);
      setOrders(orderService.getAllOrders());
    }
  };

  const handleCancelReservation = async (resId: string) => {
    if (window.confirm('Are you sure you want to cancel this reservation as Admin?')) {
      await reservationService.cancelReservation(resId);
      setReservations(reservationService.getAllReservations());
      setTables(reservationService.getTables());
    }
  };

  const filteredOrders = orderFilter === 'all' 
    ? orders 
    : orders.filter(o => o.deliveryStage === orderFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div 
        role="dialog"
        aria-label="Admin Management Console"
        className="relative w-full max-w-4xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--border-subtle)]/70 bg-[var(--bg-secondary)]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] font-medium">
                  Kitchen Admin Console
                </h2>
                <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  Staff Only
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Central restaurant controls for operations, orders, reservations, and tables.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Close admin modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[var(--border-subtle)]/60 bg-[var(--bg-secondary)]/20 px-6 gap-2 sm:gap-4 overflow-x-auto text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('restaurant')}
            type="button"
            className={`py-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'restaurant'
                ? 'border-[var(--text-primary)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Restaurant Status</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            type="button"
            className={`py-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[var(--text-primary)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Live Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            type="button"
            className={`py-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'reservations'
                ? 'border-[var(--text-primary)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Reservations ({reservations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            type="button"
            className={`py-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tables'
                ? 'border-[var(--text-primary)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Floor Tables ({tables.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: RESTAURANT STATUS */}
          {activeTab === 'restaurant' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-3.5 h-3.5 rounded-full ${restaurantState.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    <div>
                      <h3 className="font-serif text-lg text-[var(--text-primary)] font-medium">
                        Current Status: {restaurantState.isOpen ? 'OPEN (Welcoming Orders & Guests)' : 'CLOSED (Kitchen Resting)'}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Mode: <strong className="uppercase font-semibold">{restaurantState.mode}</strong> · Last updated: {new Date(restaurantState.lastUpdated).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(true)}
                      type="button"
                      disabled={restaurantState.isOpen && restaurantState.mode === 'manual'}
                      className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        restaurantState.isOpen && restaurantState.mode === 'manual'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      Force Open
                    </button>

                    <button
                      onClick={() => handleToggleStatus(false)}
                      type="button"
                      disabled={!restaurantState.isOpen && restaurantState.mode === 'manual'}
                      className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        !restaurantState.isOpen && restaurantState.mode === 'manual'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      Force Close
                    </button>

                    <button
                      onClick={handleResetToAuto}
                      type="button"
                      title="Reset to regular 7:00 PM – 4:00 AM operating schedule"
                      className="px-3 py-2 rounded-full text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Auto Schedule</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)]/50 p-3.5 rounded-xl border border-[var(--border-subtle)]/50">
                  <strong>Notice when CLOSED:</strong> Guests and customers can still browse the full menu, story, and restaurant atmosphere, but checkout and new online table reservations are paused with the message: <em>"The kitchen is resting. Come back after dark."</em>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h3 className="font-serif text-base text-[var(--text-primary)]">
                  All Kitchen Orders ({filteredOrders.length})
                </h3>

                {/* Stage Filters */}
                <div className="flex items-center gap-1.5 flex-wrap text-xs">
                  {['all', ...STAGES].map(stg => (
                    <button
                      key={stg}
                      onClick={() => setOrderFilter(stg)}
                      type="button"
                      className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider transition-colors cursor-pointer ${
                        orderFilter === stg
                          ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      {stg.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-secondary)] bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)]">
                  No orders found matching this filter.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map(order => {
                    const currentIdx = STAGES.indexOf(order.deliveryStage);
                    const canAdvance = currentIdx < STAGES.length - 1;
                    const nextStage = canAdvance ? STAGES[currentIdx + 1] : null;

                    return (
                      <div 
                        key={order.id}
                        className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                              {order.id}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              {order.deliveryStage.replace(/_/g, ' ')}
                            </span>
                            <span className="text-[11px] text-[var(--text-muted)]">
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="text-xs text-[var(--text-secondary)]">
                            Customer: <strong>{order.customerName}</strong> ({order.customerPhone}) · {order.orderType} · ${order.total.toFixed(2)}
                          </div>

                          <div className="text-[11px] text-[var(--text-muted)] truncate max-w-lg">
                            Items: {order.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                          </div>
                        </div>

                        {/* Admin Action: Advance Stage */}
                        <div>
                          {canAdvance && nextStage ? (
                            <button
                              onClick={() => handleAdvanceStage(order.id, order.deliveryStage)}
                              type="button"
                              className="px-3 py-1.5 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)] text-xs font-medium uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                            >
                              <span>Advance to: {nextStage.replace(/_/g, ' ')}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Delivered
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RESERVATIONS */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              <h3 className="font-serif text-base text-[var(--text-primary)]">
                All Table Bookings ({reservations.length})
              </h3>

              {reservations.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-secondary)] bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)]">
                  No reservations currently logged in system.
                </div>
              ) : (
                <div className="space-y-3">
                  {reservations.map(res => (
                    <div 
                      key={res.id}
                      className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                            {res.id}
                          </span>
                          <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                            res.status === 'upcoming' 
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                          }`}>
                            {res.status}
                          </span>
                          <span className="text-xs text-[var(--text-primary)] font-medium">
                            {res.date} at {res.time}
                          </span>
                        </div>

                        <div className="text-xs text-[var(--text-secondary)]">
                          Guest: <strong>{res.name}</strong> ({res.phone}) · {res.guests} Guests · Table: <strong>{res.tableName || res.tableId}</strong>
                        </div>

                        {res.specialRequest && (
                          <div className="text-[11px] text-[var(--text-muted)] italic">
                            Note: "{res.specialRequest}"
                          </div>
                        )}
                      </div>

                      {res.status === 'upcoming' && (
                        <button
                          onClick={() => handleCancelReservation(res.id)}
                          type="button"
                          className="px-3 py-1.5 rounded-full border border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap self-start sm:self-center"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cancel Booking</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FLOOR TABLES */}
          {activeTab === 'tables' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base text-[var(--text-primary)]">
                  Dining Room Tables ({tables.length})
                </h3>
                <span className="text-xs text-[var(--text-muted)]">
                  Automatic availability checks based on guest count & conflicting bookings
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tables.map(table => (
                  <div 
                    key={table.id}
                    className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-semibold text-[var(--text-primary)]">
                        {table.name}
                      </span>
                      <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                        table.status === 'available'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {table.status}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      Capacity: {table.capacity} guests · Zone: {table.type.replace(/-/g, ' ')}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {table.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border-subtle)]/60 bg-[var(--bg-secondary)]/30 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close Admin Console
          </button>
        </div>

      </div>
    </div>
  );
};
