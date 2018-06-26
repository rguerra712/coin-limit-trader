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
    this.size = order.size.toString();
    this.product_id = order.coinId.toString() + '-USD';
  }
}

@injectable()
export class GdaxOrderPlacer implements OrderPlacer {
  authedClient: AuthenticatedClient;
  /**
   * Create an order placer using the GDAX api
   */
  constructor(@inject(TYPES.AuthenticatedClient) authedClient:
                  AuthenticatedClient) {
    this.authedClient = authedClient;
  }

  placeOrder = (order: Order): Promise<OrderPlacedResult> => {
    return new Promise((resolve, reject) => {
      console.log(`order placed: ${JSON.stringify(order)}`);
      const params = new SimplifiedLimitOrder(order);
      return this.authedClient.placeOrder(params)
          .then(order => resolve(new OrderPlacedResult(order.id)))
          .catch(error => reject(error));
    });
  };
}
