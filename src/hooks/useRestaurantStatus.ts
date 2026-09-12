import { useState, useEffect } from 'react';
import { restaurantService, RESTAURANT_STATUS_EVENT, RestaurantState } from '../services/restaurantService';

export interface RestaurantStatus {
  isOpen: boolean;
  mode: 'auto' | 'manual';
  badgeText: string;
  statusHeadline: string;
  subtext: string;
  currentTimeString: string;
}

export function useRestaurantStatus(): RestaurantStatus {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [state, setState] = useState<RestaurantState>(() => restaurantService.getState());

  useEffect(() => {
    const handleStatusChange = (e: Event) => {
      const customEvent = e as CustomEvent<RestaurantState>;
      if (customEvent.detail) {
        setState(customEvent.detail);
      } else {
        setState(restaurantService.getState());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'tlb_restaurant_status_v2') {
        setState(restaurantService.getState());
      }
    };

    window.addEventListener(RESTAURANT_STATUS_EVENT, handleStatusChange);
    window.addEventListener('storage', handleStorage);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Re-evaluate if in auto mode
      if (state.mode === 'auto') {
        setState(restaurantService.getState());
      }
    }, 30000);

    return () => {
      window.removeEventListener(RESTAURANT_STATUS_EVENT, handleStatusChange);
      window.removeEventListener('storage', handleStorage);
      clearInterval(timer);
    };
  }, [state.mode]);

  const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const hours = currentTime.getHours();

  let badgeText = '';
  let statusHeadline = '';
  let subtext = '';

  if (state.isOpen) {
    badgeText = 'OPEN UNTIL DAWN';
    statusHeadline = 'Welcoming Midnight Wanderers';
    if (hours >= 19 && hours < 24) {
      subtext = `Doors are open · Serving warm comfort until 4:00 AM · Local time ${timeString}`;
    } else {
      subtext = `Late night hours in session · Kitchen open until 3:30 AM · Local time ${timeString}`;
    }
  } else {
    badgeText = 'CURRENTLY CLOSED';
    statusHeadline = 'Resting for the Night';
    subtext = `Simmering broths for tonight · Doors open at 7:00 PM · Local time ${timeString}`;
  }

  return {
    isOpen: state.isOpen,
    mode: state.mode,
    badgeText,
    statusHeadline,
    subtext,
    currentTimeString: timeString
  };
}

