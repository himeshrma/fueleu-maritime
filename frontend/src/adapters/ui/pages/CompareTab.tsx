import React from "react";
import { useComparison } from "../hooks/useRoutes";
import { Card } from "../components/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TARGET_INTENSITY = 89.3368;

export const CompareTab: React.FC = () => {
  const { comparisons, loading, error } = useComparison();

  if (loading)
    return <div className="text-center py-8">Loading comparison data...</div>;
  if (error)
    return <div className="text-red-600 text-center py-8">Error: {error}</div>;
  if (comparisons.length === 0) {
    return (
      <div className="text-center py-8">
        No baseline set. Please set a baseline in the Routes tab.
      </div>
    );
  }

  const baseline = comparisons[0]?.baseline;
  const chartData = comparisons.map((comp) => ({
    name: comp.comparison.routeId,
    baseline: baseline?.ghgIntensity || 0,
    comparison: comp.comparison.ghgIntensity,
    target: TARGET_INTENSITY,
  }));

  return (
    <div className="space-y-6">
      <Card title="Baseline Route">
        {baseline && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Route ID</p>
              <p className="text-lg font-semibold">{baseline.routeId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">GHG Intensity</p>
              <p className="text-lg font-semibold">
                {baseline.ghgIntensity.toFixed(2)} gCO₂e/MJ
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vessel Type</p>
              <p className="text-lg font-semibold">{baseline.vesselType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fuel Type</p>
              <p className="text-lg font-semibold">{baseline.fuelType}</p>
            </div>
          </div>
        )}
      </Card>

      <Card title="Target Compliance">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Target GHG Intensity (2025):</span>{" "}
            {TARGET_INTENSITY.toFixed(4)} gCO₂e/MJ
          </p>
          <p className="text-xs text-gray-600 mt-1">
            (2% below 91.16 gCO₂e/MJ baseline)
          </p>
        </div>
      </Card>

      <Card title="Comparison Results">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Route ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  GHG Intensity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  % Difference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Compliant
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparisons.map((comp) => (
                <tr key={comp.comparison.routeId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {comp.comparison.routeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {comp.comparison.ghgIntensity.toFixed(2)} gCO₂e/MJ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`font-semibold ${
                        comp.percentDiff > 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {comp.percentDiff > 0 ? "+" : ""}
                      {comp.percentDiff.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {comp.compliant ? (
                      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
                        ✅ Compliant
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded">
                        ❌ Non-compliant
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="GHG Intensity Comparison Chart">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              label={{ value: "gCO₂e/MJ", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="baseline" fill="#3b82f6" name="Baseline" />
            <Bar dataKey="comparison" fill="#10b981" name="Comparison" />
            <Bar dataKey="target" fill="#ef4444" name="Target" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
