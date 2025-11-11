import { Request, Response } from "express";
import { RouteService } from "../../../core/application/RouteService";
import { ApiResponse } from "../../../shared/types";

export class RouteController {
  constructor(private routeService: RouteService) {}

  getAllRoutes = async (req: Request, res: Response) => {
    try {
      const routes = await this.routeService.getAllRoutes();
      const response: ApiResponse<typeof routes> = {
        success: true,
        data: routes,
      };
      res.json(response);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message,
      });
    }
  };

  setBaseline = async (req: Request, res: Response) => {
    try {
      const { routeId } = req.params;
      const route = await this.routeService.setBaseline(routeId);
      const response: ApiResponse<typeof route> = {
        success: true,
        data: route,
        message: `Route ${routeId} set as baseline`,
      };
      res.json(response);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message,
      });
    }
  };

  getComparison = async (req: Request, res: Response) => {
    try {
      const comparisons = await this.routeService.getComparison();
      const response: ApiResponse<typeof comparisons> = {
        success: true,
        data: comparisons,
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
