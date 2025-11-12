import React, { useState } from "react";
import { useRoutes } from "../hooks/useRoutes";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

export const RoutesTab: React.FC = () => {
  const { routes, loading, error, setBaseline } = useRoutes();
  const [vesselFilter, setVesselFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const filteredRoutes = routes.filter((route) => {
    return (
      (!vesselFilter || route.vesselType === vesselFilter) &&
      (!fuelFilter || route.fuelType === fuelFilter) &&
      (!yearFilter || route.year.toString() === yearFilter)
    );
  });

  const vesselTypes = Array.from(new Set(routes.map((r) => r.vesselType)));
  const fuelTypes = Array.from(new Set(routes.map((r) => r.fuelType)));
  const years = Array.from(new Set(routes.map((r) => r.year.toString())));

  if (loading) return <div className="text-center py-8">Loading routes...</div>;
  if (error)
    return <div className="text-red-600 text-center py-8">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <Card title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vessel Type
            </label>
            <select
              value={vesselFilter}
              onChange={(e) => setVesselFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="">All</option>
              {vesselTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Type
            </label>
            <select
              value={fuelFilter}
              onChange={(e) => setFuelFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="">All</option>
              {fuelTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="">All</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card title="Routes">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Route ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vessel Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fuel Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  GHG Intensity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fuel (t)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Distance (km)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoutes.map((route) => (
                <tr
                  key={route.routeId}
                  className={route.isBaseline ? "bg-blue-50" : ""}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {route.routeId}
                    {route.isBaseline && (
                      <span className="ml-2 px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded">
                        BASELINE
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.vesselType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.fuelType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.ghgIntensity.toFixed(2)} gCO₂e/MJ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.fuelConsumption.toFixed(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.distance.toFixed(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {!route.isBaseline && (
                      <Button
                        size="sm"
                        onClick={() => setBaseline(route.routeId)}
                      >
                        Set Baseline
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
