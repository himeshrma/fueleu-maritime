import { IBankingApi } from "../../core/ports/IBankingApi";
import { BankEntry, BankingResult } from "../../core/domain/Banking";
import { apiClient } from "./apiClient";

export class BankingApi implements IBankingApi {
  async getRecords(shipId: string, year: number): Promise<BankEntry[]> {
    const response = await apiClient.get(
      `/banking/records?shipId=${shipId}&year=${year}`
    );
    return response.data.data;
  }

  async bank(shipId: string, year: number, amount: number): Promise<BankEntry> {
    const response = await apiClient.post("/banking/bank", {
      shipId,
      year,
      amount,
    });
    return response.data.data;
  }

  async apply(
    shipId: string,
    year: number,
    amount: number
  ): Promise<BankingResult> {
    const response = await apiClient.post("/banking/apply", {
      shipId,
      year,
      amount,
    });
    return response.data.data;
  }
}
