import {
  ComplianceBalance,
  AdjustedComplianceBalance,
} from "../domain/Compliance";

export interface IComplianceApi {
  getCb(shipId: string, year: number): Promise<ComplianceBalance>;
  getAdjustedCb(
    shipId: string,
    year: number
  ): Promise<AdjustedComplianceBalance>;
}
