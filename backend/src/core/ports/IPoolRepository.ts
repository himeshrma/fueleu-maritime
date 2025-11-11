import { Pool } from "../domain/Pooling";

export interface IPoolRepository {
  create(pool: Pool): Promise<Pool>;
  findById(id: number): Promise<Pool | null>;
  findByYear(year: number): Promise<Pool[]>;
}
