import {OrderClient} from './order-client';
import {OrderPlacer} from './order-placer';
import {Order, OrderCompletionResult, OrderFulfilledResult} from './types/types';

export class Trader {
  private orderClient: OrderClient;
  private orderPlacer: OrderPlacer;

  /**
   * Createa a new instance of a trader that places orders and cancels existing
   * ones
   */
  constructor(orderClient: OrderClient, orderPlacer: OrderPlacer) {
    this.orderClient = orderClient;
    this.orderPlacer = orderPlacer;
  }

  trade =
      (order: Order, idToCancel?: string): Promise<OrderCompletionResult> => {
        if (idToCancel) {
          return new Promise((resolve, reject) => {
            this.orderClient.isOrderActive(idToCancel)
                .then(isActive => {
                  if (isActive) {
                    this.orderClient.cancelOrder(idToCancel)
                        .then(cancellations => {
                          this.orderPlacer.placeOrder(order)
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
        return this.orderPlacer.placeOrder(order);
      };
}
