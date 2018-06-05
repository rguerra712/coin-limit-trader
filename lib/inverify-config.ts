import { GdaxOrderClient } from "./gdax-order-client";
import { AuthenticatedClient } from "gdax";
import { Container } from "inversify";
import "reflect-metadata";
import { TYPES } from "../types/types";

declare var process: {
  env: {
    GDAX_KEY: string;
    GDAX_SECRET: string;
    GDAX_PASSPHRASE: string;
    GDAX_URL: string;
  };
};

const authedClient = new AuthenticatedClient(
  process.env.GDAX_KEY,
  process.env.GDAX_SECRET,
  process.env.GDAX_PASSPHRASE,
  process.env.GDAX_URL
);

const container = new Container();
container.bind(TYPES.AuthenticatedClient).toConstantValue(authedClient);
container.bind(TYPES.GdaxOrderClient).to(GdaxOrderClient);

export default container;