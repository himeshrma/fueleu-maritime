import {
  ComplianceBalance,
  AdjustedComplianceBalance,
} from "../domain/Compliance";

export interface IComplianceRepository {
  findByShipAndYear(
    shipId: string,
    year: number
  ): Promise<ComplianceBalance | null>;
  save(compliance: ComplianceBalance): Promise<ComplianceBalance>;
  getAdjustedCb(
    shipId: string,
    year: number
  ): Promise<AdjustedComplianceBalance | null>;
}
