import { IPoolRepository } from "../ports/IPoolRepository";
import { IComplianceRepository } from "../ports/IComplianceRepository";
import { Pool, PoolMember, CreatePoolRequest } from "../domain/Pooling";
import { AppError } from "../../shared/types";

export class PoolingService {
  constructor(
    private poolRepository: IPoolRepository,
    private complianceRepository: IComplianceRepository
  ) {}

  async createPool(request: CreatePoolRequest): Promise<Pool> {
    const members: PoolMember[] = [];
    let totalCbBefore = 0;

    // Step 1: Fetch all member compliance balances
    for (const shipId of request.memberShipIds) {
      const adjusted = await this.complianceRepository.getAdjustedCb(
        shipId,
        request.year
      );
      if (!adjusted) {
        throw new AppError(404, `Adjusted CB not found for ship ${shipId}`);
      }
      members.push({
        shipId,
        cbBefore: adjusted.adjustedCb,
        cbAfter: 0,
      });
      totalCbBefore += adjusted.adjustedCb;
    }

    // Step 2: Validate pool total
    if (totalCbBefore < 0) {
      throw new AppError(
        400,
        "Pool total compliance balance cannot be negative"
      );
    }

    // Step 3: Greedy allocation algorithm
    members.sort((a, b) => b.cbBefore - a.cbBefore);

    let remainingSurplus = 0;
    const deficits: PoolMember[] = [];

    // Identify surpluses and deficits
    for (const member of members) {
      if (member.cbBefore > 0) {
        remainingSurplus += member.cbBefore;
      } else {
        deficits.push(member);
      }
    }

    // Allocate surplus to deficits
    for (const deficit of deficits) {
      const needed = Math.abs(deficit.cbBefore);
      const allocated = Math.min(needed, remainingSurplus);
      deficit.cbAfter = deficit.cbBefore + allocated;
      remainingSurplus -= allocated;

      if (deficit.cbAfter < deficit.cbBefore) {
        throw new AppError(
          400,
          `Ship ${deficit.shipId} would exit worse after pooling`
        );
      }
    }

    // Distribute remaining surplus back
    for (const member of members) {
      if (member.cbBefore > 0) {
        member.cbAfter = remainingSurplus > 0 ? member.cbBefore : 0;
        if (member.cbAfter < 0) {
          throw new AppError(
            400,
            `Ship ${member.shipId} would exit negative after pooling`
          );
        }
      }
    }

    const totalCbAfter = members.reduce((sum, m) => sum + m.cbAfter, 0);
    const pool: Pool = {
      year: request.year,
      totalCbBefore,
      totalCbAfter,
      members,
    };

    return this.poolRepository.create(pool);
  }
}
