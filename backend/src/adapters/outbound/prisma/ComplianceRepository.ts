import { PrismaClient } from "@prisma/client";
import { IComplianceRepository } from "../../../core/ports/IComplianceRepository";
import {
  ComplianceBalance,
  AdjustedComplianceBalance,
} from "../../../core/domain/Compliance";

export class ComplianceRepository implements IComplianceRepository {
  constructor(private prisma: PrismaClient) {}

  async findByShipAndYear(
    shipId: string,
    year: number
  ): Promise<ComplianceBalance | null> {
    const compliance = await this.prisma.shipCompliance.findUnique({
      where: {
        shipId_year: { shipId, year },
      },
    });
    return compliance ? this.mapToCompliance(compliance) : null;
  }

  async save(compliance: ComplianceBalance): Promise<ComplianceBalance> {
    const saved = await this.prisma.shipCompliance.upsert({
      where: {
        shipId_year: { shipId: compliance.shipId, year: compliance.year },
      },
      update: {
        cbGco2eq: compliance.cbGco2eq,
        targetIntensity: compliance.targetIntensity,
        actualIntensity: compliance.actualIntensity,
        energyInScope: compliance.energyInScope,
      },
      create: {
        shipId: compliance.shipId,
        year: compliance.year,
        cbGco2eq: compliance.cbGco2eq,
        targetIntensity: compliance.targetIntensity,
        actualIntensity: compliance.actualIntensity,
        energyInScope: compliance.energyInScope,
      },
    });
    return this.mapToCompliance(saved);
  }

  async getAdjustedCb(
    shipId: string,
    year: number
  ): Promise<AdjustedComplianceBalance | null> {
    const cb = await this.findByShipAndYear(shipId, year);
    if (!cb) return null;

    const bankEntries = await this.prisma.bankEntry.aggregate({
      where: {
        shipId,
        status: "available",
      },
      _sum: {
        amountGco2eq: true,
      },
    });

    const bankedAmount = parseFloat(
      bankEntries._sum.amountGco2eq?.toString() || "0"
    );
    const adjustedCb = cb.cbGco2eq + bankedAmount;

    return {
      ...cb,
      bankedAmount,
      adjustedCb,
    };
  }

  private mapToCompliance(prismaCompliance: any): ComplianceBalance {
    return {
      shipId: prismaCompliance.shipId,
      year: prismaCompliance.year,
      cbGco2eq: parseFloat(prismaCompliance.cbGco2eq.toString()),
      targetIntensity: parseFloat(prismaCompliance.targetIntensity.toString()),
      actualIntensity: parseFloat(prismaCompliance.actualIntensity.toString()),
      energyInScope: parseFloat(prismaCompliance.energyInScope.toString()),
    };
  }
}
