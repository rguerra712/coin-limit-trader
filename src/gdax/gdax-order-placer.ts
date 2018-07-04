import 'reflect-metadata';

import {LimitOrder} from 'gdax';
import {AuthenticatedClient} from 'gdax';
import {inject, injectable} from 'inversify';

import {Order, OrderPlacedResult, TYPES} from '../types/types';

import {OrderPlacer} from './../order-placer';

class SimplifiedLimitOrder implements LimitOrder {
  type!: 'limit';
  price: string;
  size: string;
  // tslint:disable-next-line:variable-name
  post_only?: true;
  side: 'buy'|'sell';
  // tslint:disable-next-line:variable-name
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
      throw new Error('Must set a price when creating a Gdax order');
    }
    if (!order.size) {
      throw new Error('Size is required');
    }
    this.size = order.size.toString();
    if (!order.coinId) {
      throw new Error('Coin ID is required');
    }
    this.product_id = order.coinId.toString() + '-USD';
  }
}

@injectable()
export class GdaxOrderPlacer {
  authedClient: AuthenticatedClient;
  /**
   * Create an order placer using the GDAX api
   */
  constructor(@inject(TYPES.AuthenticatedClient) authedClient:
                  AuthenticatedClient) {
    this.authedClient = authedClient;
  }

  placeOrder = async(order: Order): Promise<OrderPlacedResult> => {
    const params = new SimplifiedLimitOrder(order);
    const orderResult = await this.authedClient.placeOrder(params);
    if (orderResult.status === 'rejected') {
      throw new Error(
          `Order was rejected, details: ${JSON.stringify(orderResult)}`);
    }
    console.log(`order placed: ${JSON.stringify(orderResult.id)}`);
    return new OrderPlacedResult(orderResult.id);
  };
}
