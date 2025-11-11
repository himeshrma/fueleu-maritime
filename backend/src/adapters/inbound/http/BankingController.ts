import { Request, Response } from "express";
import { BankingService } from "../../../core/application/BankingService";
import { ApiResponse } from "../../../shared/types";

export class BankingController {
  constructor(private bankingService: BankingService) {}

  getRecords = async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        return res.status(400).json({
          success: false,
          error: "shipId and year are required",
        });
      }

      const records = await this.bankingService.getBankRecords(
        shipId as string,
        parseInt(year as string)
      );

      const response: ApiResponse<typeof records> = {
        success: true,
        data: records,
      };
      res.json(response);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message,
      });
    }
  };

  bank = async (req: Request, res: Response) => {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || !year || !amount) {
        return res.status(400).json({
          success: false,
          error: "shipId, year, and amount are required",
        });
      }

      const entry = await this.bankingService.bankSurplus({
        shipId,
        year,
        amount,
      });

      const response: ApiResponse<typeof entry> = {
        success: true,
        data: entry,
        message: "Surplus banked successfully",
      };
      res.json(response);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message,
      });
    }
  };

  apply = async (req: Request, res: Response) => {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || !year || !amount) {
        return res.status(400).json({
          success: false,
          error: "shipId, year, and amount are required",
        });
      }

      const result = await this.bankingService.applyBanked({
        shipId,
        year,
        amount,
      });

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        message: "Banked surplus applied successfully",
      };
      res.json(response);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message,
      });
    }
  };
}
