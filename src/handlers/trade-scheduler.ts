import { Trader } from "./../trader";
import { EventOrderExtractor } from "../aws/event-order-extractor";
import { Handler } from "aws-lambda";
import { container } from "../inversify-config";
import { TYPES } from "../types/types";
import "reflect-metadata";

export const trade: Handler = async (
    // tslint:disable-next-line:no-any
    event: any
) => {
    const eventOrderExtractor = new EventOrderExtractor();
    const orderDetails = JSON.parse(event.Records[0].Sns.Message);
    console.log(`order scheduled ${JSON.stringify(orderDetails)}`);
    if (!orderDetails.order) {
        throw new Error("no order was passed along the message");
    }
    const order = eventOrderExtractor.extractOrderFrom(orderDetails.order);
    const delay = orderDetails["delay"] || 15;
    const previousOrderId = orderDetails["previousOrderId"];
    const trader = container.get<Trader>(TYPES.Trader);

    await trader.trade(order, delay, previousOrderId);
};
