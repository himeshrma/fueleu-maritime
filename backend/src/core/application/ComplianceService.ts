import { IComplianceRepository } from "../ports/IComplianceRepository";
import {
  ComplianceBalance,
  AdjustedComplianceBalance,
} from "../domain/Compliance";
import { AppError } from "../../shared/types";

const TARGET_INTENSITY_2025 = 89.3368;
const LCV_VLSFO = 41000;

export class ComplianceService {
  constructor(private complianceRepository: IComplianceRepository) {}

  async getComplianceBalance(
    shipId: string,
    year: number
  ): Promise<ComplianceBalance> {
    const cb = await this.complianceRepository.findByShipAndYear(shipId, year);
    if (!cb) {
      throw new AppError(
        404,
        `Compliance balance not found for ship ${shipId} in year ${year}`
      );
    }
    return cb;
  }

  async getAdjustedCb(
    shipId: string,
    year: number
  ): Promise<AdjustedComplianceBalance> {
    const adjusted = await this.complianceRepository.getAdjustedCb(
      shipId,
      year
    );
    if (!adjusted) {
      throw new AppError(
        404,
        `Adjusted compliance balance not found for ship ${shipId}`
      );
    }
    return adjusted;
  }

  computeComplianceBalance(
    actualIntensity: number,
    fuelConsumption: number
  ): number {
    const energyInScope = fuelConsumption * LCV_VLSFO;
    return (TARGET_INTENSITY_2025 - actualIntensity) * energyInScope;
  }
}
