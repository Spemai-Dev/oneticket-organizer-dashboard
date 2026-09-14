export interface TicketTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  available?: number;
  total?: number;
}

export interface Event {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  category: string;
  status: 'Live' | 'Upcoming' | 'Past' | 'Draft';
  imageUrl: string;
  ticketTiers: TicketTier[];
  soldCount: number;
  totalCapacity: number;
  projectedSellOutDate: string;
  paceStatus: string;
}

export interface Order {
  id: string;
  transactionId: string;
  attendeeName: string;
  attendeeEmail: string;
  tier: 'General' | 'VIP' | 'Gold';
  quantity: number;
  gateway: string;
  gatewayType: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: 'Completed' | 'Refunded' | 'Pending' | 'Failed';
}

export interface ScanCountItem {
  category: 'General' | 'Gold' | 'VIP';
  scanned: number;
  total: number;
  color: string;
}

export interface RefundItem {
  gateway: string;
  refundsCount: number;
  amount: number;
  color: string;
}

export interface SalesVelocityPoint {
  date: string;
  shortDate: string;
  volume: number;
  amount: number;
}

export interface PaymentMethodStat {
  name: string;
  key: string;
  count: number;
  amount: number;
  percentage: number;
  color: string;
}
