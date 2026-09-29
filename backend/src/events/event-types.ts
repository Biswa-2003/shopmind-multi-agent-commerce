/** Every domain event and the data it carries. */
export interface EventPayloads {
  OrderCreated: {
    orderId: string;
    userId: string;
    paymentMethod: "online" | "cod";
    totalAmount: number;
    items: { productId: string; quantity: number }[];
  };
  PaymentSucceeded: {
    orderId: string;
    paymentId: string;
    gatewayPaymentId: string;
    amount: number;
  };
  PaymentFailed: {
    orderId: string;
    paymentId: string;
    reason: string;
  };
  StockReservationFailed: {
    orderId: string;
    productIds: string[];
  };
  OrderCancelled: {
    orderId: string;
    reason: CancelReason;
  };
}

export type EventType = keyof EventPayloads;

export type CancelReason = "out_of_stock" | "payment_timeout" | "customer_request";

/** What travels through the queue: the outbox row's id doubles as the event id for idempotency. */
export interface EventEnvelope<T extends EventType = EventType> {
  eventId: string;
  type: T;
  payload: EventPayloads[T];
  occurredAt: string;
}
