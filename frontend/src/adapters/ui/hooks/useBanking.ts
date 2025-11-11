import { useState } from "react";
import { BankingApi } from "../../infrastructure/BankingApi";
import { ComplianceApi } from "../../infrastructure/ComplianceApi";
import { BankEntry, BankingResult } from "../../../core/domain/Banking";
import { ComplianceBalance } from "../../../core/domain/Compliance";

const bankingApi = new BankingApi();
const complianceApi = new ComplianceApi();

export const useBanking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cb, setCb] = useState<ComplianceBalance | null>(null);
  const [records, setRecords] = useState<BankEntry[]>([]);

  const fetchCb = async (shipId: string, year: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await complianceApi.getCb(shipId, year);
      setCb(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async (shipId: string, year: number) => {
    try {
      const data = await bankingApi.getRecords(shipId, year);
      setRecords(data);
    } catch (err: any) {
      console.error("Error fetching records:", err);
    }
  };

  const bank = async (shipId: string, year: number, amount: number) => {
    try {
      setLoading(true);
      setError(null);
      await bankingApi.bank(shipId, year, amount);
      await fetchCb(shipId, year);
      await fetchRecords(shipId, year);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const apply = async (
    shipId: string,
    year: number,
    amount: number
  ): Promise<BankingResult | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await bankingApi.apply(shipId, year, amount);
      await fetchCb(shipId, year);
      await fetchRecords(shipId, year);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { cb, records, loading, error, fetchCb, fetchRecords, bank, apply };
};
