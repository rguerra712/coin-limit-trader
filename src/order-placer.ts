import {Order, OrderPlacedResult} from './types/types';
/**
 * An interface that incompasses solely the placing of an order
 */
export interface OrderPlacer {
  placeOrder(order: Order): Promise<OrderPlacedResult>;
}