import { useState, useEffect } from "react";
import { Route, RouteComparison } from "../../../core/domain/Route";
import { RouteApi } from "../../infrastructure/RouteApi";

const routeApi = new RouteApi();

export const useRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await routeApi.getAllRoutes();
      setRoutes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setBaseline = async (routeId: string) => {
    try {
      setLoading(true);
      setError(null);
      await routeApi.setBaseline(routeId);
      await fetchRoutes();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return { routes, loading, error, setBaseline, refetch: fetchRoutes };
};

export const useComparison = () => {
  const [comparisons, setComparisons] = useState<RouteComparison[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await routeApi.getComparison();
      setComparisons(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, []);

  return { comparisons, loading, error, refetch: fetchComparison };
};
