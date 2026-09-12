import { Order, CartItem, OrderType, OrderDeliveryAddress, DeliveryStage, OrderTimelineEvent } from '../types';

const ORDERS_STORAGE_KEY = 'tlb_orders_v2';

const STAGES: DeliveryStage[] = [
  'ORDER_PLACED',
  'ORDER_CONFIRMED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED'
];

export function buildTimeline(currentStage: DeliveryStage, createdAt: string): OrderTimelineEvent[] {
  const currentIndex = STAGES.indexOf(currentStage);
  const baseTime = new Date(createdAt).getTime();

  return [
    {
      stage: 'ORDER_PLACED',
      title: 'Order Placed',
      description: 'Your bowl request has been received by the midnight counter.',
      timestamp: new Date(baseTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCompleted: currentIndex >= 0,
      isCurrent: currentStage === 'ORDER_PLACED'
    },
    {
      stage: 'ORDER_CONFIRMED',
      title: 'Order Confirmed',
      description: 'The head chef reviewed your noodle cut and broth choice.',
      timestamp: new Date(baseTime + 180000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCompleted: currentIndex >= 1,
      isCurrent: currentStage === 'ORDER_CONFIRMED'
    },
    {
      stage: 'PREPARING',
      title: 'Simmering & Crafting',
      description: 'Broth is ladled steaming hot; noodles are timed precisely to the second.',
      timestamp: new Date(baseTime + 480000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCompleted: currentIndex >= 2,
      isCurrent: currentStage === 'PREPARING'
    },
    {
      stage: 'READY',
      title: 'Bowl Steaming & Packed',
      description: 'Packed in thermal insulated ceramic-lined packaging to retain piping heat.',
      timestamp: new Date(baseTime + 900000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCompleted: currentIndex >= 3,
      isCurrent: currentStage === 'READY'
    },
    {
      stage: 'OUT_FOR_DELIVERY',
      title: 'Courier on Midnight Alley',
      description: 'Our rider is navigating the quiet lantern streets to your doorstep.',
      timestamp: new Date(baseTime + 1200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCompleted: currentIndex >= 4,
      isCurrent: currentStage === 'OUT_FOR_DELIVERY'
    },
    {
      stage: 'DELIVERED',
      title: 'Delivered With Warmth',
      description: 'Handed over. Untie the ribbon, take the first warm sip, and slow down.',
      timestamp: new Date(baseTime + 1800000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCompleted: currentIndex >= 5,
      isCurrent: currentStage === 'DELIVERED'
    }
  ];
}

const SEED_ORDERS: Order[] = [
  {
    id: 'TLB-ORD-9281',
    userId: 'usr_demo_midnight',
    customerName: 'Ren Takahashi',
    customerEmail: 'wanderer@thelastbowl.com',
    customerPhone: '+1 (555) 839-2695',
    items: [
      {
        cartItemId: 'item_1',
        menuItemId: 'moonlit-miso',
        name: 'Moonlit Miso',
        price: 13,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1000&auto=format&fit=crop',
        tag: 'HOUSE FAVORITE'
      },
      {
        cartItemId: 'item_2',
        menuItemId: 'crispy-gyoza',
        name: 'Midnight Pan-Fried Gyoza',
        price: 7.5,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800&auto=format&fit=crop',
        tag: 'CRISPY & JUICY'
      }
    ],
    subtotal: 20.5,
    deliveryFee: 3.5,
    tax: 1.69,
    tip: 3.0,
    total: 28.69,
    orderType: 'DELIVERY',
    deliveryAddress: {
      houseFlat: 'Apt 402, Lantern Heights',
      street: '4th Avenue East',
      area: 'Neon District',
      city: 'Nightfall Quarter',
      state: 'NQ',
      pinCode: '700012'
    },
    status: 'active',
    deliveryStage: 'PREPARING',
    estimatedDeliveryTime: '20–25 min',
    specialInstructions: 'Please leave in thermal bag at apartment door',
    createdAt: new Date(Date.now() - 600000).toISOString(),
    timeline: buildTimeline('PREPARING', new Date(Date.now() - 600000).toISOString())
  },
  {
    id: 'TLB-ORD-5140',
    userId: 'usr_demo_midnight',
    customerName: 'Ren Takahashi',
    customerEmail: 'wanderer@thelastbowl.com',
    customerPhone: '+1 (555) 839-2695',
    items: [
      {
        cartItemId: 'item_3',
        menuItemId: 'velvet-tonkotsu',
        name: 'Velvet Tonkotsu',
        price: 15,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=1000&auto=format&fit=crop',
        tag: 'RICH & CREAMY'
      }
    ],
    subtotal: 30.0,
    deliveryFee: 0,
    tax: 2.48,
    tip: 4.5,
    total: 36.98,
    orderType: 'PICKUP',
    pickupTime: '25-30 mins',
    status: 'completed',
    deliveryStage: 'DELIVERED',
    estimatedDeliveryTime: 'Delivered',
    createdAt: '2026-09-08T01:10:00.000Z',
    timeline: buildTimeline('DELIVERED', '2026-09-08T01:10:00.000Z')
  }
];

class OrderService {
  public getAllOrders(): Order[] {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      let list: Order[] = saved ? JSON.parse(saved) : [];
      if (list.length === 0) {
        list = SEED_ORDERS;
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(list));
      }
      return list;
    } catch {
      return SEED_ORDERS;
    }
  }

  public getOrders(userId?: string): Order[] {
    const list = this.getAllOrders();
    if (userId) {
      return list.filter(o => o.userId === userId);
    }
    return list;
  }

  private saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }

  public getOrderById(orderId: string): Order | null {
    const orders = this.getOrders();
    return orders.find(o => o.id.trim().toUpperCase() === orderId.trim().toUpperCase()) || null;
  }

  public createOrder(data: {
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
    specialInstructions?: string;
  }): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = this.getOrders();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const orderId = `TLB-ORD-${randomNum}`;
        const createdAt = new Date().toISOString();

        const newOrder: Order = {
          id: orderId,
          userId: data.userId,
          customerName: data.customerName.trim(),
          customerEmail: data.customerEmail.trim(),
          customerPhone: data.customerPhone.trim(),
          items: data.items,
          subtotal: data.subtotal,
          deliveryFee: data.deliveryFee,
          tax: data.tax,
          tip: data.tip,
          total: data.total,
          orderType: data.orderType,
          deliveryAddress: data.deliveryAddress,
          pickupTime: data.pickupTime,
          status: 'active',
          deliveryStage: 'ORDER_PLACED',
          estimatedDeliveryTime: data.orderType === 'DELIVERY' ? '25–35 min' : (data.pickupTime || '20-25 min'),
          specialInstructions: data.specialInstructions?.trim(),
          createdAt,
          timeline: buildTimeline('ORDER_PLACED', createdAt)
        };

        orders.unshift(newOrder);
        this.saveOrders(orders);
        resolve(newOrder);
      }, 500);
    });
  }

  public updateOrderStage(orderId: string, nextStage: DeliveryStage): Order | null {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    order.deliveryStage = nextStage;
    if (nextStage === 'DELIVERED') {
      order.status = 'completed';
      order.estimatedDeliveryTime = 'Delivered';
    }
    order.timeline = buildTimeline(nextStage, order.createdAt);

    this.saveOrders(orders);
    return order;
  }
}

export const orderService = new OrderService();
