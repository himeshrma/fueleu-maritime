import React, { useState } from "react";
import { Layout } from "./adapters/ui/components/Layout";
import { Tabs } from "./adapters/ui/components/Tabs";
import { RoutesTab } from "./adapters/ui/pages/RoutesTab";
import { CompareTab } from "./adapters/ui/pages/CompareTab";
import { BankingTab } from "./adapters/ui/pages/BankingTab";
import { PoolingTab } from "./adapters/ui/pages/PoolingTab";

const tabs = [
  { id: "routes", label: "Routes" },
  { id: "compare", label: "Compare" },
  { id: "banking", label: "Banking" },
  { id: "pooling", label: "Pooling" },
];

function App() {
  const [activeTab, setActiveTab] = useState("routes");

  const renderTabContent = () => {
    switch (activeTab) {
      case "routes":
        return <RoutesTab />;
      case "compare":
        return <CompareTab />;
      case "banking":
        return <BankingTab />;
      case "pooling":
        return <PoolingTab />;
      default:
        return <RoutesTab />;
    }
  };

  return (
    <Layout>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {renderTabContent()}
    </Layout>
  );
}

export default App;
