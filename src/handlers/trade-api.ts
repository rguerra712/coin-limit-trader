import 'reflect-metadata';

import {Callback, Context, Handler} from 'aws-lambda';

import {EventOrderExtractor} from '../aws/event-order-extractor';
import {OrderScheduler} from '../aws/order-scheduler';
import {container} from '../inversify-config';
import {Trader} from '../trader';
import {TYPES} from '../types/types';

export const trade: Handler = async (
    // tslint:disable-next-line:no-any
    event: any, context: Context, callback: Callback) => {
  const eventOrderExtractor = new EventOrderExtractor();
  const orderDetails = JSON.parse(event.body);
  console.log(`order scheduled ${JSON.stringify(orderDetails)}`);
  if (!orderDetails.order) {
    throw new Error('no order was passed along the message');
  }
  const order = eventOrderExtractor.extractOrderFrom(orderDetails.order);
  const delay = orderDetails['delay'] || 15;
  const previousOrderId = orderDetails['previousOrderId'];
  const trader = container.get<Trader>(TYPES.Trader);

  const result = await trader.trade(order, delay, previousOrderId);
  console.log(`trade result ${JSON.stringify(result)}`);
  const response = {statusCode: 201};

  callback(undefined, response);
};
