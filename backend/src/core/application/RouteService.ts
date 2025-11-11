import { IRouteRepository } from "../ports/IRouteRepository";
import { Route, RouteComparison } from "../domain/Route";
import { AppError } from "../../shared/types";

export class RouteService {
  constructor(private routeRepository: IRouteRepository) {}

  async getAllRoutes(): Promise<Route[]> {
    return this.routeRepository.findAll();
  }

  async setBaseline(routeId: string): Promise<Route> {
    const route = await this.routeRepository.findByRouteId(routeId);
    if (!route) {
      throw new AppError(404, `Route ${routeId} not found`);
    }
    return this.routeRepository.setBaseline(routeId);
  }

  async getComparison(): Promise<RouteComparison[]> {
    const baseline = await this.routeRepository.findBaseline();
    if (!baseline) {
      throw new AppError(400, "No baseline route set");
    }
    return this.routeRepository.getComparison();
  }
}
