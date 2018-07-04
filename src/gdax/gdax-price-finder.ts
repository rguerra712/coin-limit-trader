import 'reflect-metadata';

import {PublicClient} from 'gdax';
import {inject, injectable} from 'inversify';

import {TYPES} from '../types/types';

import {CoinType} from './../types/types';

/**
 * A class to obtain the current price for a coin using the GDAX api
 */
@injectable()
export class GdaxPriceFinder {
  client: PublicClient;
  constructor(@inject(TYPES.PublicClient) client: PublicClient) {
    this.client = client;
  }

  async getCurrentPrice(coin: CoinType, orderType: 'buy'|'sell'):
      Promise<number> {
    if (!coin) {
      throw new Error('coin is required to get current price');
    }
    const details =
        await this.client.getProductTicker(`${coin.toString()}-USD`);
    const priceForBuying = details.bid;
    const priceForSelling = details.ask;
    const price = orderType === 'buy' ? priceForBuying : priceForSelling;
    return Number(price);
  }
}
