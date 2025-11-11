import { useState } from "react";
import { PoolingApi } from "../../infrastructure/PoolingApi";
import { ComplianceApi } from "../../infrastructure/ComplianceApi";
import { Pool } from "../../../core/domain/Pooling";
import { AdjustedComplianceBalance } from "../../../core/domain/Compliance";

const poolingApi = new PoolingApi();
const complianceApi = new ComplianceApi();

export const usePooling = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adjustedCbs, setAdjustedCbs] = useState<AdjustedComplianceBalance[]>(
    []
  );

  const fetchAdjustedCbs = async (shipIds: string[], year: number) => {
    try {
      setLoading(true);
      setError(null);
      const promises = shipIds.map((id) =>
        complianceApi.getAdjustedCb(id, year)
      );
      const data = await Promise.all(promises);
      setAdjustedCbs(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPool = async (
    year: number,
    memberShipIds: string[]
  ): Promise<Pool | null> => {
    try {
      setLoading(true);
      setError(null);
      const pool = await poolingApi.createPool(year, memberShipIds);
      return pool;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { adjustedCbs, loading, error, fetchAdjustedCbs, createPool };
};
