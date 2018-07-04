import { Order } from "../types/types";
import { PublishInput } from "aws-sdk/clients/sns";
import { SNS } from "aws-sdk";
import { injectable } from "inversify";
import { EventOrderExtractor } from "./event-order-extractor";
import "reflect-metadata";

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
        const message = JSON.stringify(
            { order, delay, previousOrderId },
            null,
            2
        );
        const params: PublishInput = {
            Message: message,
            TopicArn: `arn:aws:sns:us-east-1:${
                process.env["AWS_ACCOUNT_ID"]
            }:scheduleTrade`
        };

        console.log(`sns params ${JSON.stringify(params)}`);
        sns.publish(params, (error, data) => {
            if (error) {
                console.log(
                    `unable to publish message for trade: ${JSON.stringify(
                        error
                    )} with params: ${JSON.stringify(params)}`
                );
                return;
            }
            console.log(
                `successfully published message: ${JSON.stringify(data)}`
            );
        });
    }
}
