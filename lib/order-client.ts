import { OrderPlacer } from "./order-placer";

/**
 * A client wrapping an API to place/cancel orders based on their status and reschedule periodically if needed
 */
export interface OrderClient extends OrderPlacer{
  isOrderActive(orderId: string): Promise<boolean>;
  cancelOrder(orderId: string): Promise<string[]>;
}
