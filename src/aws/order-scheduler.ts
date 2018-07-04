import 'reflect-metadata';

import {AWSError, Lambda, SNS} from 'aws-sdk';
import {injectable} from 'inversify';

import {Order} from '../types/types';

import {EventOrderExtractor} from './event-order-extractor';

const sns = new SNS();

@injectable()
export class OrderScheduler {
  // tslint:disable-next-line:no-any
  scheduleOrderFromEvent(event: any, delay: number): void {
    const orderExtractor = new EventOrderExtractor();
    const order = orderExtractor.extractOrderFrom(event);
    this.scheduleOrder(order, delay);
  }

  scheduleOrder(order: Order, delay: number, previousOrderId?: string): void {
    const message = JSON.stringify({order, delay, previousOrderId}, null, 2);
    let siteParser: Lambda;
    const configuration = {region: process.env['COIN_LIMIT_TRADER_REGION']};
    siteParser = new Lambda(configuration);
    // tslint:disable-next-line:no-any
    const callback = (error: AWSError, data: any) => {
      if (error) {
        throw error;
      }
      if (data.Payload) {
        return data.Payload;
      } else {
        throw new Error(`No payload found from lambda, data was ${
            JSON.stringify(data, null, 2)}`);
      }
    };
    const event = {body: message};
    const request = {
      FunctionName: process.env['COIN_LIMIT_TRADER_FUNCTION_NAME'] || '',
      Payload: JSON.stringify(event, null, 2)
    };
    console.log(`invoking lambda with arguments ${JSON.stringify(request)}`);
    siteParser.invoke(request, callback);
  }
}
