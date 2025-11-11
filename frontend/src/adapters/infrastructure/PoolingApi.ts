import { IPoolingApi } from "../../core/ports/IPoolingApi";
import { Pool } from "../../core/domain/Pooling";
import { apiClient } from "./apiClient";

export class PoolingApi implements IPoolingApi {
  async createPool(year: number, memberShipIds: string[]): Promise<Pool> {
    const response = await apiClient.post("/pools", { year, memberShipIds });
    return response.data.data;
  }
}
