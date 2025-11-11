import { Pool } from "../domain/Pooling";

export interface IPoolingApi {
  createPool(year: number, memberShipIds: string[]): Promise<Pool>;
}
