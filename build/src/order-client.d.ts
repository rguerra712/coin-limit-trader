/**
 * A client wrapping an API to place/cancel orders based on their status and
 * reschedule periodically if needed
 */
export interface OrderClient {
    isOrderActive(orderId: string): Promise<boolean>;
    cancelOrder(orderId: string): Promise<string[]>;
}
