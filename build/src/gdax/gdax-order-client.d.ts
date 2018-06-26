import 'reflect-metadata';
import { AuthenticatedClient } from 'gdax';
import { OrderClient } from './../order-client';
export declare class GdaxOrderClient implements OrderClient {
    private authedClient;
    /**
     * Create an instance of an order client use for GDAX
     */
    constructor(authedClient: AuthenticatedClient);
    isOrderActive: (orderId: string) => Promise<boolean>;
    cancelOrder: (orderId: string) => Promise<string[]>;
}
