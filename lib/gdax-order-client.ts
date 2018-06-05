import { AuthenticatedClient, LimitOrder } from "gdax";
import { Order, OrderPlacedResult, TYPES } from "../types/types";
import { OrderClient } from "./order-client";
import "reflect-metadata";
import { injectable, inject } from "inversify";


class SimplifiedLimitOrder implements LimitOrder {
  type: "limit";
  price: string;
  size: string;
  post_only?: true;
  side: "buy" | "sell";
  product_id: string;

  /**
   * Instantiate a Limit order for a given Order
   */
  constructor(order: Order) {
    this.side = order.orderType;
    this.post_only = true;
    if (order.price) {
      this.price = order.price.toString();
    } else {
      throw new Error("Must set a price when creating a GDax order");
    }
    this.size = order.size.toString();
    this.product_id = order.coinId.toString() + "-USD";
  }
}

@injectable()
export class GdaxOrderClient implements OrderClient {
  
  private authedClient: AuthenticatedClient;

  /**
   * Create an instance of an order client use for GDAX
   */
  constructor(@inject(TYPES.AuthenticatedClient)authedClient: AuthenticatedClient) {
    this.authedClient = authedClient;  
  }
  
    placeOrder = (order: Order): Promise<OrderPlacedResult> => {
    return new Promise((resolve, reject) => {
      console.log(`order placed: ${JSON.stringify(order)}`);
      let params = new SimplifiedLimitOrder(order);
      return this.authedClient
        .placeOrder(params)
        .then(order => resolve(new OrderPlacedResult(order.id)))
        .catch(error => reject(error));
    });
  };

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
