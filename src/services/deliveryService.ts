import { Order, DeliveryStage } from '../types';
import { orderService } from './orderService';

const STAGE_ORDER: DeliveryStage[] = [
  'ORDER_PLACED',
  'ORDER_CONFIRMED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED'
];

class DeliveryService {
  public getOrderTracking(orderId: string): Order | null {
    return orderService.getOrderById(orderId);
  }

  public getNextStage(currentStage: DeliveryStage): DeliveryStage | null {
    const currentIndex = STAGE_ORDER.indexOf(currentStage);
    if (currentIndex >= 0 && currentIndex < STAGE_ORDER.length - 1) {
      return STAGE_ORDER[currentIndex + 1];
    }
    return null;
  }

  public advanceStage(orderId: string): Order | null {
    const order = orderService.getOrderById(orderId);
    if (!order) return null;

    const next = this.getNextStage(order.deliveryStage);
    if (!next) return order;

    return orderService.updateOrderStage(orderId, next);
  }

  public getStageProgressPercent(stage: DeliveryStage): number {
    const index = STAGE_ORDER.indexOf(stage);
    return Math.round(((index) / (STAGE_ORDER.length - 1)) * 100);
  }
}

export const deliveryService = new DeliveryService();
