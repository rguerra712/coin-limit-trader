import 'reflect-metadata';

import {inject, injectable} from 'inversify';

import {OrderScheduler} from './aws/order-scheduler';
import {GdaxPriceFinder} from './gdax/gdax-price-finder';
import {OrderClient} from './order-client';
import {OrderPlacer} from './order-placer';
import {Order, OrderCompletionResult, OrderFulfilledResult, TYPES} from './types/types';

@injectable()
export class Trader {
  private orderClient: OrderClient;
  private orderPlacer: OrderPlacer;
  private orderScheduler: OrderScheduler;
  private priceFinder: GdaxPriceFinder;

  /**
   * Createa a new instance of a trader that places orders and cancels existing
   * ones
   */
  constructor(
      @inject(TYPES.OrderClient) orderClient: OrderClient,
      @inject(TYPES.OrderPlacer) orderPlacer: OrderPlacer,
      @inject(TYPES.OrderScheduler) orderScheduler: OrderScheduler,
      @inject(TYPES.GdaxPriceFinder) priceFinder: GdaxPriceFinder) {
    this.orderClient = orderClient;
    this.orderPlacer = orderPlacer;
    this.orderScheduler = orderScheduler;
    this.priceFinder = priceFinder;
  }

  trade = async(order: Order, delay: number, idToCancel?: string):
      Promise<OrderCompletionResult> => {
        if (idToCancel) {
          const orderDetails =
              await this.orderClient.getOrderDetails(idToCancel);
          if (orderDetails.isOrderActive) {
            const price = await this.priceFinder.getCurrentPrice(
                order.coinId, order.orderType);
            order.price = price;
            console.log(`prices are ${orderDetails.price} for old and ${
                order.price} for new`);
            if (orderDetails.price !== order.price) {
              const canceledOrderIds =
                  await this.orderClient.cancelOrder(idToCancel);
              if (canceledOrderIds) {
                canceledOrderIds.forEach(
                    id => console.log(`cancelled order id ${id}`));
              }
              return await this.orderPlacer.placeOrder(order, delay);
            } else {
              this.orderScheduler.scheduleOrder(order, delay, idToCancel);
              return new OrderFulfilledResult();
            }
          } else {
            return new OrderFulfilledResult();
          }
        }
        return this.orderPlacer.placeOrder(order, delay);
      };
}
