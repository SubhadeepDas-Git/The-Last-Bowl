import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle2, Clock, MapPin, Truck, ChevronRight, Play, AlertCircle, ShoppingBag } from 'lucide-react';
import { Order } from '../types';
import { deliveryService } from '../services/deliveryService';
import { orderService } from '../services/orderService';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface DeliveryTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string | null;
}

export const DeliveryTrackerModal: React.FC<DeliveryTrackerModalProps> = ({
  isOpen,
  onClose,
  initialOrderId
}) => {
  const [searchId, setSearchId] = useState('');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [notFoundError, setNotFoundError] = useState(false);
  const [simulationActive, setSimulationActive] = useState(false);

  useEffect(() => {
    if (initialOrderId) {
      setSearchId(initialOrderId);
      const found = deliveryService.getOrderTracking(initialOrderId);
      setCurrentOrder(found);
      setNotFoundError(!found);
    } else {
      // Find latest active order
      const allOrders = orderService.getOrders();
      const active = allOrders.find(o => o.status === 'active') || allOrders[0] || null;
      setCurrentOrder(active);
      if (active) setSearchId(active.id);
    }
  }, [initialOrderId, isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Simulated live progression
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (simulationActive && currentOrder && currentOrder.deliveryStage !== 'DELIVERED') {
      timer = setTimeout(() => {
        const advanced = deliveryService.advanceStage(currentOrder.id);
        if (advanced) {
          setCurrentOrder({ ...advanced });
          if (advanced.deliveryStage === 'DELIVERED') {
            setSimulationActive(false);
          }
        }
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [simulationActive, currentOrder]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const found = deliveryService.getOrderTracking(searchId.trim());
    if (found) {
      setCurrentOrder(found);
      setNotFoundError(false);
    } else {
      setNotFoundError(true);
    }
  };

  const handleManualAdvance = () => {
    if (!currentOrder) return;
    const advanced = deliveryService.advanceStage(currentOrder.id);
    if (advanced) {
      setCurrentOrder({ ...advanced });
    }
  };

  const progressPercent = currentOrder ? deliveryService.getStageProgressPercent(currentOrder.deliveryStage) : 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[var(--text-primary)]/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-2xl bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-[var(--border-subtle)]/60 bg-[var(--bg-secondary)]/50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-[#E98316]">
              <Truck className="w-3.5 h-3.5" />
              <span>Live-Style Journey Tracker</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-medium mt-1">
              Track Your Bowl
            </h3>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-full bg-[var(--bg-card)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Order Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Order ID (e.g. TLB-ORD-9281)"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-[#E98316]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-all shrink-0"
            >
              Search
            </button>
          </form>

          {notFoundError && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-300/40 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#E98316]" />
              <span>We couldn't find that bowl journey. Please verify your Order ID or check your Order History in Profile.</span>
            </div>
          )}

          {currentOrder ? (
            <div className="space-y-6">
              
              {/* Status Header Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--text-muted)]">
                    {currentOrder.orderType} · ID: {currentOrder.id}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] font-medium mt-0.5">
                    {currentOrder.deliveryStage === 'DELIVERED' 
                      ? 'Delivered with Warmth' 
                      : currentOrder.deliveryStage === 'OUT_FOR_DELIVERY'
                        ? 'Courier on Midnight Alley'
                        : 'Preparing Your Hot Bowl'}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-1">
                    <Clock className="w-3.5 h-3.5 text-[#E98316]" />
                    <span>Estimated: <strong className="text-[var(--text-primary)]">{currentOrder.estimatedDeliveryTime}</strong></span>
                  </div>
                </div>

                {/* Simulation Control */}
                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  <button
                    onClick={handleManualAdvance}
                    disabled={currentOrder.deliveryStage === 'DELIVERED'}
                    type="button"
                    title="Simulate next stage progression"
                    className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--border-subtle)] text-[11px] font-medium text-[var(--text-primary)] transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                  >
                    <ChevronRight className="w-3 h-3 text-[#E98316]" />
                    <span>Next Stage</span>
                  </button>

                  <button
                    onClick={() => setSimulationActive(prev => !prev)}
                    type="button"
                    title="Auto-advance stages every 5s"
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 ${
                      simulationActive
                        ? 'bg-[#E98316] text-white shadow-xs'
                        : 'border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Play className="w-3 h-3" />
                    <span>{simulationActive ? 'Live Auto' : 'Auto Sim'}</span>
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium">
                  <span>Journey Progress</span>
                  <span>{progressPercent}% Complete</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--bg-secondary)] overflow-hidden border border-[var(--border-subtle)]/50">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FFDAC1] via-[#E98316] to-[#B2A4FF] transition-all duration-700 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* 6-Stage Timeline */}
              <div className="space-y-4 pt-2">
                <div className="text-xs uppercase tracking-widest font-semibold text-[var(--text-muted)]">
                  Live Stage Timeline
                </div>

                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-subtle)]">
                  {currentOrder.timeline.map((evt, idx) => (
                    <div key={evt.stage} className="relative flex items-start gap-4">
                      
                      {/* Node Bullet */}
                      <div 
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                          evt.isCurrent
                            ? 'bg-[#E98316] text-white border-[#E98316] ring-4 ring-[#E98316]/20 animate-pulse'
                            : evt.isCompleted
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-subtle)]'
                        }`}
                      >
                        {evt.isCompleted ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-subtle)]/60">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${evt.isCurrent ? 'text-[#E98316]' : 'text-[var(--text-primary)]'}`}>
                            {evt.title}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">
                            {evt.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed font-light">
                          {evt.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items & Address Summary */}
              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3 text-xs">
                <div className="flex justify-between items-start border-b border-[var(--border-subtle)]/60 pb-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] block">
                      Destination
                    </span>
                    <span className="font-medium text-[var(--text-primary)] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#E98316]" />
                      {currentOrder.orderType === 'DELIVERY' && currentOrder.deliveryAddress
                        ? `${currentOrder.deliveryAddress.houseFlat}, ${currentOrder.deliveryAddress.street}, ${currentOrder.deliveryAddress.area}`
                        : `${RESTAURANT_INFO.location.address} (Counter Pickup)`}
                    </span>
                  </div>
                  <span className="font-serif font-bold text-sm text-[var(--text-primary)]">
                    ${currentOrder.total.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                  <span>{currentOrder.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span>
                  <span className="text-[#E98316] font-medium">{currentOrder.items.length} items</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <ShoppingBag className="w-10 h-10 mx-auto text-[var(--text-muted)] opacity-50" />
              <h4 className="font-serif text-lg text-[var(--text-primary)]">No active order loaded</h4>
              <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
                Place an order or enter an Order ID above to see live-style bowl craft and delivery progression.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
