import { CoinType } from "./../../types/types";
import { inject, injectable } from "inversify";
import { PublicClient } from "gdax";
import "reflect-metadata";
import { TYPES } from "../../types/types";

/**
 * A class to obtain the current price for a coin using the GDAX api
 */
@injectable()
export class GdaxPriceFinder {
  client: PublicClient;
  constructor(@inject(TYPES.PublicClient) client: PublicClient) {
    this.client = client;
  }

  getCurrentPrice(coin: CoinType): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client
        .getProductTicker(`${coin.toString()}-USD`)
        .then(details => resolve(Number(details.price)))
        .catch(error => reject(error));
    });
  }
}
