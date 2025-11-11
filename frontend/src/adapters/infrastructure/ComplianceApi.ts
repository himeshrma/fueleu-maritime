import { IComplianceApi } from "../../core/ports/IComplianceApi";
import {
  ComplianceBalance,
  AdjustedComplianceBalance,
} from "../../core/domain/Compliance";
import { apiClient } from "./apiClient";

export class ComplianceApi implements IComplianceApi {
  async getCb(shipId: string, year: number): Promise<ComplianceBalance> {
    const response = await apiClient.get(
      `/compliance/cb?shipId=${shipId}&year=${year}`
    );
    return response.data.data;
  }

  async getAdjustedCb(
    shipId: string,
    year: number
  ): Promise<AdjustedComplianceBalance> {
    const response = await apiClient.get(
      `/compliance/adjusted-cb?shipId=${shipId}&year=${year}`
    );
    return response.data.data;
  }
}
