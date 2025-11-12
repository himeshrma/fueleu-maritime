import React, { useState, useEffect } from "react";
import { usePooling } from "../hooks/usePooling";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

export const PoolingTab: React.FC = () => {
  const [year, setYear] = useState(2025);
  const [selectedShips, setSelectedShips] = useState<string[]>([
    "SHIP001",
    "SHIP002",
  ]);
  const { adjustedCbs, loading, error, fetchAdjustedCbs, createPool } =
    usePooling();
  const [poolResult, setPoolResult] = useState<any>(null);

  const availableShips = ["SHIP001", "SHIP002", "SHIP003", "SHIP004"];

  useEffect(() => {
    if (selectedShips.length > 0) {
      fetchAdjustedCbs(selectedShips, year);
    }
  }, [selectedShips, year]);

  const toggleShip = (shipId: string) => {
    setSelectedShips((prev) =>
      prev.includes(shipId)
        ? prev.filter((id) => id !== shipId)
        : [...prev, shipId]
    );
  };

  const totalCb = adjustedCbs.reduce((sum, cb) => sum + cb.adjustedCb, 0);
  const isValidPool = totalCb >= 0;

  const handleCreatePool = async () => {
    if (!isValidPool) {
      alert("Invalid pool: total compliance balance must be non-negative");
      return;
    }
    if (selectedShips.length < 2) {
      alert("Pool must have at least 2 members");
      return;
    }
    const pool = await createPool(year, selectedShips);
    if (pool) {
      setPoolResult(pool);
      alert("Pool created successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Pool Configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Pool Members
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableShips.map((shipId) => (
                <button
                  key={shipId}
                  onClick={() => toggleShip(shipId)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    selectedShips.includes(shipId)
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-primary"
                  }`}
                >
                  {shipId}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Card title="Pool Members - Adjusted Compliance Balance">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : adjustedCbs.length > 0 ? (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ship ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      CB (tCO₂eq)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Banked (tCO₂eq)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Adjusted CB
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adjustedCbs.map((cb) => (
                    <tr key={cb.shipId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cb.shipId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cb.cbGco2eq.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cb.bankedAmount.toFixed(2)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                          cb.adjustedCb >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {cb.adjustedCb.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {cb.adjustedCb >= 0 ? (
                          <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
                            Surplus
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded">
                            Deficit
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              className={`p-4 rounded-lg border-2 ${
                isValidPool
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p className="text-sm font-medium">
                <span className="font-semibold">Pool Total CB:</span>{" "}
                <span
                  className={isValidPool ? "text-green-700" : "text-red-700"}
                >
                  {totalCb.toFixed(2)} tCO₂eq
                </span>
              </p>
              <p className="text-xs mt-1 text-gray-600">
                {isValidPool
                  ? "✅ Valid pool (total ≥ 0)"
                  : "❌ Invalid pool (total < 0)"}
              </p>
            </div>

            <Button
              onClick={handleCreatePool}
              disabled={!isValidPool || selectedShips.length < 2 || loading}
            >
              Create Pool
            </Button>
          </div>
        ) : (
          <p className="text-gray-500">Select ships to view compliance data</p>
        )}
      </Card>

      {poolResult && (
        <Card title="Pool Creation Result">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Total CB Before</p>
                <p className="text-lg font-semibold">
                  {poolResult.totalCbBefore.toFixed(2)} tCO₂eq
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total CB After</p>
                <p className="text-lg font-semibold">
                  {poolResult.totalCbAfter.toFixed(2)} tCO₂eq
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ship ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      CB Before
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      CB After
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Change
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {poolResult.members.map((member: any) => {
                    const change = member.cbAfter - member.cbBefore;
                    return (
                      <tr key={member.shipId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.shipId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.cbBefore.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.cbAfter.toFixed(2)}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                            change >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {change >= 0 ? "+" : ""}
                          {change.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
