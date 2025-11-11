import { BankEntry, BankingResult } from "../domain/Banking";

export interface IBankingApi {
  getRecords(shipId: string, year: number): Promise<BankEntry[]>;
  bank(shipId: string, year: number, amount: number): Promise<BankEntry>;
  apply(shipId: string, year: number, amount: number): Promise<BankingResult>;
}
