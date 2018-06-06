import { GdaxPriceFinder } from "./gdax/gdax-price-finder";
import { inject } from "inversify";
import { OrderPlacer } from "./order-placer";
import { OrderClient } from "./order-client";
import { Order, OrderPlacedResult, TYPES } from "../types/types";
import "reflect-metadata";
import { injectable } from "inversify";
import GdaxOrderPlacer from "./gdax/gdax-order-placer";

@injectable()
export default class RetryingOrderPlacer implements OrderPlacer {
  private orderPlacer: OrderPlacer;
  private priceFinder: GdaxPriceFinder;

  /**
   * Implements an order placer that retries an order, at the current price if not provided
   */
  constructor(
    @inject(TYPES.GdaxOrderPlacer) orderPlacer: GdaxOrderPlacer,
    @inject(TYPES.GdaxPriceFinder) priceFinder: GdaxPriceFinder
  ) {
    this.orderPlacer = orderPlacer;
  }

  placeOrder(order: Order): Promise<OrderPlacedResult> {
    if (order.price) {
      return new Promise((resolve, reject) => {
        this.priceFinder
          .getCurrentPrice(order.coinId)
          .then(price => {
            order.price = price;
            this.placeOrderAndRetry(order)
              .then(result => resolve(result))
              .catch(error => reject(error));
          })
          .catch(error => reject(error));
      });
    } else {
      return this.placeOrderAndRetry(order);
    }
  }

  private placeOrderAndRetry = (order: Order): Promise<OrderPlacedResult> => {
    // TODO retry
    return this.orderPlacer.placeOrder(order);
  };
}
