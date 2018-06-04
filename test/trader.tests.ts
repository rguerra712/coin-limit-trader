import { expect } from "chai";
import { mock, when, verify, anyString, anything, instance } from "ts-mockito";
import { OrderClient } from "../lib/order-client";
import { Trader } from "../lib/trader";
import { OrderPlacedResult, Order, CoinType } from "../types/types";

describe("trade() with no cancellations", () => {
  let mockOrderClient: OrderClient;
  let orderClientResult: OrderPlacedResult;
  let trader: Trader;
  beforeEach(() => {
    // Setup Trader
    orderClientResult = new OrderPlacedResult("432");
    mockOrderClient = mock(OrderClient);
    when(mockOrderClient.placeOrder(anything())).thenResolve(orderClientResult);
    const orderClient: OrderClient = instance(mockOrderClient);
    trader = new Trader(orderClient);
  });

  it("Should call placed order on client with no cancellation call", () => {
    // Arrange
    const order = new Order("buy", 123, 123, CoinType.LTC);

    // Act
    const tradePromise = trader.trade(order);

    // Assert
    return tradePromise.then(result => {
      verify(mockOrderClient.isOrderActive(anyString())).never();
      verify(mockOrderClient.cancelOrder(anyString())).never();
      verify(mockOrderClient.placeOrder(order)).once();
    });
  });

  it("Should match placed order id", () => {
    // Arrange
    const order = new Order("buy", 123, 123, CoinType.LTC);

    // Act
    const tradePromise = trader.trade(order);

    // Assert
    return tradePromise.then(result => {
      expect(result.orderId).to.equal(
        orderClientResult.orderId,
        "result id should match that of placed order"
      );
    });
  });
});
