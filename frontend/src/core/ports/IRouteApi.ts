import { Route, RouteComparison } from "../domain/Route";

export interface IRouteApi {
  getAllRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  getComparison(): Promise<RouteComparison[]>;
}
