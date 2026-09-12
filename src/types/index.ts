export type RamenCategory = 'all' | 'house-favorite' | 'classic' | 'rich-creamy' | 'spicy' | 'hearty' | 'vegetarian';

export type MoodType = 'cozy' | 'adventurous' | 'quiet' | 'spicy' | 'dreamy';

export type SeatingType = 'counter-bar' | 'cozy-booth' | 'window-nook' | 'tatami-corner';

export type ThemeMode = 'light' | 'dark' | 'pastel';

export type UserRole = 'customer' | 'admin';

export interface UserAddress {
  id: string;
  label: string; // e.g. "Home", "Studio"
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault?: boolean;
}

export interface UserPreferences {
  dietaryPreference?: 'all' | 'vegetarian' | 'halal' | 'no-pork';
  spiceTolerance?: number; // 1-3
  quietSeatingPreferred?: boolean;
  themePreference?: ThemeMode;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  addresses: UserAddress[];
  preferences: UserPreferences;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  japaneseName?: string;
  price: number;
  tag: string;
  category: RamenCategory;
  description: string;
  longDescription?: string;
  image: string;
  ingredients: string[];
  brothType: string;
  noodleType: string;
  spiceLevel: number; // 0 to 3
  isVegetarian?: boolean;
  isHouseFavorite?: boolean;
  calories?: number;
  allergens?: string[];
}

export interface BrothOption {
  id: string;
  name: string;
  description: string;
  additionalPrice: number;
  color: string;
  flavorProfile: string;
}

export interface NoodleOption {
  id: string;
  name: string;
  description: string;
  firmness: string;
}

export interface ProteinOption {
  id: string;
  name: string;
  additionalPrice: number;
  dietary?: string;
}

export interface ToppingOption {
  id: string;
  name: string;
  additionalPrice: number;
  category: 'classic' | 'crunch' | 'fresh' | 'egg';
}

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
}

export interface CustomBowlState {
  broth: BrothOption;
  noodles: NoodleOption;
  protein: ProteinOption;
  toppings: string[]; // topping ids
  extras: string[]; // extra ids
  spiceLevel: number;
  specialInstructions?: string;
}

export interface CartItem {
  cartItemId: string;
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  tag?: string;
  isCustomBowl?: boolean;
  customDetails?: {
    broth: string;
    noodles: string;
    protein: string;
    toppings: string[];
    extras: string[];
    spiceLevel: number;
  };
}

export type TableStatus = 'available' | 'selected' | 'occupied' | 'reserved';

export interface RestaurantTable {
  id: string;
  name: string;
  type: SeatingType;
  capacity: number;
  description: string;
  position: { x: number; y: number }; // For visual floor plan (0-100%)
  status: TableStatus;
}

export type ReservationStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  userId?: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  seatingPreference: SeatingType;
  tableId?: string;
  tableName?: string;
  status: ReservationStatus;
  specialRequest?: string;
  createdAt: string;
}

export type OrderType = 'PICKUP' | 'DELIVERY';

export type DeliveryStage = 
  | 'ORDER_PLACED' 
  | 'ORDER_CONFIRMED' 
  | 'PREPARING' 
  | 'READY' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED';

export type OrderStatus = 'active' | 'completed' | 'cancelled';

export interface OrderDeliveryAddress {
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface OrderTimelineEvent {
  stage: DeliveryStage;
  title: string;
  description: string;
  timestamp: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  total: number;
  orderType: OrderType;
  deliveryAddress?: OrderDeliveryAddress;
  pickupTime?: string;
  status: OrderStatus;
  deliveryStage: DeliveryStage;
  estimatedDeliveryTime: string; // e.g., "25–35 min"
  specialInstructions?: string;
  createdAt: string;
  timeline: OrderTimelineEvent[];
}

export interface MoodRecommendation {
  mood: MoodType;
  title: string;
  subtitle: string;
  bowlId: string;
  quote: string;
  notes: string;
  ambientVibe: string;
}
