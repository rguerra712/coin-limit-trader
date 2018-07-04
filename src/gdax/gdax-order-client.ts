import 'reflect-metadata';

import {AuthenticatedClient, LimitOrder} from 'gdax';
import {inject, injectable} from 'inversify';

import {Order, OrderDetails, OrderPlacedResult, TYPES} from '../types/types';

import {OrderClient} from './../order-client';

@injectable()
export class GdaxOrderClient implements OrderClient {
  private authedClient: AuthenticatedClient;

  /**
   * Create an instance of an order client use for GDAX
   */
  constructor(@inject(TYPES.AuthenticatedClient) authedClient:
                  AuthenticatedClient) {
    this.authedClient = authedClient;
  }

  getOrderDetails = async(orderId: string): Promise<OrderDetails> => {
    const orderInfo = await this.authedClient.getOrder(orderId);
    return {isOrderActive: !orderInfo.settled, price: Number(orderInfo.price)};
  };

  cancelOrder = (orderId: string): Promise<string[]> => {
    return this.authedClient.cancelOrder(orderId);
  };
}
