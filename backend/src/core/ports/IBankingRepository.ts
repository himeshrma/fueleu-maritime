import { BankEntry } from "../domain/Banking";

export interface IBankingRepository {
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
  save(entry: BankEntry): Promise<BankEntry>;
  getAvailableBalance(shipId: string): Promise<number>;
  applyBanked(shipId: string, amount: number): Promise<void>;
}
