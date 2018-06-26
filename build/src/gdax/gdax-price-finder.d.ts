import 'reflect-metadata';
import { PublicClient } from 'gdax';
import { CoinType } from './../types/types';
/**
 * A class to obtain the current price for a coin using the GDAX api
 */
export declare class GdaxPriceFinder {
    client: PublicClient;
    constructor(client: PublicClient);
    getCurrentPrice(coin: CoinType): Promise<number>;
}
