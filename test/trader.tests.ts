import {expect} from 'chai';
import {anyString, anything, instance, mock, verify, when} from 'ts-mockito';

import {GdaxOrderPlacer} from '../src/gdax/gdax-order-placer';
import {OrderClient} from '../src/order-client';
import {OrderPlacer} from '../src/order-placer';
import {Trader} from '../src/trader';
import {CoinType, Order, OrderPlacedResult} from '../src/types/types';

const orderClientResult: OrderPlacedResult = new OrderPlacedResult('432');
const order = new Order('buy', 123, 12, CoinType.Litecoin);
class MockOrderClientPlacer implements OrderClient, OrderPlacer {
  placeOrder(order: Order): Promise<OrderPlacedResult> {
    throw new Error('Method not implemented.');
  }
  isOrderActive(orderId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  cancelOrder(orderId: string): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
}

describe('trade() with no cancellations', () => {
  let mockOrderClient: OrderClient;
  let mockOrderPlacer: OrderPlacer;
  beforeEach(() => {
    mockOrderClient = mock(MockOrderClientPlacer);
    mockOrderPlacer = mock(MockOrderClientPlacer);
    when(mockOrderPlacer.placeOrder(anything())).thenResolve(orderClientResult);
  });

  it('Should call placed order on client with no cancellation call', () => {
    // Arrange
    const orderClient: OrderClient = instance(mockOrderClient);
    const orderPlacer: OrderPlacer = instance(mockOrderPlacer);
    const trader = new Trader(orderClient, orderPlacer);

    // Act
    const tradePromise = trader.trade(order);

    // Assert
    return tradePromise.then(result => {
      verify(mockOrderClient.isOrderActive(anyString())).never();
      verify(mockOrderClient.cancelOrder(anyString())).never();
      verify(mockOrderPlacer.placeOrder(order)).once();
    });
  });

  it('Should match placed order id', () => {
    // Arrange
    const orderClient: OrderClient = instance(mockOrderClient);
    const orderPlacer: OrderPlacer = instance(mockOrderPlacer);
    const trader = new Trader(orderClient, orderPlacer);

    // Act
    const tradePromise = trader.trade(order);

    // Assert
    return tradePromise.then(result => {
      expect(result.orderId)
          .to.equal(
              orderClientResult.orderId,
              'result id should match that of placed order');
    });
  });
});

describe('trade() with previous order', () => {
  let mockOrderClient: OrderClient;
  let mockOrderPlacer: OrderPlacer;

  const previousOrderId = '54321';
  beforeEach(() => {
    mockOrderClient = mock(MockOrderClientPlacer);
    mockOrderPlacer = mock(MockOrderClientPlacer);
    when(mockOrderPlacer.placeOrder(anything())).thenResolve(orderClientResult);
  });

  it('Should do nothing if order is no longer active', () => {
    // Arrange
    when(mockOrderClient.isOrderActive(previousOrderId)).thenResolve(false);
    const orderClient: OrderClient = instance(mockOrderClient);
    const orderPlacer: OrderPlacer = instance(mockOrderPlacer);
    const trader = new Trader(orderClient, orderPlacer);

    // Act
    const tradePromise = trader.trade(order, previousOrderId);

    // Assert
    return tradePromise.then(result => {
      verify(mockOrderClient.isOrderActive(previousOrderId)).once();
      verify(mockOrderClient.cancelOrder(anyString())).never();
      verify(mockOrderPlacer.placeOrder(order)).never();
    });
  });

  it('Should cancel previous order and place new order if order is still longer active',
     () => {
       // Arrange
       when(mockOrderClient.isOrderActive(previousOrderId)).thenResolve(true);
       when(mockOrderClient.cancelOrder(previousOrderId)).thenResolve([]);
       const orderClient: OrderClient = instance(mockOrderClient);
       const orderPlacer: OrderPlacer = instance(mockOrderPlacer);
       const trader = new Trader(orderClient, orderPlacer);

       // Act
       const tradePromise = trader.trade(order, previousOrderId);

       // Assert
       return tradePromise.then(result => {
         verify(mockOrderClient.isOrderActive(previousOrderId)).once();
         verify(mockOrderClient.cancelOrder(previousOrderId)).once();
         verify(mockOrderPlacer.placeOrder(order)).once();
       });
     });
});
