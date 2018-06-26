import { OrderClient } from './order-client';
import { OrderPlacer } from './order-placer';
import { Order, OrderCompletionResult } from './types/types';
export declare class Trader {
    private orderClient;
    private orderPlacer;
    /**
     * Createa a new instance of a trader that places orders and cancels existing
     * ones
     */
    constructor(orderClient: OrderClient, orderPlacer: OrderPlacer);
    trade: (order: Order, idToCancel?: string | undefined) => Promise<OrderCompletionResult>;
}
