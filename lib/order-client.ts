import { AuthenticatedClient, LimitOrder } from "gdax";
import { Order, OrderPlacedResult } from "../types/types";

declare var process: {
  env: {
    GDAX_KEY: string;
    GDAX_SECRET: string;
    GDAX_PASSPHRASE: string;
    GDAX_URL: string;
  };
};
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
    this.price = order.price.toString();
    this.size = order.size.toString();
    this.product_id = order.coinId.toString() + "-USD";
  }
}

const authedClient = new AuthenticatedClient(
  process.env.GDAX_KEY,
  process.env.GDAX_SECRET,
  process.env.GDAX_PASSPHRASE,
  process.env.GDAX_URL
);

export class OrderClient {
  placeOrder = (order: Order): Promise<OrderPlacedResult> => {
    return new Promise((resolve, reject) => {
      console.log(`order placed: ${JSON.stringify(order)}`);
      let params = new SimplifiedLimitOrder(order);
      return authedClient
        .placeOrder(params)
        .then(order => resolve(new OrderPlacedResult(order.id)))
        .catch(error => reject(error));
    });
  };

  isOrderActive = (orderId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      authedClient
        .getOrder(orderId)
        .then(orderInfo => {
          resolve(orderInfo.settled);
        })
        .catch(reason => reject(reason));
    });
  };

  cancelOrder = (orderId: string): Promise<string[]> => {
    console.log(`order canceled: ${orderId}`);
    return authedClient.cancelOrder(orderId);
  };
}
