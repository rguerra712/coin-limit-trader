import 'reflect-metadata';

import {AuthenticatedClient, PublicClient} from 'gdax';
import {Container} from 'inversify';

import {OrderScheduler} from './aws/order-scheduler';
import {GdaxOrderClient} from './gdax/gdax-order-client';
import {GdaxOrderPlacer} from './gdax/gdax-order-placer';
import {GdaxPriceFinder} from './gdax/gdax-price-finder';
import {OrderClient} from './order-client';
import {RetryingOrderPlacer} from './retrying-order-placer';
import {Trader} from './trader';
import {TYPES} from './types/types';

declare var process: {
  env: {
    GDAX_KEY: string; GDAX_SECRET: string; GDAX_PASSPHRASE: string;
    GDAX_URL: string;
  };
};

const authedClient = new AuthenticatedClient(
    process.env.GDAX_KEY, process.env.GDAX_SECRET, process.env.GDAX_PASSPHRASE,
    process.env.GDAX_URL);

const publicClient = new PublicClient(process.env.GDAX_URL);

const container = new Container();
container.bind(TYPES.AuthenticatedClient).toConstantValue(authedClient);
container.bind(TYPES.PublicClient).toConstantValue(publicClient);
container.bind(TYPES.GdaxOrderClient).to(GdaxOrderClient);
container.bind(TYPES.GdaxOrderPlacer).to(GdaxOrderPlacer);
container.bind(TYPES.GdaxPriceFinder).to(GdaxPriceFinder);
container.bind(TYPES.OrderClient).to(GdaxOrderClient);
container.bind(TYPES.OrderPlacer).to(RetryingOrderPlacer);
container.bind(TYPES.OrderScheduler).to(OrderScheduler);
container.bind(TYPES.Trader).to(Trader);

export {container};
