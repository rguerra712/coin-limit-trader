import { Order } from "../types/types";

export class EventOrderExtractor {
    // tslint:disable-next-line:no-any
    extractOrderFrom = (orderObject: any): Order => {
        const orderType = orderObject["orderType"];
        const price = Number(orderObject["price"]);
        const size = Number(orderObject["size"]);
        const coinType = orderObject["coinId"];
        const order = new Order(orderType, price, size, coinType);
        return order;
    };
}
