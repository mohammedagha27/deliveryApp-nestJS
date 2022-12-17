export interface RequestUser {
  id: number;
  role: string;
}
export interface OrderCreatedEvent {
  targetAddress: object;
  sourceAddress: object;
  clientId: number;
  delivererId: number;
}
