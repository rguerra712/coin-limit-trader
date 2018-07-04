import 'reflect-metadata';

import {inject} from 'inversify';
import {injectable} from 'inversify';

import {OrderScheduler} from './aws/order-scheduler';
import {GdaxOrderPlacer} from './gdax/gdax-order-placer';
import {GdaxPriceFinder} from './gdax/gdax-price-finder';
import {OrderPlacer} from './order-placer';
import {Order, OrderPlacedResult, TYPES} from './types/types';

const sleep = require('thread-sleep');
const {round} = require('mathjs');

@injectable()
export class RetryingOrderPlacer implements OrderPlacer {
  private orderPlacer: GdaxOrderPlacer;
  private priceFinder: GdaxPriceFinder;
  private orderScheduler: OrderScheduler;

  /**
   * Implements an order placer that retries an order, at the current price if
   * not provided
   */
  constructor(
      @inject(TYPES.GdaxOrderPlacer) orderPlacer: GdaxOrderPlacer,
      @inject(TYPES.GdaxPriceFinder) priceFinder: GdaxPriceFinder,
      @inject(TYPES.OrderScheduler) orderScheduler: OrderScheduler) {
    this.orderPlacer = orderPlacer;
    this.priceFinder = priceFinder;
    this.orderScheduler = orderScheduler;
  }

  async placeOrder(order: Order, delay: number): Promise<OrderPlacedResult> {
    let orderResult;
    try {
      orderResult = await this.placeOrderAtPriceIfMissing(order);
    } catch (error) {
      console.warn(`Error placing first order: ${JSON.stringify(error)}`);
      orderResult = await this.placeOrderAtPriceIfMissing(
          order);  // If fails again, let it throw
    }
    order.price = 0;
    sleep(
        Number(delay) *
        1000);  // Bad on the lambda, but good if it fails in time
    this.orderScheduler.scheduleOrder(order, delay, orderResult.orderId);
    return orderResult;
  }

  async placeOrderAtPriceIfMissing(order: Order): Promise<OrderPlacedResult> {
    if (!order.price) {
      const price =
          await this.priceFinder.getCurrentPrice(order.coinId, order.orderType);
      order.price = Number(round(price, 2));
    }
    const orderResult = await this.orderPlacer.placeOrder(order);
    return orderResult;
  }
}
