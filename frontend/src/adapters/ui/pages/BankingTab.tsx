import React, { useState, useEffect } from "react";
import { useBanking } from "../hooks/useBanking";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

export const BankingTab: React.FC = () => {
  const [shipId, setShipId] = useState("SHIP001");
  const [year, setYear] = useState(2025);
  const [bankAmount, setBankAmount] = useState("");
  const [applyAmount, setApplyAmount] = useState("");
  const { cb, records, loading, error, fetchCb, fetchRecords, bank, apply } =
    useBanking();

  useEffect(() => {
    fetchCb(shipId, year);
    fetchRecords(shipId, year - 1);
  }, [shipId, year]);

  const handleBank = async () => {
    const amount = parseFloat(bankAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive amount");
      return;
    }
    const success = await bank(shipId, year, amount);
    if (success) {
      setBankAmount("");
      alert("Surplus banked successfully!");
    }
  };

  const handleApply = async () => {
    const amount = parseFloat(applyAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive amount");
      return;
    }
    const result = await apply(shipId, year, amount);
    if (result) {
      setApplyAmount("");
      alert(
        `Banking applied!\nCB Before: ${result.cbBefore.toFixed(
          2
        )}\nApplied: ${result.applied.toFixed(
          2
        )}\nCB After: ${result.cbAfter.toFixed(2)}`
      );
    }
  };

  const availableBanked = records
    .filter((r) => r.status === "available")
    .reduce((sum, r) => sum + r.amountGco2eq, 0);

  return (
    <div className="space-y-6">
      <Card title="Select Ship and Year">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ship ID
            </label>
            <select
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="SHIP001">SHIP001</option>
              <option value="SHIP002">SHIP002</option>
              <option value="SHIP003">SHIP003</option>
              <option value="SHIP004">SHIP004</option>
            </select>
          </div>
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
        </div>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Card title="Current Compliance Balance">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : cb ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Compliance Balance</p>
              <p
                className={`text-2xl font-bold ${
                  cb.cbGco2eq >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {cb.cbGco2eq.toFixed(2)} tCO₂eq
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Target Intensity</p>
              <p className="text-2xl font-bold text-gray-900">
                {cb.targetIntensity.toFixed(4)} gCO₂e/MJ
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Actual Intensity</p>
              <p className="text-2xl font-bold text-gray-900">
                {cb.actualIntensity.toFixed(4)} gCO₂e/MJ
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No compliance data available</p>
        )}
      </Card>

      <Card title="Bank Positive Surplus (Article 20)">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Bank positive compliance balance for use in future years.
          </p>
          <div className="flex gap-4">
            <input
              type="number"
              value={bankAmount}
              onChange={(e) => setBankAmount(e.target.value)}
              placeholder="Amount to bank (tCO₂eq)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              disabled={!cb || cb.cbGco2eq <= 0}
            />
            <Button
              onClick={handleBank}
              disabled={!cb || cb.cbGco2eq <= 0 || loading}
            >
              Bank Surplus
            </Button>
          </div>
          {cb && cb.cbGco2eq <= 0 && (
            <p className="text-sm text-red-600">
              Cannot bank negative or zero compliance balance
            </p>
          )}
        </div>
      </Card>

      <Card title="Apply Banked Surplus">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Available Banked Balance:</span>{" "}
              {availableBanked.toFixed(2)} tCO₂eq
            </p>
          </div>
          <div className="flex gap-4">
            <input
              type="number"
              value={applyAmount}
              onChange={(e) => setApplyAmount(e.target.value)}
              placeholder="Amount to apply (tCO₂eq)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              disabled={availableBanked <= 0}
            />
            <Button
              onClick={handleApply}
              disabled={availableBanked <= 0 || loading}
            >
              Apply Banked
            </Button>
          </div>
          {availableBanked <= 0 && (
            <p className="text-sm text-red-600">No banked balance available</p>
          )}
        </div>
      </Card>

      <Card title="Banking Records">
        {records.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount (tCO₂eq)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.amountGco2eq.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          record.status === "available"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.createdAt
                        ? new Date(record.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No banking records found</p>
        )}
      </Card>
    </div>
  );
};
