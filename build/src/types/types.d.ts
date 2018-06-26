export declare enum CoinType {
    Bitcoin = "BTC",
    Litecoin = "LTC",
    Ethereum = "ETH",
    BitcoinCash = "BCH",
}
export declare class Order {
    orderType: 'buy' | 'sell';
    price?: number;
    size: number;
    coinId: CoinType;
    /**
     * Create an instance of an order to act upon later
     */
    constructor(orderType: 'buy' | 'sell', price: number, size: number, coinId: CoinType);
}
export interface OrderCompletionResult {
    isCompleted(): boolean;
    orderId?: string;
}
export declare class OrderFulfilledResult implements OrderCompletionResult {
    isCompleted(): boolean;
}
export declare class OrderPlacedResult implements OrderCompletionResult {
    isCompleted(): boolean;
    orderId: string;
    /**
     * Create an order result as it comes back from a third party API
     */
    constructor(orderId: string);
}
export declare const TYPES: {
    AuthenticatedClient: symbol;
    PublicClient: symbol;
    GdaxOrderClient: symbol;
    GdaxOrderPlacer: symbol;
    GdaxPriceFinder: symbol;
};
