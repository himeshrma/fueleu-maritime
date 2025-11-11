import { PrismaClient } from "@prisma/client";
import { IPoolRepository } from "../../../core/ports/IPoolRepository";
import { Pool, PoolMember } from "../../../core/domain/Pooling";

export class PoolRepository implements IPoolRepository {
  constructor(private prisma: PrismaClient) {}

  async create(pool: Pool): Promise<Pool> {
    const created = await this.prisma.pool.create({
      data: {
        year: pool.year,
        totalCbBefore: pool.totalCbBefore,
        totalCbAfter: pool.totalCbAfter,
        members: {
          create: pool.members.map((m) => ({
            shipId: m.shipId,
            cbBefore: m.cbBefore,
            cbAfter: m.cbAfter,
          })),
        },
      },
      include: {
        members: true,
      },
    });
    return this.mapToPool(created);
  }

  async findById(id: number): Promise<Pool | null> {
    const pool = await this.prisma.pool.findUnique({
      where: { id },
      include: { members: true },
    });
    return pool ? this.mapToPool(pool) : null;
  }

  async findByYear(year: number): Promise<Pool[]> {
    const pools = await this.prisma.pool.findMany({
      where: { year },
      include: { members: true },
      orderBy: { createdAt: "desc" },
    });
    return pools.map(this.mapToPool);
  }

  private mapToPool(prismaPool: any): Pool {
    return {
      id: prismaPool.id,
      year: prismaPool.year,
      totalCbBefore: parseFloat(prismaPool.totalCbBefore.toString()),
      totalCbAfter: parseFloat(prismaPool.totalCbAfter.toString()),
      members: prismaPool.members.map((m: any) => this.mapToPoolMember(m)),
      createdAt: prismaPool.createdAt,
    };
  }

  private mapToPoolMember(prismaMember: any): PoolMember {
    return {
      shipId: prismaMember.shipId,
      cbBefore: parseFloat(prismaMember.cbBefore.toString()),
      cbAfter: parseFloat(prismaMember.cbAfter.toString()),
    };
  }
}
