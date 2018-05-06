import { Handler, Context, Callback } from 'aws-lambda';

interface TradeResponse {
  statusCode: number;
  body: string;
}

const trade: Handler = (event: any, context: Context, callback: Callback) => {
  const response: TradeResponse = {
    statusCode: 200,
    body: JSON.stringify({
      message: Math.floor(Math.random() * 10)
    })
  };

  callback(undefined, response);
};

export { trade }