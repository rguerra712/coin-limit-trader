import { OrderDetails } from "./types/types";
import { GdaxPriceFinder } from "./gdax/gdax-price-finder";
import { OrderClient } from "../src/order-client";
import { OrderPlacer } from "../src/order-placer";
import { Trader } from "../src/trader";
import {
    CoinType,
    Order,
    OrderPlacedResult,
    OrderDetails
} from "../src/types/types";
import { OrderScheduler } from "./aws/order-scheduler";
import { notDeepEqual } from "assert";

const orderClientResult: OrderPlacedResult = new OrderPlacedResult("432");
const order = new Order("buy", 123, 12, CoinType.Litecoin);

describe("trade() with no cancellations", () => {
    let orderClientMock: OrderClient;
    let orderPlacerMock: OrderPlacer;
    let orderSchedulerMock: OrderScheduler;
    let priceFinderMock: GdaxPriceFinder;
    let mockOrderClient: jest.Mock<OrderClient>;
    let mockOrderPlacer: jest.Mock<OrderPlacer>;
    let mockOrderScheduler: jest.Mock<OrderScheduler>;
    let mockPriceFinder: jest.Mock<GdaxPriceFinder>;

    beforeEach(() => {
        // Mock defaults for easier test runs
        mockOrderClient = jest.fn<OrderClient>();
        mockOrderPlacer = jest.fn<OrderPlacer>();
        mockOrderScheduler = jest.fn<OrderScheduler>();
        mockPriceFinder = jest.fn<GdaxPriceFinder>();
        orderClientMock = new mockOrderClient();
        orderPlacerMock = new mockOrderPlacer();
        orderSchedulerMock = new mockOrderScheduler();
        priceFinderMock = new mockPriceFinder();
    });

    it("Should call placed order on client with no cancellation call", async () => {
        // Arrange
        mockOrderClient.mockImplementation(() => ({
            getOrderDetails: jest.fn(),
            cancelOrder: jest.fn()
        }));
        orderClientMock = new mockOrderClient();
        mockOrderPlacer.mockImplementation(() => ({
            placeOrder: jest.fn()
        }));
        orderPlacerMock = new mockOrderPlacer();
        const trader = new Trader(
            orderClientMock,
            orderPlacerMock,
            orderSchedulerMock,
            priceFinderMock
        );

        // Act
        await trader.trade(order, 0);

        // Assert
        expect(orderClientMock.getOrderDetails).not.toHaveBeenCalled();
        expect(orderClientMock.cancelOrder).not.toHaveBeenCalled();
        expect(orderPlacerMock.placeOrder).toHaveBeenCalled();
    });

    it("Should match placed order id", async () => {
        // Arrange
        mockOrderClient.mockImplementation(() => ({
            getOrderDetails: jest.fn(),
            cancelOrder: jest.fn()
        }));
        orderClientMock = new mockOrderClient();
        mockOrderPlacer.mockImplementation(() => ({
            placeOrder: jest.fn().mockReturnValue(orderClientResult)
        }));
        orderPlacerMock = new mockOrderPlacer();
        const trader = new Trader(
            orderClientMock,
            orderPlacerMock,
            orderSchedulerMock,
            priceFinderMock
        );

        // Act
        const result = await trader.trade(order, 0);

        // Assert
        expect(result.orderId).toBe(orderClientResult.orderId);
    });
});

describe("trade() with previous order", () => {
    let orderClientMock: OrderClient;
    let orderPlacerMock: OrderPlacer;
    let orderSchedulerMock: OrderScheduler;
    let priceFinderMock: GdaxPriceFinder;
    let mockOrderClient: jest.Mock<OrderClient>;
    let mockOrderPlacer: jest.Mock<OrderPlacer>;
    let mockOrderScheduler: jest.Mock<OrderScheduler>;
    let mockPriceFinder: jest.Mock<GdaxPriceFinder>;

    beforeEach(() => {
        // Mock defaults for easier test runs
        mockOrderClient = jest.fn<OrderClient>();
        mockOrderPlacer = jest.fn<OrderPlacer>();
        mockOrderScheduler = jest.fn<OrderScheduler>();
        mockPriceFinder = jest.fn<GdaxPriceFinder>(() => ({
            getCurrentPrice: jest
                .fn<Promise<number>>()
                .mockReturnValue(Promise.resolve(123.45))
        }));
        orderClientMock = new mockOrderClient();
        orderPlacerMock = new mockOrderPlacer();
        orderSchedulerMock = new mockOrderScheduler();
        priceFinderMock = new mockPriceFinder();
    });

    it("Should do nothing if order is no longer active", async () => {
        // Arrange
        const orderDetails = { isOrderActive: false, price: 0 };
        mockOrderClient.mockImplementation(() => ({
            getOrderDetails: jest
                .fn()
                .mockReturnValue(Promise.resolve(orderDetails)),
            cancelOrder: jest.fn()
        }));
        orderClientMock = new mockOrderClient();
        mockOrderPlacer.mockImplementation(() => ({
            placeOrder: jest.fn()
        }));
        orderPlacerMock = new mockOrderPlacer();
        const trader = new Trader(
            orderClientMock,
            orderPlacerMock,
            orderSchedulerMock,
            priceFinderMock
        );

        // Act
        await trader.trade(order, 0, "IdToCancel");

        // Assert
        expect(orderClientMock.getOrderDetails).toHaveBeenCalled();
        expect(orderClientMock.cancelOrder).not.toHaveBeenCalled();
        expect(orderPlacerMock.placeOrder).not.toHaveBeenCalled();
    });

    it("Should cancel previous order and place new order if order is still longer active", async () => {
        // Arrange
        const orderDetails = { isOrderActive: true, price: 0 };
        mockOrderClient.mockImplementation(() => ({
            getOrderDetails: jest
                .fn()
                .mockReturnValue(Promise.resolve(orderDetails)),
            cancelOrder: jest.fn()
        }));
        orderClientMock = new mockOrderClient();
        mockOrderPlacer.mockImplementation(() => ({
            placeOrder: jest.fn()
        }));
        orderPlacerMock = new mockOrderPlacer();
        const trader = new Trader(
            orderClientMock,
            orderPlacerMock,
            orderSchedulerMock,
            priceFinderMock
        );

        // Act
        await trader.trade(order, 0, "IdToCancel");

        // Assert
        expect(orderClientMock.getOrderDetails).toHaveBeenCalled();
        expect(orderClientMock.cancelOrder).toHaveBeenCalled();
        expect(orderPlacerMock.placeOrder).toHaveBeenCalled();
    });
});
