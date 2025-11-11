import { Request, Response } from "express";
import { ComplianceService } from "../../../core/application/ComplianceService";
import { ApiResponse } from "../../../shared/types";

export class ComplianceController {
  constructor(private complianceService: ComplianceService) {}

  getCb = async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        return res.status(400).json({
          success: false,
          error: "shipId and year are required",
        });
      }

      const cb = await this.complianceService.getComplianceBalance(
        shipId as string,
        parseInt(year as string)
      );

      const response: ApiResponse<typeof cb> = {
        success: true,
        data: cb,
      };
      res.json(response);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message,
      });
    }
  };

  getAdjustedCb = async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        return res.status(400).json({
          success: false,
          error: "shipId and year are required",
        });
      }

      const adjusted = await this.complianceService.getAdjustedCb(
        shipId as string,
        parseInt(year as string)
      );

      const response: ApiResponse<typeof adjusted> = {
        success: true,
        data: adjusted,
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
