import { Callback, Context, Handler } from "aws-lambda";

import { container } from "././inversify-config";

interface TradeResponse {
    statusCode: number;
    body: string;
}

// tslint:disable-next-line:no-any
const trade: Handler = (event: any, context: Context, callback: Callback) => {
    const response: TradeResponse = {
        statusCode: 200,
        body: JSON.stringify({ message: Math.floor(Math.random() * 10) })
    };

    callback(undefined, response);
};

export { trade };
