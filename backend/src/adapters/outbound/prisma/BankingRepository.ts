import { PrismaClient } from "@prisma/client";
import { IBankingRepository } from "../../../core/ports/IBankingRepository";
import { BankEntry } from "../../../core/domain/Banking";

export class BankingRepository implements IBankingRepository {
  constructor(private prisma: PrismaClient) {}

  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    const entries = await this.prisma.bankEntry.findMany({
      where: { shipId, year },
      orderBy: { createdAt: "desc" },
    });
    return entries.map(this.mapToBankEntry);
  }

  async save(entry: BankEntry): Promise<BankEntry> {
    const saved = await this.prisma.bankEntry.create({
      data: {
        shipId: entry.shipId,
        year: entry.year,
        amountGco2eq: entry.amountGco2eq,
        status: entry.status,
      },
    });
    return this.mapToBankEntry(saved);
  }

  async getAvailableBalance(shipId: string): Promise<number> {
    const result = await this.prisma.bankEntry.aggregate({
      where: {
        shipId,
        status: "available",
      },
      _sum: {
        amountGco2eq: true,
      },
    });
    return parseFloat(result._sum.amountGco2eq?.toString() || "0");
  }

  async applyBanked(shipId: string, amount: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      let remaining = amount;

      const entries = await tx.bankEntry.findMany({
        where: {
          shipId,
          status: "available",
        },
        orderBy: { createdAt: "asc" },
      });

      for (const entry of entries) {
        if (remaining <= 0) break;

        const available = parseFloat(entry.amountGco2eq.toString());
        const toApply = Math.min(available, remaining);

        if (toApply === available) {
          await tx.bankEntry.update({
            where: { id: entry.id },
            data: { status: "applied" },
          });
        } else {
          await tx.bankEntry.update({
            where: { id: entry.id },
            data: { amountGco2eq: available - toApply },
          });
        }

        remaining -= toApply;
      }
    });
  }

  private mapToBankEntry(prismaEntry: any): BankEntry {
    return {
      id: prismaEntry.id,
      shipId: prismaEntry.shipId,
      year: prismaEntry.year,
      amountGco2eq: parseFloat(prismaEntry.amountGco2eq.toString()),
      status: prismaEntry.status as "available" | "applied",
      createdAt: prismaEntry.createdAt,
    };
  }
}
