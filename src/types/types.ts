export enum CoinType {
  Bitcoin = 'BTC',
  Litecoin = 'LTC',
  Ethereum = 'ETH',
  BitcoinCash = 'BCH'
}

export class Order {
  orderType: 'buy'|'sell';
  price?: number;
  size: number;
  coinId: CoinType;

  /**
   * Create an instance of an order to act upon later
   */
  constructor(
      orderType: 'buy'|'sell', price: number, size: number, coinId: CoinType) {
    this.orderType = orderType;
    this.price = price;
    this.size = size;
    this.coinId = coinId;
  }
}

export interface OrderCompletionResult {
  isCompleted(): boolean;
  orderId?: string;
}

export class OrderFulfilledResult implements OrderCompletionResult {
  isCompleted(): boolean {
    return true;
  }
}

export class OrderPlacedResult implements OrderCompletionResult {
  isCompleted(): boolean {
    return false;
  }
  orderId: string;

  /**
   * Create an order result as it comes back from a third party API
   */
  constructor(orderId: string) {
    this.orderId = orderId;
  }
}

export const TYPES = {
  AuthenticatedClient: Symbol.for('AuthenticatedClient'),
  PublicClient: Symbol.for('PublicClient'),
  GdaxOrderClient: Symbol.for('GdaxOrderClient'),
  GdaxOrderPlacer: Symbol.for('GdaxOrderPlacer'),
  GdaxPriceFinder: Symbol.for('GdaxPriceFinder')
};