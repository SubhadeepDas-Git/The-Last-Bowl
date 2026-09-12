import React from 'react';
import { Check, Users, Utensils } from 'lucide-react';
import { RestaurantTable, TableStatus } from '../types';
import { reservationService } from '../services/reservationService';

interface TableSelectorProps {
  date: string;
  time: string;
  guests: number;
  selectedTableId: string | null;
  onSelectTable: (table: RestaurantTable) => void;
}

export const TableSelector: React.FC<TableSelectorProps> = ({
  date,
  time,
  guests,
  selectedTableId,
  onSelectTable
}) => {
  const tables = reservationService.getTables(date, time, guests);

  const getStatusColor = (status: TableStatus, isSelected: boolean) => {
    if (isSelected) {
      return 'border-[#E98316] bg-[#E98316]/15 text-[var(--text-primary)] ring-2 ring-[#E98316] shadow-md';
    }
    switch (status) {
      case 'available':
        return 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[#E98316] hover:bg-[var(--bg-secondary)] cursor-pointer';
      case 'occupied':
        return 'border-dashed border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 cursor-not-allowed opacity-60';
      case 'reserved':
        return 'border-dashed border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 cursor-not-allowed opacity-70';
      default:
        return 'border-[var(--border-subtle)] bg-[var(--bg-card)]';
    }
  };

  const getStatusBadge = (status: TableStatus, isSelected: boolean) => {
    if (isSelected) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#E98316] text-white flex items-center gap-1">
          <Check className="w-2.5 h-2.5" /> Selected
        </span>
      );
    }
    switch (status) {
      case 'available':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
            Available
          </span>
        );
      case 'occupied':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-red-500/15 text-red-600 dark:text-red-400">
            Occupied
          </span>
        );
      case 'reserved':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400">
            Reserved
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)]/60 pb-3">
        <div>
          <h4 className="text-xs uppercase tracking-widest font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Utensils className="w-3.5 h-3.5 text-[#E98316]" />
            Visual Table Floor Plan & Availability
          </h4>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            Select an available table for {guests} {guests === 1 ? 'guest' : 'guests'} at {time} on {date}.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] font-medium">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[var(--text-secondary)]">Available</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#E98316]" />
            <span className="text-[var(--text-secondary)]">Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-[var(--text-secondary)]">Occupied</span>
          </div>
        </div>
      </div>

      {/* Floor Plan Layout Grid */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-6">
        
        {/* Area 1: Counter Bar (Cedarwood counter, in front of the kitchen steam) */}
        <div>
          <div className="text-[10px] uppercase tracking-widest font-semibold text-[var(--text-muted)] mb-2 flex items-center justify-between">
            <span>Counter Bar (Facing Open Steam Kitchen)</span>
            <span className="text-[9px] text-[#E98316]">1–2 Guests</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {tables.filter(t => t.type === 'counter-bar').map(table => {
              const isSelected = selectedTableId === table.id;
              const isSelectable = table.status === 'available';
              return (
                <button
                  key={table.id}
                  type="button"
                  disabled={!isSelectable && !isSelected}
                  onClick={() => onSelectTable(table)}
                  className={`p-3 rounded-xl border text-left transition-all duration-300 ${getStatusColor(table.status, isSelected)}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xs font-semibold">{table.name}</span>
                    {getStatusBadge(table.status, isSelected)}
                  </div>
                  <div className="text-[10px] opacity-75 mt-1 flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" /> Max {table.capacity}p
                  </div>
                  <p className="text-[9px] opacity-70 line-clamp-1 mt-0.5">{table.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Area 2: Cozy Booths */}
        <div>
          <div className="text-[10px] uppercase tracking-widest font-semibold text-[var(--text-muted)] mb-2 flex items-center justify-between">
            <span>Cozy Pine Booths (Soft Lantern Glow & Wooden Partitions)</span>
            <span className="text-[9px] text-[#E98316]">2–4 Guests</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {tables.filter(t => t.type === 'cozy-booth').map(table => {
              const isSelected = selectedTableId === table.id;
              const isSelectable = table.status === 'available';
              return (
                <button
                  key={table.id}
                  type="button"
                  disabled={!isSelectable && !isSelected}
                  onClick={() => onSelectTable(table)}
                  className={`p-3 rounded-xl border text-left transition-all duration-300 ${getStatusColor(table.status, isSelected)}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xs font-semibold">{table.name}</span>
                    {getStatusBadge(table.status, isSelected)}
                  </div>
                  <div className="text-[10px] opacity-75 mt-1 flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" /> Up to {table.capacity} guests
                  </div>
                  <p className="text-[9px] opacity-70 line-clamp-1 mt-0.5">{table.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Area 3: Window Nooks & Tatami Corner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Window Nooks */}
          <div>
            <div className="text-[10px] uppercase tracking-widest font-semibold text-[var(--text-muted)] mb-2 flex items-center justify-between">
              <span>Window Nooks</span>
              <span className="text-[9px] text-[#E98316]">2–3 Guests</span>
            </div>
            <div className="space-y-2">
              {tables.filter(t => t.type === 'window-nook').map(table => {
                const isSelected = selectedTableId === table.id;
                const isSelectable = table.status === 'available';
                return (
                  <button
                    key={table.id}
                    type="button"
                    disabled={!isSelectable && !isSelected}
                    onClick={() => onSelectTable(table)}
                    className={`w-full p-3 rounded-xl border text-left transition-all duration-300 ${getStatusColor(table.status, isSelected)}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xs font-semibold">{table.name}</span>
                      {getStatusBadge(table.status, isSelected)}
                    </div>
                    <p className="text-[9px] opacity-70 line-clamp-1 mt-1">{table.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tatami Corner */}
          <div>
            <div className="text-[10px] uppercase tracking-widest font-semibold text-[var(--text-muted)] mb-2 flex items-center justify-between">
              <span>Tatami Corner (Shoe-off Comfort)</span>
              <span className="text-[9px] text-[#E98316]">4–8 Guests</span>
            </div>
            <div className="space-y-2">
              {tables.filter(t => t.type === 'tatami-corner').map(table => {
                const isSelected = selectedTableId === table.id;
                const isSelectable = table.status === 'available';
                return (
                  <button
                    key={table.id}
                    type="button"
                    disabled={!isSelectable && !isSelected}
                    onClick={() => onSelectTable(table)}
                    className={`w-full p-3 rounded-xl border text-left transition-all duration-300 ${getStatusColor(table.status, isSelected)}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xs font-semibold">{table.name}</span>
                      {getStatusBadge(table.status, isSelected)}
                    </div>
                    <p className="text-[9px] opacity-70 line-clamp-1 mt-1">{table.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
