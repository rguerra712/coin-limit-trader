enum CoinType {
  BTC,
  LTC,
  ETH,
  BCH
}

class Order {
  orderType: "buy" | "sell";
  price: number;
  size: number;
  coinId: CoinType;

  /**
   * Create an instance of an order to act upon later
   */
  constructor(
    orderType: "buy" | "sell",
    price: number,
    size: number,
    coinId: CoinType
  ) {
    this.orderType = orderType;
    this.price = price;
    this.size = size;
    this.coinId = coinId;
  }
}
