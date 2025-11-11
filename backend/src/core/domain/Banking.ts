export interface BankEntry {
  id?: number;
  shipId: string;
  year: number;
  amountGco2eq: number;
  status: "available" | "applied";
  createdAt?: Date;
}

export interface BankingOperation {
  shipId: string;
  year: number;
  amount: number;
}

export interface BankingResult {
  cbBefore: number;
  applied: number;
  cbAfter: number;
}
