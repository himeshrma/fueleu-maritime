import { IRouteApi } from "../../core/ports/IRouteApi";
import { Route, RouteComparison } from "../../core/domain/Route";
import { apiClient } from "./apiClient";

export class RouteApi implements IRouteApi {
  async getAllRoutes(): Promise<Route[]> {
    const response = await apiClient.get("/routes");
    return response.data.data;
  }

  async setBaseline(routeId: string): Promise<Route> {
    const response = await apiClient.post(`/routes/${routeId}/baseline`);
    return response.data.data;
  }

  async getComparison(): Promise<RouteComparison[]> {
    const response = await apiClient.get("/routes/comparison");
    return response.data.data;
  }
}
