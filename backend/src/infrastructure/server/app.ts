import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import prisma from "../prisma/client";
import { RouteRepository } from "../../adapters/outbound/prisma/RouteRepository";
import { ComplianceRepository } from "../../adapters/outbound/prisma/ComplianceRepository";
import { BankingRepository } from "../../adapters/outbound/prisma/BankingRepository";
import { PoolRepository } from "../../adapters/outbound/prisma/PoolRepository";
import { RouteService } from "../../core/application/RouteService";
import { ComplianceService } from "../../core/application/ComplianceService";
import { BankingService } from "../../core/application/BankingService";
import { PoolingService } from "../../core/application/PoolingService";
import { RouteController } from "../../adapters/inbound/http/RouteController";
import { ComplianceController } from "../../adapters/inbound/http/ComplianceController";
import { BankingController } from "../../adapters/inbound/http/BankingController";
import { PoolingController } from "../../adapters/inbound/http/PoolingController";

export class App {
  private app: Application;

  // Create all layers
  private routeRepository = new RouteRepository(prisma);
  private complianceRepository = new ComplianceRepository(prisma);
  private bankingRepository = new BankingRepository(prisma);
  private poolRepository = new PoolRepository(prisma);

  private routeService = new RouteService(this.routeRepository);
  private complianceService = new ComplianceService(this.complianceRepository);
  private bankingService = new BankingService(
    this.bankingRepository,
    this.complianceRepository
  );
  private poolingService = new PoolingService(
    this.poolRepository,
    this.complianceRepository
  );

  private routeController = new RouteController(this.routeService);
  private complianceController = new ComplianceController(
    this.complianceService
  );
  private bankingController = new BankingController(this.bankingService);
  private poolingController = new PoolingController(this.poolingService);

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private configureRoutes(): void {
    // Health check
    this.app.get("/health", (req: Request, res: Response) => {
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
      });
    });

    // Routes endpoints
    this.app.get("/routes", this.routeController.getAllRoutes);
    this.app.post(
      "/routes/:routeId/baseline",
      this.routeController.setBaseline
    );
    this.app.get("/routes/comparison", this.routeController.getComparison);

    // Compliance endpoints
    this.app.get("/compliance/cb", this.complianceController.getCb);
    this.app.get(
      "/compliance/adjusted-cb",
      this.complianceController.getAdjustedCb
    );

    // Banking endpoints
    this.app.get("/banking/records", this.bankingController.getRecords);
    this.app.post("/banking/bank", this.bankingController.bank);
    this.app.post("/banking/apply", this.bankingController.apply);

    // Pooling endpoints
    this.app.post("/pools", this.poolingController.createPool);
  }

  private configureErrorHandling(): void {
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error("Error:", err);
        res.status(500).json({
          success: false,
          error: err.message || "Internal server error",
        });
      }
    );
  }

  public getExpressApp(): Application {
    return this.app;
  }
}
const appInstance = new App().getExpressApp();
export default appInstance;
