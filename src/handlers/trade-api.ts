import { OrderScheduler } from "../aws/order-scheduler";
import { Context, Callback, Handler } from "aws-lambda";
import "reflect-metadata";

export const trade: Handler = (
    // tslint:disable-next-line:no-any
    event: any,
    context: Context,
    callback: Callback
) => {
    const orderScheduler = new OrderScheduler();
    const bodyParsed = JSON.parse(event.body);
    const delay = bodyParsed.delay || 15;
    console.log(delay);
    orderScheduler.scheduleOrderFromEvent(bodyParsed, delay);
    const response = { statusCode: 201 };

    callback(undefined, response);
};
