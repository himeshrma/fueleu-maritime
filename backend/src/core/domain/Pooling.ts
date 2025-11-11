export interface Pool {
  id?: number;
  year: number;
  totalCbBefore: number;
  totalCbAfter: number;
  members: PoolMember[];
  createdAt?: Date;
}

export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface CreatePoolRequest {
  year: number;
  memberShipIds: string[];
}
