import {
  Order,
  OrderCompletionResult,
  OrderFulfilledResult
} from "./../types/types";
import { OrderClient } from "./order-client";

export class Trader {
  private orderClient: OrderClient;

  /**
   * Createa a new instance of a trader that places orders and cancels existing ones
   */
  constructor(orderClient: OrderClient) {
    this.orderClient = orderClient;
  }

  trade = (
    order: Order,
    idToCancel?: string
  ): Promise<OrderCompletionResult> => {
    if (idToCancel) {
      return new Promise((resolve, reject) => {
        this.orderClient
          .isOrderActive(idToCancel)
          .then(isActive => {
            if (isActive) {
              this.orderClient
                .cancelOrder(idToCancel)
                .then(cancellations => {
                  this.orderClient
                    .placeOrder(order)
                    .then(result => resolve(result))
                    .catch(error => reject(error));
                })
                .catch(error => reject(error));
            } else {
              resolve(new OrderFulfilledResult());
            }
          })
          .catch(error => reject(error));
      });
    }
    return this.orderClient.placeOrder(order);
  };
}
