import {OrderPlacer} from './order-placer';
import {OrderDetails} from './types/types';

/**
 * A client wrapping an API to place/cancel orders based on their status and
 * reschedule periodically if needed
 */
export interface OrderClient {
  getOrderDetails(orderId: string): Promise<OrderDetails>;
  cancelOrder(orderId: string): Promise<string[]>;
}
