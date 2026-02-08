import { useState } from "react";
import Header from "@/components/Header";
import SingleCallCard from "@/components/SingleCallCard";
import SwarmCommandCenter from "@/components/SwarmCommandCenter";
import LiveSwarmFeed from "@/components/LiveSwarmFeed";
import type { StartSwarmResponse, SwarmedProvider } from "@/lib/api";

const Index = () => {
  const [isScoring, setIsScoring] = useState(false);
  const [swarmedProviders, setSwarmedProviders] = useState<SwarmedProvider[] | null>(null);

  const handleSwarmStarted = () => {
    setIsScoring(true);
    setSwarmedProviders(null);
  };

  const handleSwarmDeployed = (data: StartSwarmResponse) => {
    setIsScoring(false);
    setSwarmedProviders(data.swarmed_providers);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <SingleCallCard />
            <SwarmCommandCenter
              onSwarmStarted={handleSwarmStarted}
              onSwarmDeployed={handleSwarmDeployed}
            />
          </div>

          {/* Right column */}
          <LiveSwarmFeed isScoring={isScoring} swarmedProviders={swarmedProviders} />
        </div>
      </main>
    </div>
  );
};

export default Index;
