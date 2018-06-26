import "reflect-metadata";
import { GdaxOrderPlacer } from "./gdax/gdax-order-placer";
import { GdaxPriceFinder } from "./gdax/gdax-price-finder";
import { OrderPlacer } from "./order-placer";
import { Order, OrderPlacedResult } from "./types/types";
export declare class RetryingOrderPlacer implements OrderPlacer {
    private orderPlacer;
    private priceFinder;
    /**
     * Implements an order placer that retries an order, at the current price if
     * not provided
     */
    constructor(orderPlacer: GdaxOrderPlacer, priceFinder: GdaxPriceFinder);
    placeOrder(order: Order): Promise<OrderPlacedResult>;
    private placeOrderAndRetry;
}
