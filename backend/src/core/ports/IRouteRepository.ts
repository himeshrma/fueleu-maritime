import { Route, RouteComparison } from "../domain/Route";

export interface IRouteRepository {
  findAll(): Promise<Route[]>;
  findById(id: number): Promise<Route | null>;
  findByRouteId(routeId: string): Promise<Route | null>;
  findBaseline(): Promise<Route | null>;
  setBaseline(routeId: string): Promise<Route>;
  getComparison(): Promise<RouteComparison[]>;
}
