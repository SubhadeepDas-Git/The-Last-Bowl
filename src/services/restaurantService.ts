// Central restaurant status management for The Last Bowl
// Ensures unified open/closed status across Guest, Customer, and Admin

const STATUS_STORAGE_KEY = 'tlb_restaurant_status_v2';
export const RESTAURANT_STATUS_EVENT = 'tlb_restaurant_status_changed';

export type RestaurantMode = 'auto' | 'manual';

export interface RestaurantState {
  isOpen: boolean;
  mode: RestaurantMode;
  lastUpdated: string;
}

class RestaurantService {
  private isNaturalLateNightHours(): boolean {
    const hours = new Date().getHours();
    // Open between 7 PM (19) and 4 AM (4)
    return hours >= 19 || hours < 4;
  }

  public getState(): RestaurantState {
    try {
      const saved = localStorage.getItem(STATUS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.mode === 'manual') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }

    // Default to natural operating hours
    const naturallyOpen = this.isNaturalLateNightHours();
    return {
      isOpen: naturallyOpen,
      mode: 'auto',
      lastUpdated: new Date().toISOString()
    };
  }

  public isOpen(): boolean {
    return this.getState().isOpen;
  }

  public setOpen(isOpen: boolean): void {
    const state: RestaurantState = {
      isOpen,
      mode: 'manual',
      lastUpdated: new Date().toISOString()
    };
    try {
      localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save restaurant status', e);
    }
    window.dispatchEvent(new CustomEvent(RESTAURANT_STATUS_EVENT, { detail: state }));
  }

  public resetToAuto(): void {
    const naturallyOpen = this.isNaturalLateNightHours();
    const state: RestaurantState = {
      isOpen: naturallyOpen,
      mode: 'auto',
      lastUpdated: new Date().toISOString()
    };
    try {
      localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to reset restaurant status', e);
    }
    window.dispatchEvent(new CustomEvent(RESTAURANT_STATUS_EVENT, { detail: state }));
  }
}

export const restaurantService = new RestaurantService();
