import { AuthenticatedClient, LimitOrder } from "gdax";
import { Order, OrderPlacedResult, TYPES } from "../../types/types";
import { OrderClient } from "./../order-client";
import "reflect-metadata";
import { injectable, inject } from "inversify";


@injectable()
export class GdaxOrderClient implements OrderClient {
  private authedClient: AuthenticatedClient;

  /**
   * Create an instance of an order client use for GDAX
   */
  constructor(
    @inject(TYPES.AuthenticatedClient) authedClient: AuthenticatedClient
  ) {
    this.authedClient = authedClient;
  }

  isOrderActive = (orderId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      this.authedClient
        .getOrder(orderId)
        .then(orderInfo => {
          resolve(orderInfo.settled);
        })
        .catch(reason => reject(reason));
    });
  };

  cancelOrder = (orderId: string): Promise<string[]> => {
    console.log(`order canceled: ${orderId}`);
    return this.authedClient.cancelOrder(orderId);
  };
}
