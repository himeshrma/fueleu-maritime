import { PrismaClient } from "@prisma/client";
import { IRouteRepository } from "../../../core/ports/IRouteRepository";
import { Route, RouteComparison } from "../../../core/domain/Route";
import { AppError } from "../../../shared/types";

export class RouteRepository implements IRouteRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Route[]> {
    const routes = await this.prisma.route.findMany({
      orderBy: [{ year: "desc" }, { routeId: "asc" }],
    });
    return routes.map(this.mapToRoute);
  }

  async findById(id: number): Promise<Route | null> {
    const route = await this.prisma.route.findUnique({
      where: { id },
    });
    return route ? this.mapToRoute(route) : null;
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const route = await this.prisma.route.findUnique({
      where: { routeId },
    });
    return route ? this.mapToRoute(route) : null;
  }

  async findBaseline(): Promise<Route | null> {
    const route = await this.prisma.route.findFirst({
      where: { isBaseline: true },
    });
    return route ? this.mapToRoute(route) : null;
  }

  async setBaseline(routeId: string): Promise<Route> {
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.route.updateMany({
        where: { isBaseline: true },
        data: { isBaseline: false },
      });

      const route = await tx.route.update({
        where: { routeId },
        data: { isBaseline: true },
      });

      return route;
    });

    return this.mapToRoute(result);
  }

  async getComparison(): Promise<RouteComparison[]> {
    const baseline = await this.findBaseline();
    if (!baseline) {
      throw new AppError(400, "No baseline route set");
    }

    const routes = await this.findAll();
    const TARGET_INTENSITY = 89.3368;

    return routes
      .filter((r) => r.routeId !== baseline.routeId)
      .map((comparison) => ({
        baseline,
        comparison,
        percentDiff:
          (comparison.ghgIntensity / baseline.ghgIntensity - 1) * 100,
        compliant: comparison.ghgIntensity <= TARGET_INTENSITY,
      }));
  }

  private mapToRoute(prismaRoute: any): Route {
    return {
      id: prismaRoute.id,
      routeId: prismaRoute.routeId,
      vesselType: prismaRoute.vesselType,
      fuelType: prismaRoute.fuelType,
      year: prismaRoute.year,
      ghgIntensity: parseFloat(prismaRoute.ghgIntensity.toString()),
      fuelConsumption: parseFloat(prismaRoute.fuelConsumption.toString()),
      distance: parseFloat(prismaRoute.distance.toString()),
      totalEmissions: parseFloat(prismaRoute.totalEmissions.toString()),
      isBaseline: prismaRoute.isBaseline,
    };
  }
}
