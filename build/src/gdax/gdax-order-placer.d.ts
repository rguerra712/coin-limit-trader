import "reflect-metadata";
import { AuthenticatedClient } from "gdax";
import { Order, OrderPlacedResult } from "../types/types";
import { OrderPlacer } from "./../order-placer";
export declare class GdaxOrderPlacer implements OrderPlacer {
    authedClient: AuthenticatedClient;
    /**
     * Create an order placer using the GDAX api
     */
    constructor(authedClient: AuthenticatedClient);
    placeOrder: (order: Order) => Promise<OrderPlacedResult>;
}
