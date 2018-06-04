import { OrderPlacedResult, Order } from "./../types/types";
import { OrderClient } from "./order-client";

export class Trader {
  private orderClient: OrderClient;

  /**
   * Createa a new instance of a trader that places orders and cancels existing ones
   */
  constructor(orderClient: OrderClient) {
    this.orderClient = orderClient;
  }

  trade = (order: Order, idToCancel?: string): Promise<OrderPlacedResult> => {
    return this.orderClient.placeOrder(order);
  };
}
