import { Request, Response } from "express";
import { PoolingService } from "../../../core/application/PoolingService";
import { ApiResponse } from "../../../shared/types";

export class PoolingController {
  constructor(private poolingService: PoolingService) {}

  createPool = async (req: Request, res: Response) => {
    try {
      const { year, memberShipIds } = req.body;

      if (!year || !memberShipIds || !Array.isArray(memberShipIds)) {
        return res.status(400).json({
          success: false,
          error: "year and memberShipIds (array) are required",
        });
      }

      const pool = await this.poolingService.createPool({
        year,
        memberShipIds,
      });

      const response: ApiResponse<typeof pool> = {
        success: true,
        data: pool,
        message: "Pool created successfully",
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
