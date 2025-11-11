import { IBankingRepository } from "../ports/IBankingRepository";
import { IComplianceRepository } from "../ports/IComplianceRepository";
import { BankEntry, BankingOperation, BankingResult } from "../domain/Banking";
import { AppError } from "../../shared/types";

export class BankingService {
  constructor(
    private bankingRepository: IBankingRepository,
    private complianceRepository: IComplianceRepository
  ) {}

  async getBankRecords(shipId: string, year: number): Promise<BankEntry[]> {
    return this.bankingRepository.findByShipAndYear(shipId, year);
  }

  async bankSurplus(operation: BankingOperation): Promise<BankEntry> {
    const cb = await this.complianceRepository.findByShipAndYear(
      operation.shipId,
      operation.year
    );

    if (!cb || cb.cbGco2eq <= 0) {
      throw new AppError(
        400,
        "Cannot bank negative or zero compliance balance"
      );
    }

    if (operation.amount > cb.cbGco2eq) {
      throw new AppError(
        400,
        "Cannot bank more than available compliance balance"
      );
    }

    const entry: BankEntry = {
      shipId: operation.shipId,
      year: operation.year,
      amountGco2eq: operation.amount,
      status: "available",
    };

    return this.bankingRepository.save(entry);
  }

  async applyBanked(operation: BankingOperation): Promise<BankingResult> {
    const available = await this.bankingRepository.getAvailableBalance(
      operation.shipId
    );

    if (available < operation.amount) {
      throw new AppError(400, "Insufficient banked balance");
    }

    const cb = await this.complianceRepository.findByShipAndYear(
      operation.shipId,
      operation.year
    );

    if (!cb) {
      throw new AppError(404, "Compliance balance not found");
    }

    const cbBefore = cb.cbGco2eq;
    await this.bankingRepository.applyBanked(
      operation.shipId,
      operation.amount
    );
    const cbAfter = cbBefore + operation.amount;

    return {
      cbBefore,
      applied: operation.amount,
      cbAfter,
    };
  }
}
