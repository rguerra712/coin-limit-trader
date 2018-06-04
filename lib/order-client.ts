import { Order, OrderPlacedResult } from "../types/types";

/**
 * A client wrapping an API to place/cancel orders based on their status and reschedule periodically if needed
 */
export interface OrderClient {
  placeOrder(order: Order): Promise<OrderPlacedResult>;
  isOrderActive(orderId: string): Promise<boolean>;
  cancelOrder(orderId: string): Promise<string[]>;
}
